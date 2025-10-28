"use client";

import { useI18n } from "./I18nProvider";

export default function Products() {
  const { t, dir } = useI18n();
  const products = [
    {
      id: 1,
      name: "White Diamond Basmati",
      description:
        "Long-grain aromatic rice with soft texture and premium quality.",
      origin: "India",
      sizes: ["5kg", "10kg", "25kg"],
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
      slug: "white-diamond-basmati",
    },
    {
      id: 2,
      name: "White Diamond Sella",
      description: "Parboiled rice with perfect grains and rich aroma.",
      origin: "Pakistan",
      sizes: ["5kg", "10kg", "25kg", "50kg"],
      image:
        "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&q=80",
      slug: "white-diamond-sella",
    },
    {
      id: 3,
      name: "White Diamond Jasmine",
      description: "Soft and fragrant rice, ideal for everyday meals.",
      origin: "Thailand",
      sizes: ["5kg", "10kg", "25kg"],
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
      slug: "white-diamond-jasmine",
    },
    {
      id: 4,
      name: "White Diamond Premium",
      description:
        "The finest selection for special occasions and gourmet cuisine.",
      origin: "India",
      sizes: ["5kg", "10kg", "25kg"],
      image:
        "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&q=80",
      slug: "white-diamond-premium",
    },
    {
      id: 5,
      name: "White Diamond Long Grain",
      description: "Perfectly separated grains with excellent cooking quality.",
      origin: "Thailand",
      sizes: ["5kg", "10kg", "25kg", "50kg"],
      image:
        "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
      slug: "white-diamond-long-grain",
    },
    {
      id: 6,
      name: "White Diamond Super Kernel",
      description: "Extra-long grains with superior taste and aroma.",
      origin: "Pakistan",
      sizes: ["5kg", "10kg", "25kg"],
      image:
        "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&q=80",
      slug: "white-diamond-super-kernel",
    },
  ];

  return (
    <section
      id="products"
      className="relative py-20 px-6 md:px-12 bg-linear-to-b from-white via-gray-50/30 to-white"
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
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {t("products.heading")}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {t("products.subtitle")}
          </p>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {products.map((product) => (
            <article
              key={product.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
            >
              {/* Product Image */}
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3
                  className="text-xl font-semibold text-gray-900 mb-2"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {product.description}
                </p>

                {/* Origin */}
                <div
                  className={`flex items-center gap-2 mb-3 ${
                    dir === "rtl" ? "flex-row-reverse" : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-gray-500"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-500">
                    {t("products.origin")}{" "}
                    <span className="font-medium text-gray-700">
                      {product.origin}
                    </span>
                  </span>
                </div>

                {/* Packaging Sizes */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">
                    {t("products.availableSizes")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Learn More Button */}
                <a
                  href={`/products/${product.slug}`}
                  className="inline-flex items-center gap-2 text-gray-900 font-medium text-sm hover:gap-3 transition-all duration-300 group/btn"
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
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center">
          <a
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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
