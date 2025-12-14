import type { NextConfig } from "next";

// Get API URL from environment to allow images from API server
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Parse API URL to extract hostname and port
let apiHostname = "localhost";
let apiPort = "4000";
let apiProtocol: "http" | "https" = "http";

try {
  const apiUrlObj = new URL(API_URL);
  apiHostname = apiUrlObj.hostname;
  apiProtocol = apiUrlObj.protocol === "https:" ? "https" : "http";
  if (apiUrlObj.port) {
    apiPort = apiUrlObj.port;
  } else if (apiProtocol === "https") {
    apiPort = "443";
  } else {
    apiPort = "80";
  }
} catch (e) {
  // If URL parsing fails, use defaults
  console.warn("Failed to parse NEXT_PUBLIC_API_URL, using defaults");
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "placehold.co" },
      // Allow images from API server (VPS)
      {
        protocol: apiProtocol,
        hostname: apiHostname,
        ...(apiPort &&
          apiPort !== "80" &&
          apiPort !== "443" && { port: apiPort }),
      },
    ],
  },
  async rewrites() {
    // In development, proxy API requests to the local API to avoid CORS
    if (process.env.NODE_ENV !== "production") {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:4000/api/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
