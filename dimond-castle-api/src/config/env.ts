import dotenv from 'dotenv'

dotenv.config()

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 4000),
  MONGODB_URI: process.env.MONGODB_URI || '',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || '*',
  MEDIA_BASE_URL: process.env.MEDIA_BASE_URL || '',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  CLOUDINARY_URL: process.env.CLOUDINARY_URL || '',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
}

if (!env.MONGODB_URI) {
  // eslint-disable-next-line no-console
  console.warn('[env] MONGODB_URI is not set. API will fail to connect to DB.')
}

if (!env.CLOUDINARY_URL && (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET)) {
  // eslint-disable-next-line no-console
  console.warn('[env] Cloudinary credentials are not set. Media endpoints will not work.')
}


