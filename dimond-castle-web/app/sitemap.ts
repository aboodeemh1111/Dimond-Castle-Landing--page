import { MetadataRoute } from "next";
import { getPublicProducts } from "./lib/products-api";
import { getPublishedBlogs } from "./lib/public-blogs";
import { getPublishedPages } from "./lib/public-pages";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://diamondcastle.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  // 1. Static Routes
  const staticRoutes = ["", "/blog", "/products", "/contacts"];
  staticRoutes.forEach((route) => {
    routes.push({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: route === "" ? 1.0 : 0.8,
    });
  });

  // 2. Products
  try {
    const { products } = await getPublicProducts({ limit: 1000 });
    products.forEach((product) => {
      routes.push({
        url: `${BASE_URL}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt || new Date()),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error("Error generating sitemap for products:", error);
  }

  // 3. Blogs
  try {
    const blogs = await getPublishedBlogs();
    blogs.forEach((blog) => {
      routes.push({
        url: `${BASE_URL}/blog/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || new Date()),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    });
  } catch (error) {
    console.error("Error generating sitemap for blogs:", error);
  }

  // 4. Pages (CMS)
  try {
    const pages = await getPublishedPages();
    pages.forEach((page) => {
      // Avoid duplicating static routes if they exist in CMS with same slug
      if (!staticRoutes.includes(`/${page.slug}`)) {
        routes.push({
          url: `${BASE_URL}/${page.slug}`,
          lastModified: new Date(page.updatedAt || new Date()),
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    });
  } catch (error) {
    console.error("Error generating sitemap for pages:", error);
  }

  return routes;
}

