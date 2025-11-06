// Cloudinary helper functions
// Replace 'demo' with your actual cloud name from the backend response
// or set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your .env.local

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dsojmqc3o';

export function getCloudinaryImageUrl(publicId: string, transformations?: string): string {
  if (!publicId) return '';
  
  // Remove any file extension from publicId if present
  const cleanPublicId = publicId.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');
  
  // Default transformations for images
  const defaultTransforms = transformations || 'f_auto,q_auto';
  
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${defaultTransforms}/${cleanPublicId}`;
}

export function getCloudinaryVideoUrl(publicId: string, transformations?: string): string {
  if (!publicId) return '';
  
  // Remove any file extension from publicId if present
  const cleanPublicId = publicId.replace(/\.(mp4|webm|mov)$/i, '');
  
  // Default transformations for videos
  const defaultTransforms = transformations || 'f_auto,q_auto';
  
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${defaultTransforms}/${cleanPublicId}`;
}

export function getCloudinaryUrl(publicId: string, resourceType: 'image' | 'video' = 'image', transformations?: string): string {
  return resourceType === 'video' 
    ? getCloudinaryVideoUrl(publicId, transformations)
    : getCloudinaryImageUrl(publicId, transformations);
}

