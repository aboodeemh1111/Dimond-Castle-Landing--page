import { useAuthStore } from "./store";
import { mockAPI } from "./api-mock";
import type { LoginCredentials, BlogDoc, MediaDoc } from "@/types";

// API client that routes to mock API
export const api = {
  // Auth
  login: async (credentials: LoginCredentials) => {
    return mockAPI.auth.login(credentials);
  },

  refresh: async () => {
    return mockAPI.auth.refresh();
  },

  logout: async () => {
    return mockAPI.auth.logout();
  },

  // Blogs
  getBlogs: async (params?: {
    status?: "all" | "draft" | "published";
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    checkAuth();
    return mockAPI.blogs.list(params);
  },

  getBlog: async (id: string) => {
    checkAuth();
    return mockAPI.blogs.get(id);
  },

  createBlog: async (
    data: Omit<BlogDoc, "_id" | "createdAt" | "updatedAt">
  ) => {
    checkAuth();
    return mockAPI.blogs.create(data);
  },

  updateBlog: async (id: string, data: Partial<BlogDoc>) => {
    checkAuth();
    return mockAPI.blogs.update(id, data);
  },

  deleteBlog: async (id: string) => {
    checkAuth();
    return mockAPI.blogs.delete(id);
  },

  // Media
  getMedia: async (params?: {
    resourceType?: "image" | "video";
    search?: string;
  }) => {
    checkAuth();
    return mockAPI.media.list(params);
  },

  getMediaSignature: async () => {
    checkAuth();
    return mockAPI.media.signature();
  },

  uploadMedia: async (file: File) => {
    checkAuth();
    return mockAPI.media.upload(file);
  },

  deleteMedia: async (publicId: string) => {
    checkAuth();
    return mockAPI.media.delete(publicId);
  },
};

// Helper to check authentication
function checkAuth() {
  const token = useAuthStore.getState().accessToken;
  if (!token) {
    throw new Error("Unauthorized");
  }
}

// Helper for handling API errors with refresh token retry
export async function withAuth<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      // Try to refresh token
      try {
        const { accessToken } = await mockAPI.auth.refresh();
        useAuthStore.getState().setToken(accessToken);
        // Retry the original request
        return await fn();
      } catch (refreshError) {
        // Refresh failed, clear token and redirect to login
        useAuthStore.getState().clearToken();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw refreshError;
      }
    }
    throw error;
  }
}
