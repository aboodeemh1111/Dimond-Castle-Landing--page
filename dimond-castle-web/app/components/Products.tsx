"use client";

import { useI18n } from "./I18nProvider";
import { useEffect, useState, useRef, useCallback } from "react";
import { getPublicProducts, type Product } from "../lib/products-api";
import { getCloudinaryUrl } from "../lib/cloudinary";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Products() {
  const { t, dir } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // For infinite loop, we need to know the total pages
  const totalPages = Math.ceil(products.length / 1); // Moving 1 by 1 for smoother infinite feel, or per page? 
  // Let's stick to moving 1 item at a time for infinite effect, or we can duplicate list.
  // Standard infinite carousel often duplicates the first few items at the end and last few at the beginning.
  
  // We'll use a simpler "endless" approach by extending the array or using modulus math if we want to avoid complex DOM duplication,
  // but real infinite scroll usually needs duplicated items.
  // Let's create a display list that is [ ...endItems, ...products, ...startItems ]
  
  // However, a simpler robust way for React is to just wrap around index.
  // But to make it *visually* loop without rewind, we need the duplicated items approach.
  
  const extendedProducts = [
    ...products.slice(-itemsPerSlide), // Clone last few to start
    ...products,
    ...products.slice(0, itemsPerSlide) // Clone first few to end
  ];

  // currentSlide now refers to the index in extendedProducts. 
  // Initial active slide should be at index `itemsPerSlide` (which is the first real product)
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getPublicProducts({ limit: 12, sort: "order" });
        setProducts(data.products);
        // Reset slide to valid start position once loaded
        setCurrentSlide(itemsPerSlide); 
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync currentSlide when itemsPerSlide changes (responsiveness)
  useEffect(() => {
     if (products.length > 0) {
         setCurrentSlide(itemsPerSlide);
     }
  }, [itemsPerSlide, products.length]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerSlide(1);
      else if (window.innerWidth < 1024) setItemsPerSlide(2);
      else setItemsPerSlide(3);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to handle slide change with transition
  const handleSlideChange = useCallback((newSlideIndex: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(newSlideIndex);
  }, [isTransitioning]);

  // Handle transition end to snap back silently if needed
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
    
    // If we moved to the cloned start items (at the end of array)
    if (currentSlide >= products.length + itemsPerSlide) {
      // Snap back to the real first item
      setCurrentSlide(itemsPerSlide); 
    }
    // If we moved to the cloned end items (at the start of array)
    else if (currentSlide < itemsPerSlide) {
      // Snap forward to the real last item
      setCurrentSlide(products.length + itemsPerSlide - 1); // Actually, we want to align with the start of the last "page" or item?
      // If we are at index 0 (a clone of the last item), we want to go to the real last item index.
      // The real last item is at index: itemsPerSlide + products.length - 1
      
      // Let's simplify: The real items start at index `itemsPerSlide`.
      // The real items end at index `itemsPerSlide + products.length - 1`.
      
      // If we are at `itemsPerSlide - 1` (clone of last item), we jump to `itemsPerSlide + products.length - 1`
      
      // Wait, if we move 1 by 1, it's easier. 
      // Let's assume we move 1 item at a time.
      const realIndex = itemsPerSlide + products.length + (currentSlide - itemsPerSlide);
      // It's tricky to calculate exact snap without "transition: none".
      // The common pattern:
      // 1. Wait for transition to finish (this event).
      // 2. Disable transition temporarily.
      // 3. Jump to the logical equivalent spot.
      // 4. Re-enable transition.
      
      // However, we can't easily toggle CSS transition class in React state synchronously with render without a flush.
      // We'll use the `onTransitionEnd` prop on the div.
    }
  };
  
  // Improved Loop Logic:
  // When currentSlide reaches unstable zones (clones), we SNAP to stable zones instantly.
  // We need a ref to the container to directly manipulate style for the snap if we want to avoid flicker, 
  // or just use state with a "no-transition" flag.
  
  const [enableTransition, setEnableTransition] = useState(true);

  useEffect(() => {
    if (!enableTransition) {
        // Re-enable transition after a brief tick to allow the DOM to update with the snapped position
        const timer = requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setEnableTransition(true);
            });
        });
        return () => cancelAnimationFrame(timer);
    }
  }, [enableTransition]);

  const onTransitionEnd = () => {
     setIsTransitioning(false);

     // Check boundaries
     const totalReal = products.length;
     
     // Right boundary: We scrolled past the last real item into clones
     // The clones start at index `itemsPerSlide + totalReal`
     if (currentSlide >= itemsPerSlide + totalReal) {
         setEnableTransition(false);
         setCurrentSlide(itemsPerSlide + (currentSlide - (itemsPerSlide + totalReal))); 
         // e.g. if we are at (3 + 12) = 15, which is clone of index 0 (real index 3 in extended), 
         // we snap to 3.
     } 
     
     // Left boundary: We scrolled before the first real item into clones
     else if (currentSlide < itemsPerSlide) {
         setEnableTransition(false);
         // The last real item is at `itemsPerSlide + totalReal - 1`
         // If we are at `itemsPerSlide - 1` (clone of last item), we want to go to `itemsPerSlide + totalReal - 1`
         setCurrentSlide(itemsPerSlide + totalReal - (itemsPerSlide - currentSlide));
     }
  };

  // Auto-play
  useEffect(() => {
    if (products.length <= itemsPerSlide || isPaused) return;
    
    timeoutRef.current = setTimeout(() => {
       // Move one slide forward
       if (!isTransitioning) {
           setIsTransitioning(true);
           setCurrentSlide(prev => prev + 1);
       }
    }, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentSlide, products.length, itemsPerSlide, isPaused, isTransitioning]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev + 1);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev - 1);
  };

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
          <p className="text-lg md:text-xl text-text/80 max-w-3xl mx-auto leading-relaxed">
            {t("products.subtitle")}
          </p>
        </header>

        {/* Product Carousel */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--green-500)]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-text/60">{t("products.noProducts") || "No products available"}</p>
          </div>
        ) : (
          <div 
            className="relative group/carousel mb-12"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="overflow-hidden rounded-2xl -mx-4 px-4 py-8">
              <div 
                className="flex ease-out"
                style={{ 
                  transform: `translateX(${(dir === 'rtl' ? 1 : -1) * currentSlide * (100 / itemsPerSlide)}%)`,
                  direction: dir === 'rtl' ? 'rtl' : 'ltr',
                  transition: enableTransition ? 'transform 700ms ease-out' : 'none'
                }}
                onTransitionEnd={onTransitionEnd}
              >
                {extendedProducts.map((product, index) => {
                  // We need a unique key because we have duplicates. 
                  // Combination of ID and index in the extended array works.
                  const uniqueKey = `${product._id}-${index}`;
                  
                  const locale = dir === "rtl" ? "ar" : "en";
                  const imageUrl = product.coverPublicId
                    ? getCloudinaryUrl(product.coverPublicId, {
                        width: 800,
                        height: 800,
                        crop: "pad",
                      })
                    : "/images/basmatiBag.png";

                  return (
                    <div 
                      key={uniqueKey}
                      className="flex-shrink-0 px-4"
                      style={{ width: `${100 / itemsPerSlide}%`, direction: dir === 'rtl' ? 'rtl' : 'ltr' }}
                    >
                      <article
                        className="h-full group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[var(--dc-gray)]/80 flex flex-col"
                      >
                        {/* Product Image */}
                        <div className="relative aspect-square bg-white p-6">
                          <img
                            src={imageUrl}
                            alt={product[locale].name}
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Product Info */}
                        <div
                          className={`p-6 flex-1 flex flex-col ${
                            dir === "rtl" ? "text-right" : "text-left"
                          }`}
                        >
                          <h3
                            className="text-xl font-semibold text-text mb-2"
                            style={{ fontFamily: "Georgia, serif" }}
                          >
                            {product[locale].name}
                          </h3>
                          <p className="text-text/80 text-sm mb-4 leading-relaxed flex-grow">
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
                                {t("products.origin")}{" "}
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
                            className="inline-flex items-center gap-2 text-[var(--green-500)] font-medium text-sm hover:gap-3 hover:underline underline-offset-4 transition-all duration-300 group/btn focus:outline-offset-2 focus:ring-2 focus:ring-[var(--gold-500)] mt-auto"
                          >
                            {t("products.learnMore")}
                            {dir === 'rtl' ? (
                              <ChevronLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1 pointer-events-none" />
                            ) : (
                              <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 pointer-events-none" />
                            )}
                          </a>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Navigation Buttons */}
            {products.length > itemsPerSlide && (
              <>
                {/* Left Button */}
                <button 
                  onClick={dir === 'rtl' ? nextSlide : prevSlide} 
                  className="absolute top-1/2 -translate-y-1/2 z-20 left-0 -translate-x-1/2 bg-white/90 hover:bg-white text-[var(--green-500)] p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--green-500)] opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:-translate-x-4"
                  aria-label={dir === 'rtl' ? "Next slide" : "Previous slide"}
                >
                  <ChevronLeft className="w-6 h-6 pointer-events-none" />
                </button>

                {/* Right Button */}
                <button 
                  onClick={dir === 'rtl' ? prevSlide : nextSlide} 
                  className="absolute top-1/2 -translate-y-1/2 z-20 right-0 translate-x-1/2 bg-white/90 hover:bg-white text-[var(--green-500)] p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--green-500)] opacity-0 group-hover/carousel:opacity-100 group-hover/carousel:translate-x-4"
                  aria-label={dir === 'rtl' ? "Previous slide" : "Next slide"}
                >
                  <ChevronRight className="w-6 h-6 pointer-events-none" />
                </button>
              </>
            )}

            {/* Dots Indicators - simplified for infinite loop, showing relative position modulo total */}
            {products.length > itemsPerSlide && (
               <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: products.length }).map((_, idx) => {
                    // Calculate valid current slide relative to original products array
                    const relativeCurrentIndex = (currentSlide - itemsPerSlide) % products.length;
                    // Handle negative modulo
                    const normalizedCurrentIndex = relativeCurrentIndex < 0 ? relativeCurrentIndex + products.length : relativeCurrentIndex;
                    
                    // To avoid too many dots, maybe we just show a few or hide this?
                    // With 12 products it might be okay.
                    return (
                    <button 
                       key={idx}
                       onClick={() => {
                           // Jump to this slide (mapped to the middle stable set)
                           if (isTransitioning) return;
                           setIsTransitioning(true);
                           setCurrentSlide(itemsPerSlide + idx);
                       }}
                       className={`h-1.5 rounded-full transition-all duration-300 ${
                         normalizedCurrentIndex === idx 
                           ? 'w-6 bg-[var(--green-500)]' 
                           : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                       }`}
                       aria-label={`Go to product ${idx + 1}`}
                    />
                  )})}
               </div>
            )}
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
