// Core types for Diamond Castle Admin Panel

export type Locale = "en" | "ar";

export type SEO = {
  title?: string;
  description?: string;
  ogImage?: string;
};

export type BlogStatus = "draft" | "published";
export type PageStatus = "draft" | "published";

export type CloudPublicId = string;

// Block types for blog content
export type Block =
  | { type: "heading"; level: 1 | 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; publicId: string; alt?: string; caption?: string }
  | { type: "video"; publicId: string; caption?: string; posterId?: string }
  | { type: "link"; href: string; label: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "quote"; text: string; cite?: string };

// Blog document
export type BlogDoc = {
  _id: string;
  slug: string;
  status: BlogStatus;
  coverImage?: string; // cloudinary publicId
  tags?: string[];
  author?: string;
  publishedAt?: string;
  ar: {
    title: string;
    excerpt?: string;
    blocks: Block[];
    seo?: SEO;
  };
  en: {
    title: string;
    excerpt?: string;
    blocks: Block[];
    seo?: SEO;
  };
  createdAt: string;
  updatedAt: string;
};

// Media document
export type MediaDoc = {
  _id: string;
  publicId: string;
  resourceType: "image" | "video";
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  url?: string;
  secureUrl?: string;
  folder?: string;
  createdAt: string;
  uploadedBy?: string;
};

// Page builder types (for future phases)
export type SectionInstance = {
  key: string;
  ar?: Record<string, any>;
  en?: Record<string, any>;
  props?: Record<string, any>;
};

export type PageDoc = {
  _id: string;
  slug: string;
  status: PageStatus;
  template?: "blank" | "default";
  ar: {
    title: string;
    seo?: SEO;
    sections: SectionInstance[];
  };
  en: {
    title: string;
    seo?: SEO;
    sections: SectionInstance[];
  };
  createdAt: string;
  updatedAt: string;
};

// Auth types
export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};

export type User = {
  _id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
