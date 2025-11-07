const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export type Product = {
  _id: string;
  slug: string;
  status: "draft" | "published";
  sku?: string;
  price?: {
    amount: number;
    currency: string;
  };
  sizes?: string[];
  category?: string;
  tags?: string[];
  featured: boolean;
  coverPublicId?: string;
  galleryPublicIds?: string[];
  inStock: boolean;
  stockQuantity?: number;
  en: {
    name: string;
    description?: string;
    origin?: string;
    seo?: {
      title?: string;
      description?: string;
      ogImage?: string;
    };
    sections?: any[];
  };
  ar: {
    name: string;
    description?: string;
    origin?: string;
    seo?: {
      title?: string;
      description?: string;
      ogImage?: string;
    };
    sections?: any[];
  };
  viewCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductsResponse = {
  products: Product[];
  pagination: {
    total: number;
    limit: number;
    skip: number;
    hasMore: boolean;
  };
};

export type ProductQueryParams = {
  category?: string;
  featured?: boolean;
  inStock?: boolean;
  search?: string;
  limit?: number;
  skip?: number;
  sort?: "newest" | "oldest" | "name" | "order" | "popular";
};

// Get published products (public)
export async function getPublicProducts(
  params?: ProductQueryParams
): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.set("category", params.category);
  if (params?.featured !== undefined)
    queryParams.set("featured", String(params.featured));
  if (params?.inStock !== undefined)
    queryParams.set("inStock", String(params.inStock));
  if (params?.search) queryParams.set("search", params.search);
  if (params?.limit) queryParams.set("limit", String(params.limit));
  if (params?.skip) queryParams.set("skip", String(params.skip));
  if (params?.sort) queryParams.set("sort", params.sort);

  const res = await fetch(
    `${API_BASE}/api/products/public?${queryParams.toString()}`,
    {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch products:", await res.text());
    return { products: [], pagination: { total: 0, limit: 0, skip: 0, hasMore: false } };
  }

  return res.json();
}

// Get single published product by slug (public)
export async function getPublicProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/api/products/public/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

