"use client";

import { useI18n } from "./I18nProvider";

export default function Products() {
  const { t, dir } = useI18n();
  const products = [
    {
      id: 1,
      nameEn: "White Diamond Basmati",
      nameAr: "الالماس الابيض بسمتي",
      descriptionEn:
        "Long-grain aromatic rice with soft texture and premium quality.",
      descriptionAr:
        "أرز طويل الحبة عطري بنعومة وجودة فائقة.",
      originEn: "India",
      originAr: "الهند",
      sizes: ["5kg", "10kg", "25kg"],
      image: "/images/basmatiBag.png",
      slug: "white-diamond-basmati",
    },
    {
      id: 2,
      nameEn: "White Diamond Sella",
      nameAr: "الالماس الابيض سيلا",
      descriptionEn: "Parboiled rice with perfect grains and rich aroma.",
      descriptionAr: "أرز مُعالج بالبخار بحبات متماسكة ورائحة مميزة.",
      originEn: "Pakistan",
      originAr: "باكستان",
      sizes: ["5kg", "10kg", "25kg", "50kg"],
      image: "/images/basmatiBag.png",
      slug: "white-diamond-sella",
    },
    {
      id: 3,
      nameEn: "White Diamond Jasmine",
      nameAr: "الالماس الابيض ياسمين",
      descriptionEn: "Soft and fragrant rice, ideal for everyday meals.",
      descriptionAr: "أرز ناعم وعطِر، مثالي للوجبات اليومية.",
      originEn: "Thailand",
      originAr: "تايلاند",
      sizes: ["5kg", "10kg", "25kg"],
      image: "/images/basmatiBag.png",
      slug: "white-diamond-jasmine",
    },
    {
      id: 4,
      nameEn: "White Diamond Premium",
      nameAr: "الالماس الابيض بريميوم",
      descriptionEn:
        "The finest selection for special occasions and gourmet cuisine.",
      descriptionAr:
        "اختيار فاخر للمناسبات الخاصة والمأكولات الراقية.",
      originEn: "India",
      originAr: "الهند",
      sizes: ["5kg", "10kg", "25kg"],
      image: "/images/basmatiBag.png",
      slug: "white-diamond-premium",
    },
    {
      id: 5,
      nameEn: "White Diamond Long Grain",
      nameAr: "الالماس الابيض طويل الحبة",
      descriptionEn: "Perfectly separated grains with excellent cooking quality.",
      descriptionAr: "حبات منفصلة تمامًا بجودة طهي ممتازة.",
      originEn: "Thailand",
      originAr: "تايلاند",
      sizes: ["5kg", "10kg", "25kg", "50kg"],
      image: "/images/basmatiBag.png",
      slug: "white-diamond-long-grain",
    },
    {
      id: 6,
      nameEn: "White Diamond Super Kernel",
      nameAr: "الالماس الابيض سوبر كرنل",
      descriptionEn: "Extra-long grains with superior taste and aroma.",
      descriptionAr: "حبات طويلة جدًا بطعم ورائحة مميزة.",
      originEn: "Pakistan",
      originAr: "باكستان",
      sizes: ["5kg", "10kg", "25kg"],
      image: "/images/basmatiBag.png",
      slug: "white-diamond-super-kernel",
    },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {products.map((product) => (
            <article
              key={product.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[var(--dc-gray)]/80"
            >
              {/* Product Image */}
              <div className="relative h-64 overflow-hidden bg-accent/30">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3
                  className="text-xl font-semibold text-text mb-2"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {dir === "rtl" ? product.nameAr : product.nameEn}
                </h3>
                <p className="text-text/80 text-sm mb-4 leading-relaxed">
                  {dir === "rtl" ? product.descriptionAr : product.descriptionEn}
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
                      {dir === "rtl" ? product.originAr : product.originEn}
                    </span>
                  </span>
                </div>

                {/* Packaging Sizes */}
                <div className="mb-4">
                  <p className="text-xs text-text/60 mb-2">
                    {t("products.availableSizes")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-3 py-1 bg-accent/40 text-text text-xs font-medium rounded-full"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

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
          ))}
        </div>

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
