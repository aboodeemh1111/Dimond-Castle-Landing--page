"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "../components/I18nProvider";
import {
  getPublicProducts,
  type Product,
  type ProductQueryParams,
  type ProductsResponse,
} from "../lib/products-api";
import { getCloudinaryUrl } from "../lib/cloudinary";

type ProductsArchiveProps = {
  initialData: ProductsResponse;
};

const PAGE_SIZE = 12;

export default function ProductsArchive({ initialData }: ProductsArchiveProps) {
  const { t, dir, language } = useI18n();
  const locale = language;
  const [products, setProducts] = useState<Product[]>(initialData.products);
  const [pagination, setPagination] = useState(initialData.pagination);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [availability, setAvailability] = useState<"all" | "in" | "out">("all");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [sort, setSort] = useState<ProductQueryParams["sort"]>("order");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totalProducts = pagination?.total ?? initialData.pagination.total ?? products.length;
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(language === "ar" ? "ar-SA" : "en-US"),
    [language]
  );

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(timeout);
  }, [search]);

  const queryParams = useMemo(() => {
    const params: ProductQueryParams = {
      limit: PAGE_SIZE,
      sort,
    };
    if (debouncedSearch) params.search = debouncedSearch;
    if (availability === "in") params.inStock = true;
    if (availability === "out") params.inStock = false;
    if (onlyFeatured) params.featured = true;
    return params;
  }, [availability, debouncedSearch, onlyFeatured, sort]);

  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    let cancelled = false;
    async function fetchFiltered() {
      setLoading(true);
      setError(null);
      try {
        const response = await getPublicProducts({ ...queryParams, skip: 0 });
        if (!cancelled) {
          setProducts(response.products);
          setPagination(response.pagination);
        }
      } catch (fetchError) {
        console.error(fetchError);
        if (!cancelled) setError(t("productsPage.error"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchFiltered();
    return () => {
      cancelled = true;
    };
  }, [queryParams, t]);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    setError(null);
    try {
      const response = await getPublicProducts({
        ...queryParams,
        skip: products.length,
      });
      setProducts((prev) => [...prev, ...response.products]);
      setPagination(response.pagination);
    } catch (loadMoreError) {
      console.error(loadMoreError);
      setError(t("productsPage.error"));
    } finally {
      setLoadingMore(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setAvailability("all");
    setOnlyFeatured(false);
    setSort("order");
  };

  const filtersActive =
    debouncedSearch.length > 0 || availability !== "all" || onlyFeatured || sort !== "order";

  const showEmptyState = !loading && products.length === 0;

  const heroStats = [
    {
      value: numberFormatter.format(totalProducts),
      label: t("productsPage.hero.stats.products"),
    },
    {
      value: "200+",
      label: t("productsPage.hero.stats.clients"),
    },
    {
      value: "10+",
      label: t("productsPage.hero.stats.years"),
    },
  ];

  return (
    <div className="bg-white" dir={dir}>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#051910] via-[#0a2e22] to-[#04120c] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="space-y-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-sm font-semibold uppercase tracking-widest text-white/80">
              {t("productsPage.heroBadge")}
            </span>
            <div className={dir === "rtl" ? "text-right" : "text-left"}>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                {t("productsPage.title")}
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-white/80 sm:text-xl">
                {t("productsPage.subtitle")}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                >
                  <div className="text-4xl font-semibold text-white">{stat.value}</div>
                  <p className="mt-2 text-sm uppercase tracking-wide text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-600">
                {t("productsPage.searchPlaceholder")}
              </label>
              <div className="relative mt-2">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t("productsPage.searchPlaceholder")}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/60 px-4 py-3 text-base text-gray-900 shadow-inner focus:border-[var(--green-500)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--green-200)]"
                />
                <svg
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${
                    dir === "rtl" ? "left-4" : "right-4"
                  }`}
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>

            <div
              className={`flex flex-1 flex-wrap items-end gap-3 ${
                dir === "rtl" ? "justify-end" : "justify-start"
              }`}
            >
              <button
                type="button"
                onClick={() => setOnlyFeatured((prev) => !prev)}
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition-all ${
                  onlyFeatured
                    ? "border-[var(--green-500)] bg-[var(--green-50)] text-[var(--green-700)]"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                }`}
              >
                {t("productsPage.filters.featured")}
              </button>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t("productsPage.filters.availability")}
                </label>
                <select
                  value={availability}
                  onChange={(event) => setAvailability(event.target.value as "all" | "in" | "out")}
                  className="mt-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 focus:border-[var(--green-500)] focus:bg-white focus:outline-none"
                >
                  <option value="all">{t("productsPage.filters.availability.all")}</option>
                  <option value="in">{t("productsPage.filters.availability.inStock")}</option>
                  <option value="out">{t("productsPage.filters.availability.outOfStock")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t("productsPage.filters.sort")}
                </label>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as ProductQueryParams["sort"])}
                  className="mt-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700 focus:border-[var(--green-500)] focus:bg-white focus:outline-none"
                >
                  <option value="order">{t("productsPage.filters.sort.popular")}</option>
                  <option value="newest">{t("productsPage.filters.sort.newest")}</option>
                  <option value="name">{t("productsPage.filters.sort.name")}</option>
                </select>
              </div>

              {filtersActive && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:border-gray-300"
                >
                  {t("productsPage.filters.reset")}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="bg-[#f6f5f1] py-16">
        <div className="mx-auto max-w-6xl px-4">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 h-48 rounded-2xl bg-gray-200" />
                  <div className="mb-2 h-6 w-2/3 rounded bg-gray-200" />
                  <div className="mb-4 h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-10 w-1/3 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : showEmptyState ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
                🍚
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">
                {t("productsPage.empty.title")}
              </h3>
              <p className="mt-2 text-gray-600">{t("productsPage.empty.body")}</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {products.map((product) => {
                const localized = product[locale as "en" | "ar"];
                const imageUrl = product.coverPublicId
                  ? getCloudinaryUrl(product.coverPublicId, {
                      width: 640,
                      height: 640,
                      crop: "fill",
                    })
                  : "/images/basmatiBag.png";

                return (
                  <article
                    key={product._id}
                    className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <Image
                        src={imageUrl}
                        alt={localized.name}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
                      />
                      {product.featured && (
                        <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--green-700)] shadow">
                          {t("productsPage.card.featured")}
                        </span>
                      )}
                    </div>

                    <div className="space-y-4 p-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-2xl font-semibold text-gray-900">
                            {localized.name}
                          </h3>
                          {product.price?.amount && (
                            <div className="text-right text-[var(--green-700)]">
                              <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                                {product.price.currency}
                              </div>
                              <div className="text-3xl font-bold">
                                {numberFormatter.format(product.price.amount)}
                              </div>
                            </div>
                          )}
                        </div>
                        {localized.description && (
                          <p className="text-gray-600 line-clamp-3">{localized.description}</p>
                        )}
                      </div>

                      <div className="grid gap-4 rounded-2xl bg-gray-50 p-4 text-sm font-semibold text-gray-600 sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            {t("productsPage.card.origin")}
                          </p>
                          <p className="text-gray-900">
                            {localized.origin || t("productsPage.card.origin")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            {t("productsPage.card.category")}
                          </p>
                          <p className="text-gray-900">{product.category || "—"}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            {t("productsPage.card.stock")}
                          </p>
                          <p
                            className={`flex items-center gap-2 font-semibold ${
                              product.inStock ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                product.inStock ? "bg-green-500" : "bg-red-500"
                              }`}
                            />
                            {product.inStock
                              ? t("productsPage.card.stock.in")
                              : t("productsPage.card.stock.out")}
                          </p>
                        </div>
                        {product.sizes && product.sizes.length > 0 && (
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">
                              {t("products.availableSizes")}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {product.sizes.map((size) => (
                                <span
                                  key={size}
                                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm"
                                >
                                  {size}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={`/products/${product.slug}`}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--green-600)] px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[var(--green-700)]"
                        >
                          {t("productsPage.card.viewDetails")}
                          <svg
                            className={`h-4 w-4 ${locale === "ar" ? "rotate-180" : ""}`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Link>

                        {!product.inStock && (
                          <span className="rounded-2xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600">
                            {t("productsPage.card.stock.out")}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {pagination?.hasMore && !showEmptyState && (
            <div className="mt-10 text-center">
              <button
                type="button"
                disabled={loadingMore}
                onClick={handleLoadMore}
                className="inline-flex items-center gap-2 rounded-full bg-black px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingMore ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-transparent" />
                    {t("productsPage.loadMore")}
                  </>
                ) : (
                  t("productsPage.loadMore")
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


