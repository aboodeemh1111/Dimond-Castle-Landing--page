import { MetadataRoute } from "next";
import { getPublicProducts } from "./lib/products-api";
import { getPublishedBlogs } from "./lib/public-blogs";
import { getPublishedPages } from "./lib/public-pages";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://diamondcastle.org";
const HAS_REMOTE_API = Boolean(process.env.NEXT_PUBLIC_API_URL);
const API_TIMEOUT = Number(process.env.SITEMAP_FETCH_TIMEOUT ?? 5000);

function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`${label} request timed out`)),
      API_TIMEOUT
    );
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

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

  if (!HAS_REMOTE_API) {
    console.warn(
      "[sitemap] NEXT_PUBLIC_API_URL is not configured. Skipping dynamic product/blog/page entries."
    );
    return routes;
  }

  // Fetch products with pagination (API limit is 100)
  const productPromise = withTimeout(
    getPublicProducts({ limit: 100, skip: 0 }),
    "Products sitemap fetch"
  );
  const blogPromise = withTimeout(getPublishedBlogs(), "Blogs sitemap fetch");
  const pagePromise = withTimeout(getPublishedPages(), "Pages sitemap fetch");

  const [productsResult, blogsResult, pagesResult] = await Promise.allSettled([
    productPromise,
    blogPromise,
    pagePromise,
  ]);

  if (productsResult.status === "fulfilled") {
    const firstPage = productsResult.value;
    firstPage.products.forEach((product) => {
      routes.push({
        url: `${BASE_URL}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt || new Date()),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });

    // If there are more products, fetch additional pages sequentially
    if (firstPage.pagination?.hasMore) {
      let skip = 100;
      let hasMore = true;

      while (hasMore && skip < 500) {
        // Limit to 500 products max for sitemap
        try {
          const nextPage = await withTimeout(
            getPublicProducts({ limit: 100, skip }),
            `Products sitemap fetch page ${skip / 100 + 1}`
          );

          nextPage.products.forEach((product) => {
            routes.push({
              url: `${BASE_URL}/products/${product.slug}`,
              lastModified: new Date(product.updatedAt || new Date()),
              changeFrequency: "weekly",
              priority: 0.7,
            });
          });

          hasMore = nextPage.pagination?.hasMore || false;
          skip += 100;
        } catch (error) {
          console.error(
            `Error fetching products page ${skip / 100 + 1}:`,
            error
          );
          break;
        }
      }
    }
  } else {
    console.error(
      "Error generating sitemap for products:",
      productsResult.reason
    );
  }

  if (blogsResult.status === "fulfilled") {
    blogsResult.value.forEach((blog) => {
      routes.push({
        url: `${BASE_URL}/blog/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || new Date()),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    });
  } else {
    console.error("Error generating sitemap for blogs:", blogsResult.reason);
  }

  if (pagesResult.status === "fulfilled") {
    pagesResult.value.forEach((page) => {
      if (!staticRoutes.includes(`/${page.slug}`)) {
        routes.push({
          url: `${BASE_URL}/${page.slug}`,
          lastModified: new Date(page.updatedAt || new Date()),
          changeFrequency: "monthly",
          priority: 0.5,
        });
      }
    });
  } else {
    console.error("Error generating sitemap for pages:", pagesResult.reason);
  }

  return routes;
}
