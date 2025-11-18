#!/usr/bin/env node

/**
 * Migration script to move images from Cloudinary to local storage
 *
 * Usage:
 * ATLAS_URI="your-atlas-connection-string" npm run migrate:images
 *
 * This script:
 * 1. Connects to MongoDB Atlas using ATLAS_URI
 * 2. Finds all documents with Cloudinary image URLs
 * 3. Downloads images to local uploads/ directory
 * 4. Updates database records to use local URLs (/uploads/filename)
 */

const mongoose = require('mongoose')
const fs = require('fs/promises')
const path = require('path')
const https = require('https')
const { URL } = require('url')

// Environment variables
const ATLAS_URI = process.env.ATLAS_URI
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads'

if (!ATLAS_URI) {
  console.error('❌ ATLAS_URI environment variable is required')
  console.error('Usage: ATLAS_URI="your-atlas-connection-string" npm run migrate:images')
  process.exit(1)
}

// Cloudinary URL pattern
const CLOUDINARY_PATTERN = /https?:\/\/res\.cloudinary\.com\//

// Collections and fields to check for Cloudinary URLs
const COLLECTIONS_TO_CHECK = [
  {
    name: 'blogs',
    fields: ['coverImage', 'en.blocks.imageUrl', 'ar.blocks.imageUrl', 'en.blocks.videoUrl', 'ar.blocks.videoUrl']
  },
  {
    name: 'pages',
    fields: ['en.seo.ogImage', 'ar.seo.ogImage']
  },
  {
    name: 'products',
    fields: ['coverImage', 'gallery']
  },
  {
    name: 'settings',
    fields: ['globalAssets.logoLightId', 'globalAssets.logoDarkId', 'globalAssets.faviconId']
  }
]

/**
 * Download a file from URL to local path
 */
async function downloadFile(url, localPath) {
  return new Promise((resolve, reject) => {
    const fileStream = require('fs').createWriteStream(localPath)

    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`))
        return
      }

      response.pipe(fileStream)

      fileStream.on('finish', () => {
        fileStream.close()
        resolve(localPath)
      })

      fileStream.on('error', (err) => {
        fs.unlink(localPath).catch(() => {}) // Clean up partial file
        reject(err)
      })
    }).on('error', (err) => {
      fs.unlink(localPath).catch(() => {}) // Clean up partial file
      reject(err)
    })
  })
}

/**
 * Extract filename from Cloudinary URL
 */
function getFilenameFromCloudinaryUrl(url) {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    // Extract the public_id part (everything after /upload/ and before any transformations)
    const uploadIndex = pathname.indexOf('/upload/')
    if (uploadIndex === -1) return null

    const afterUpload = pathname.substring(uploadIndex + 8) // +8 for '/upload/'
    // Remove version and transformations, keep only the public_id and extension
    const parts = afterUpload.split('/')
    const filename = parts[parts.length - 1]

    // If filename doesn't have extension, add .jpg as fallback
    if (!filename.includes('.')) {
      return `${filename}.jpg`
    }

    return filename
  } catch (e) {
    return null
  }
}

/**
 * Process a single URL field
 */
async function processUrlField(document, fieldPath, collectionName) {
  const url = getNestedValue(document, fieldPath)
  if (!url || typeof url !== 'string' || !CLOUDINARY_PATTERN.test(url)) {
    return false // No change needed
  }

  try {
    // Generate local filename
    const cloudinaryFilename = getFilenameFromCloudinaryUrl(url)
    if (!cloudinaryFilename) {
      console.warn(`⚠️  Could not extract filename from: ${url}`)
      return false
    }

    // Create unique local filename to avoid conflicts
    const timestamp = Date.now()
    const ext = path.extname(cloudinaryFilename)
    const basename = path.basename(cloudinaryFilename, ext)
    const localFilename = `${basename}-${timestamp}${ext}`
    const localPath = path.join(UPLOAD_DIR, localFilename)

    // Download the file
    console.log(`📥 Downloading: ${url} → ${localFilename}`)
    await downloadFile(url, localPath)

    // Verify file was created
    await fs.access(localPath)

    // Update the document field
    setNestedValue(document, fieldPath, `/uploads/${localFilename}`)

    console.log(`✅ Migrated: ${fieldPath} in ${collectionName}/${document._id}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to migrate ${url}:`, error.message)
    return false
  }
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

/**
 * Set nested value in object using dot notation
 */
function setNestedValue(obj, path, value) {
  const keys = path.split('.')
  const lastKey = keys.pop()
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {}
    return current[key]
  }, obj)
  target[lastKey] = value
}

/**
 * Process all documents in a collection
 */
async function processCollection(collectionName, fields) {
  const Model = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName)
  const documents = await Model.find({})

  console.log(`\n🔍 Processing ${documents.length} documents in ${collectionName}...`)

  let processedCount = 0
  let migratedCount = 0

  for (const doc of documents) {
    let docChanged = false

    for (const field of fields) {
      // Handle array fields (like blocks, gallery)
      if (field.includes('.blocks.') || field === 'gallery') {
        const container = getNestedValue(doc, field.split('.')[0])
        if (Array.isArray(container)) {
          for (let i = 0; i < container.length; i++) {
            const item = container[i]
            const subField = field.split('.').slice(1).join('.')

            if (subField && item && typeof item === 'object') {
              const urlField = subField.split('.').pop()
              if (urlField && item[urlField]) {
                const changed = await processUrlField(item, urlField, collectionName)
                if (changed) docChanged = true
              }
            } else if (field === 'gallery' && typeof item === 'string') {
              // Handle gallery array of strings
              if (CLOUDINARY_PATTERN.test(item)) {
                const changed = await processUrlField({ url: item }, 'url', collectionName)
                if (changed) {
                  container[i] = `/uploads/${getFilenameFromCloudinaryUrl(item).split('-').slice(0, -1).join('-')}-${Date.now()}${path.extname(getFilenameFromCloudinaryUrl(item))}`
                  docChanged = true
                }
              }
            }
          }
        }
      } else {
        // Handle simple fields
        const changed = await processUrlField(doc, field, collectionName)
        if (changed) docChanged = true
      }
    }

    if (docChanged) {
      await doc.save()
      migratedCount++
    }

    processedCount++
    if (processedCount % 10 === 0) {
      console.log(`   Processed ${processedCount}/${documents.length} documents...`)
    }
  }

  console.log(`✅ ${collectionName}: ${migratedCount} documents updated`)
  return { processed: processedCount, migrated: migratedCount }
}

/**
 * Main migration function
 */
async function main() {
  try {
    console.log('🚀 Starting Cloudinary to Local Migration')
    console.log('=' .repeat(50))

    // Ensure upload directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true })

    // Connect to Atlas
    console.log('🔌 Connecting to MongoDB Atlas...')
    await mongoose.connect(ATLAS_URI)
    console.log('✅ Connected to Atlas')

    let totalProcessed = 0
    let totalMigrated = 0

    // Process each collection
    for (const { name, fields } of COLLECTIONS_TO_CHECK) {
      const result = await processCollection(name, fields)
      totalProcessed += result.processed
      totalMigrated += result.migrated
    }

    console.log('\n' + '=' .repeat(50))
    console.log('🎉 Migration completed!')
    console.log(`📊 Total documents processed: ${totalProcessed}`)
    console.log(`📊 Total documents migrated: ${totalMigrated}`)
    console.log(`📁 Images saved to: ${UPLOAD_DIR}`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from Atlas')
  }
}

// Run the migration
if (require.main === module) {
  main().catch(console.error)
}

module.exports = { main }
