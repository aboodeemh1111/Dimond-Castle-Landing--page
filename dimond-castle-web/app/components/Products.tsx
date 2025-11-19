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
                    width: 700,
                    height: 550,
                    crop: "fill",
                  })
                : "/images/basmatiBag.png";

              return (
                <article
                  key={product._id}
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[var(--dc-gray)]/80"
                >
                  {/* Product Image */}
                  <div className="relative bg-accent/30 aspect-[4/5] overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={product[locale].name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3
                      className="text-xl font-semibold text-text mb-2"
                      style={{ fontFamily: "Georgia, serif" }}
                    >
                      {product[locale].name}
                    </h3>
                    <p className="text-text/80 text-sm mb-4 leading-relaxed">
                      {product[locale].description}
                    </p>

                    {/* Origin */}
                    {product[locale].origin && (
                      <div
                        className={`flex items-center gap-2 mb-3 ${
                          dir === "rtl" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4 text-text/70"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm text-text/70">
                          {t("products.origin")} {" "}
                          <span className="font-medium text-text">
                            {product[locale].origin}
                          </span>
                        </span>
                      </div>
                    )}

                    {/* Packaging Sizes */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-text/60 mb-2">
                          {t("products.availableSizes")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-accent/40 text-text text-xs font-medium rounded-full"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Learn More Button */}
                    <a
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-2 text-[var(--green-500)] font-medium text-sm hover:gap-3 hover:underline underline-offset-4 transition-all duration-300 group/btn focus:outline-offset-2 focus:ring-2 focus:ring-[var(--gold-500)]"
                    >
                      {t("products.learnMore")}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
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
