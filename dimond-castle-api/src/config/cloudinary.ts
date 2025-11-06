import { v2 as cloudinary } from 'cloudinary'
import { env } from './env'

// Prefer explicit credentials if provided; otherwise rely on CLOUDINARY_URL
if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  })
} else if (env.CLOUDINARY_URL) {
  // Merge only secure flag; SDK will read CLOUDINARY_URL
  cloudinary.config({ secure: true })
}

export { cloudinary }


