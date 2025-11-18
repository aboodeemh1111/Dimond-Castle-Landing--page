const API_BASE = process.env.NEXT_PUBLIC_API_URL;

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
  status?: "draft" | "published" | "all";
  category?: string;
  featured?: boolean;
  inStock?: boolean;
  search?: string;
  limit?: number;
  skip?: number;
  sort?: "newest" | "oldest" | "name" | "order" | "popular";
};

// Get all products (admin)
export async function getProducts(
  params?: ProductQueryParams
): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.set("status", params.status);
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
    `${API_BASE}/api/products?${queryParams.toString()}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

// Get single product by ID (admin)
export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}

// Create new product
export async function createProduct(data: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create product");
  }

  return res.json();
}

// Update product
export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update product");
  }

  return res.json();
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to delete product");
  }
}

// Bulk reorder products
export async function reorderProducts(
  products: { id: string }[]
): Promise<void> {
  const res = await fetch(`${API_BASE}/api/products/bulk/reorder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ products }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to reorder products");
  }
}

// Get product categories
export async function getProductCategories(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/api/products/meta/categories`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

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
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

// Get single published product by slug (public)
export async function getPublicProductBySlug(slug: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/public/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}

