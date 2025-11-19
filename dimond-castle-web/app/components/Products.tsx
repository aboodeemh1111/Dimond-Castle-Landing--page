"use client";

import { useI18n } from "./I18nProvider";
import { useEffect, useState } from "react";
import { getPublicProducts, type Product } from "../lib/products-api";
import { getCloudinaryUrl } from "../lib/cloudinary";

export default function Products() {
  const { t, dir } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getPublicProducts({ limit: 6, sort: "order" });
        setProducts(data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section
      id="products"
      className="relative py-20 px-6 md:px-12 bg-linear-to-b from-bg via-accent/20 to-bg"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 -z-10 opacity-5" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div
        className={`max-w-7xl mx-auto ${
          dir === "rtl" ? "text-right" : "text-left"
        }`}
      >
        {/* Section Header */}
        <header className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-text mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {t("products.heading")}
          </h2>
          <p className="text-lg md:text-xl text-text/80 max-w-3xl mx-auto">
            {t("products.subtitle")}
          </p>
        </header>

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--green-500)]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-text/60">{t("products.noProducts") || "No products available"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
            {products.map((product) => {
              const locale = dir === "rtl" ? "ar" : "en";
              const imageUrl = product.coverPublicId
                ? getCloudinaryUrl(product.coverPublicId, {
                    width: 800,
                    height: 800,
                    crop: "pad",
                  })
                : "/images/basmatiBag.png";

              return (
                <article
                  key={product._id}
                  className="group relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[var(--dc-gray)]/80"
                >
                  {/* Product Image */}
                  <div className="absolute inset-0 flex items-center justify-center bg-white p-6">
                    <img
                      src={imageUrl}
                      alt={product[locale].name}
                      className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Overlay + Info */}
                  <div className="absolute inset-0 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div
                      className={`relative z-10 p-6 text-white ${
                        dir === "rtl" ? "text-right" : "text-left"
                      }`}
                    >
                      <h3
                        className="text-2xl font-semibold mb-2"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {product[locale].name}
                      </h3>
                      <p className="text-sm text-white/90 mb-3">
                        {product[locale].description}
                      </p>

                      {product[locale].origin && (
                        <p className="text-xs text-white/80 mb-3">
                          {t("products.origin")}{" "}
                          <span className="font-semibold text-white">
                            {product[locale].origin}
                          </span>
                        </p>
                      )}

                      {product.sizes && product.sizes.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {product.sizes.map((size, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded-full bg-white/20 text-white text-xs"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      )}

                      <a
                        href={`/products/${product.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white px-4 py-2 rounded-full bg-[var(--green-500)]/90 hover:bg-[var(--green-500)] transition pointer-events-auto"
                      >
                        {t("products.learnMore")}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* View All Products Button */}
        <div className="text-center">
          <a
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-offset-2 focus:ring-2 focus:ring-[var(--gold-500)] btn-glass"
          >
            {t("products.viewAll")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
