// Cloudinary helper functions
// Replace 'demo' with your actual cloud name from the backend response
// or set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in your .env.local

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dsojmqc3o';

type TransformOptions = {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad';
  quality?: number | 'auto';
  format?: 'auto' | 'jpg' | 'png' | 'webp';
  gravity?: 'auto' | 'face' | 'center';
};

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

// Overloaded function signatures
export function getCloudinaryUrl(publicId: string, options?: TransformOptions): string;
export function getCloudinaryUrl(publicId: string, resourceType?: 'image' | 'video', transformations?: string): string;
export function getCloudinaryUrl(
  publicId: string, 
  optionsOrResourceType?: TransformOptions | 'image' | 'video',
  transformations?: string
): string {
  if (!publicId) return '';
  
  // Handle object-based options (new signature)
  if (typeof optionsOrResourceType === 'object') {
    const options = optionsOrResourceType;
    const transforms: string[] = [];
    
    if (options.width) transforms.push(`w_${options.width}`);
    if (options.height) transforms.push(`h_${options.height}`);
    if (options.crop) transforms.push(`c_${options.crop}`);
    if (options.quality) transforms.push(`q_${options.quality}`);
    if (options.format) transforms.push(`f_${options.format}`);
    if (options.gravity) transforms.push(`g_${options.gravity}`);
    
    // Add defaults if not specified
    if (!options.format) transforms.push('f_auto');
    if (!options.quality) transforms.push('q_auto');
    
    const transformString = transforms.join(',');
    return getCloudinaryImageUrl(publicId, transformString);
  }
  
  // Handle old signature (resourceType, transformations)
  const resourceType = optionsOrResourceType as 'image' | 'video' | undefined;
  return resourceType === 'video' 
    ? getCloudinaryVideoUrl(publicId, transformations)
    : getCloudinaryImageUrl(publicId, transformations);
}

