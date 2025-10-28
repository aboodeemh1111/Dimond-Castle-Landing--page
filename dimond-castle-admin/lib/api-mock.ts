import type {
  BlogDoc,
  MediaDoc,
  AuthResponse,
  LoginCredentials,
} from "@/types";

// In-memory storage for mock data
const mockBlogs = new Map<string, BlogDoc>();
const mockMedia = new Map<string, MediaDoc>();

// Mock access token
let mockAccessToken = "mock-jwt-token-12345";
let mockRefreshToken = "mock-refresh-token-67890";

// Initialize with some sample data
const initializeMockData = () => {
  // Sample blog 1
  const blog1: BlogDoc = {
    _id: "blog-1",
    slug: "welcome-to-dimond-castle",
    status: "published",
    coverImage: "sample/dimond-castle-hero",
    tags: ["welcome", "company"],
    author: "Admin",
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    ar: {
      title: "مرحبا بكم في قلعة الماس",
      excerpt: "نحن شركة رائدة في مجال الأرز الباسماتي عالي الجودة",
      blocks: [
        { type: "heading", level: 1, text: "مرحبا بكم في قلعة الماس" },
        {
          type: "paragraph",
          text: "نحن فخورون بتقديم أجود أنواع الأرز الباسماتي من الهند وباكستان.",
        },
      ],
      seo: {
        title: "مرحبا بكم في قلعة الماس",
        description: "شركة رائدة في مجال الأرز الباسماتي",
      },
    },
    en: {
      title: "Welcome to Diamond Castle",
      excerpt: "We are a leading company in high-quality Basmati rice",
      blocks: [
        { type: "heading", level: 1, text: "Welcome to Diamond Castle" },
        {
          type: "paragraph",
          text: "We are proud to offer the finest Basmati rice from India and Pakistan.",
        },
      ],
      seo: {
        title: "Welcome to Diamond Castle",
        description: "Leading company in Basmati rice",
      },
    },
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  // Sample blog 2
  const blog2: BlogDoc = {
    _id: "blog-2",
    slug: "quality-standards",
    status: "draft",
    tags: ["quality", "standards"],
    author: "Admin",
    ar: {
      title: "معايير الجودة لدينا",
      excerpt: "نلتزم بأعلى معايير الجودة في جميع منتجاتنا",
      blocks: [
        { type: "heading", level: 1, text: "معايير الجودة" },
        { type: "paragraph", text: "نحن نلتزم بأعلى معايير الجودة العالمية." },
      ],
    },
    en: {
      title: "Our Quality Standards",
      excerpt: "We maintain the highest quality standards in all our products",
      blocks: [
        { type: "heading", level: 1, text: "Quality Standards" },
        {
          type: "paragraph",
          text: "We adhere to the highest international quality standards.",
        },
      ],
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  };

  mockBlogs.set(blog1._id, blog1);
  mockBlogs.set(blog2._id, blog2);

  // Sample media
  const media1: MediaDoc = {
    _id: "media-1",
    publicId: "sample/basmati-rice-bag",
    resourceType: "image",
    format: "jpg",
    width: 1200,
    height: 800,
    bytes: 245678,
    url: "https://res.cloudinary.com/demo/image/upload/sample/basmati-rice-bag",
    secureUrl:
      "https://res.cloudinary.com/demo/image/upload/sample/basmati-rice-bag",
    folder: "sample",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    uploadedBy: "admin",
  };

  mockMedia.set(media1._id, media1);
};

// Initialize on load
if (mockBlogs.size === 0) {
  initializeMockData();
}

// Helper to simulate network delay
const delay = (ms: number = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const mockAPI = {
  // Auth endpoints
  auth: {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      await delay(400);

      // Mock auth - accept any email/password
      if (credentials.email && credentials.password) {
        return {
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken,
        };
      }

      throw new Error("Invalid credentials");
    },

    refresh: async (): Promise<{ accessToken: string }> => {
      await delay(200);
      // Generate new mock token
      mockAccessToken = `mock-jwt-token-${Date.now()}`;
      return { accessToken: mockAccessToken };
    },

    logout: async (): Promise<void> => {
      await delay(100);
      // Clear tokens (in real app, would clear httpOnly cookie)
      return;
    },
  },

  // Blog endpoints
  blogs: {
    list: async (params?: {
      status?: "all" | "draft" | "published";
      page?: number;
      limit?: number;
      search?: string;
    }): Promise<{
      blogs: BlogDoc[];
      total: number;
      page: number;
      limit: number;
    }> => {
      await delay(300);

      let blogs = Array.from(mockBlogs.values());

      // Filter by status
      if (params?.status && params.status !== "all") {
        blogs = blogs.filter((b) => b.status === params.status);
      }

      // Filter by search
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        blogs = blogs.filter(
          (b) =>
            b.en.title.toLowerCase().includes(searchLower) ||
            b.ar.title.toLowerCase().includes(searchLower) ||
            b.slug.toLowerCase().includes(searchLower)
        );
      }

      // Sort by updatedAt desc
      blogs.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      const page = params?.page || 1;
      const limit = params?.limit || 20;
      const start = (page - 1) * limit;
      const paginatedBlogs = blogs.slice(start, start + limit);

      return {
        blogs: paginatedBlogs,
        total: blogs.length,
        page,
        limit,
      };
    },

    get: async (id: string): Promise<BlogDoc> => {
      await delay(200);

      const blog = mockBlogs.get(id);
      if (!blog) {
        throw new Error("Blog not found");
      }

      return blog;
    },

    create: async (
      data: Omit<BlogDoc, "_id" | "createdAt" | "updatedAt">
    ): Promise<BlogDoc> => {
      await delay(500);

      const id = `blog-${Date.now()}`;
      const now = new Date().toISOString();

      const newBlog: BlogDoc = {
        ...data,
        _id: id,
        createdAt: now,
        updatedAt: now,
      };

      mockBlogs.set(id, newBlog);
      return newBlog;
    },

    update: async (id: string, data: Partial<BlogDoc>): Promise<BlogDoc> => {
      await delay(400);

      const blog = mockBlogs.get(id);
      if (!blog) {
        throw new Error("Blog not found");
      }

      const updatedBlog: BlogDoc = {
        ...blog,
        ...data,
        _id: id,
        updatedAt: new Date().toISOString(),
      };

      mockBlogs.set(id, updatedBlog);
      return updatedBlog;
    },

    delete: async (id: string): Promise<void> => {
      await delay(300);

      if (!mockBlogs.has(id)) {
        throw new Error("Blog not found");
      }

      mockBlogs.delete(id);
    },
  },

  // Media endpoints
  media: {
    list: async (params?: {
      resourceType?: "image" | "video";
      search?: string;
    }): Promise<MediaDoc[]> => {
      await delay(300);

      let media = Array.from(mockMedia.values());

      // Filter by type
      if (params?.resourceType) {
        media = media.filter((m) => m.resourceType === params.resourceType);
      }

      // Filter by search
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        media = media.filter((m) =>
          m.publicId.toLowerCase().includes(searchLower)
        );
      }

      // Sort by createdAt desc
      media.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return media;
    },

    signature: async (): Promise<{
      timestamp: number;
      signature: string;
      apiKey: string;
      cloudName: string;
      folder: string;
    }> => {
      await delay(100);

      return {
        timestamp: Date.now(),
        signature: "mock-signature-" + Math.random().toString(36).substring(7),
        apiKey: "mock-api-key",
        cloudName: "demo",
        folder: "dimond-castle",
      };
    },

    upload: async (file: File): Promise<MediaDoc> => {
      await delay(1500); // Simulate longer upload time

      const id = `media-${Date.now()}`;
      const publicId = `dimond-castle/${file.name.replace(
        /\.[^/.]+$/,
        ""
      )}-${Date.now()}`;

      const media: MediaDoc = {
        _id: id,
        publicId,
        resourceType: file.type.startsWith("video") ? "video" : "image",
        format: file.type.split("/")[1],
        width: 1200,
        height: 800,
        bytes: file.size,
        url: `https://res.cloudinary.com/demo/${
          file.type.startsWith("video") ? "video" : "image"
        }/upload/${publicId}`,
        secureUrl: `https://res.cloudinary.com/demo/${
          file.type.startsWith("video") ? "video" : "image"
        }/upload/${publicId}`,
        folder: "dimond-castle",
        createdAt: new Date().toISOString(),
        uploadedBy: "admin",
      };

      mockMedia.set(id, media);
      return media;
    },

    delete: async (publicId: string): Promise<void> => {
      await delay(300);

      // Find and delete by publicId
      for (const [id, media] of mockMedia.entries()) {
        if (media.publicId === publicId) {
          mockMedia.delete(id);
          return;
        }
      }

      throw new Error("Media not found");
    },
  },
};
