// Media helper functions for local VPS storage with Cloudinary fallback
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || '';

type TransformOptions = {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad';
  quality?: number | 'auto';
  format?: 'auto' | 'jpg' | 'png' | 'webp';
  gravity?: 'auto' | 'face' | 'center';
};

// Check if publicId is already a full URL (legacy Cloudinary URLs)
function isFullUrl(publicId: string): boolean {
  return publicId.startsWith('http://') || publicId.startsWith('https://');
}

export function getCloudinaryImageUrl(publicId: string, transformations?: string): string {
  if (!publicId) return '';
  if (isFullUrl(publicId)) return publicId; // Legacy Cloudinary URL
  return `${MEDIA_BASE}/${publicId}`;
}

export function getCloudinaryVideoUrl(publicId: string, transformations?: string): string {
  if (!publicId) return '';
  if (isFullUrl(publicId)) return publicId; // Legacy Cloudinary URL
  return `${MEDIA_BASE}/${publicId}`;
}

export function getCloudinaryUrl(publicId: string, options?: TransformOptions): string {
  if (!publicId) return '';
  if (isFullUrl(publicId)) return publicId; // Legacy Cloudinary URL
  return `${MEDIA_BASE}/${publicId}`;
}
