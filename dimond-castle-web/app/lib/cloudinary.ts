// Image URL helper functions for the website
// Images are stored on the VPS and served via the API
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type TransformOptions = {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "scale" | "crop" | "thumb" | "pad";
  quality?: number | "auto";
  format?: "auto" | "jpg" | "png" | "webp";
  gravity?: "auto" | "face" | "center";
};

/**
 * Get image URL from local file path
 * @param publicId - The file path (e.g., "/uploads/filename.jpg" or "uploads/filename.jpg")
 * @param transformations - Optional transformations string (kept for backward compatibility, but not used)
 * @returns Full URL to the image on the API server
 */
export function getCloudinaryImageUrl(
  publicId: string,
  transformations?: string
): string {
  if (!publicId) return "";

  // Ensure the path starts with /uploads/
  let imagePath = publicId.trim();
  if (!imagePath.startsWith("/")) {
    imagePath = "/" + imagePath;
  }
  if (!imagePath.startsWith("/uploads/")) {
    imagePath = "/uploads/" + imagePath.replace(/^\/+/, "");
  }

  // Construct full URL
  return `${API_BASE}${imagePath}`;
}

/**
 * Get video URL from local file path
 * @param publicId - The file path (e.g., "/uploads/filename.mp4" or "uploads/filename.mp4")
 * @param transformations - Optional transformations string (kept for backward compatibility, but not used)
 * @returns Full URL to the video on the API server
 */
export function getCloudinaryVideoUrl(
  publicId: string,
  transformations?: string
): string {
  if (!publicId) return "";

  // Ensure the path starts with /uploads/
  let videoPath = publicId.trim();
  if (!videoPath.startsWith("/")) {
    videoPath = "/" + videoPath;
  }
  if (!videoPath.startsWith("/uploads/")) {
    videoPath = "/uploads/" + videoPath.replace(/^\/+/, "");
  }

  // Construct full URL
  return `${API_BASE}${videoPath}`;
}

/**
 * Get image URL from local file path (main function used throughout the app)
 * @param publicId - The file path (e.g., "/uploads/filename.jpg" or "uploads/filename.jpg")
 * @param options - Optional transformation options (kept for backward compatibility, but not used for local storage)
 * @returns Full URL to the image on the API server
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: TransformOptions
): string {
  if (!publicId) return "";

  // Ensure the path starts with /uploads/
  let imagePath = publicId.trim();
  if (!imagePath.startsWith("/")) {
    imagePath = "/" + imagePath;
  }
  if (!imagePath.startsWith("/uploads/")) {
    imagePath = "/uploads/" + imagePath.replace(/^\/+/, "");
  }

  // Construct full URL
  return `${API_BASE}${imagePath}`;
}
