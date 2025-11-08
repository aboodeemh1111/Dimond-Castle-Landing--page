import NavbarServer from "../../components/NavbarServer";
import Footer from "../../components/Footer";
import { getPublicProductBySlug, type Product } from "../../lib/products-api";
import { getCloudinaryUrl } from "../../lib/cloudinary";
import { PageRenderer } from "../../components/PageRenderer";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const title = product.en.seo?.title || product.en.name;
  const description = product.en.seo?.description || product.en.description;
  const ogImage = product.en.seo?.ogImage || (product.coverPublicId 
    ? getCloudinaryUrl(product.coverPublicId, { width: 1200, height: 630, crop: 'fill' })
    : undefined);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // If product has custom page sections, render with PageRenderer
  if (product.en.sections && product.en.sections.length > 0) {
    // Convert product to page format for PageRenderer
    const pageData = {
      _id: product._id,
      slug: `/products/${product.slug}`,
      status: product.status,
      template: "default" as const,
      en: {
        title: product.en.name,
        seo: product.en.seo,
        sections: product.en.sections || [],
      },
      ar: {
        title: product.ar.name,
        seo: product.ar.seo,
        sections: product.ar.sections || [],
      },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };

    return (
      <>
        <NavbarServer />
        <PageRenderer page={pageData} locale="en" />
        <Footer />
      </>
    );
  }

  // Default product page layout
  const imageUrl = product.coverPublicId
    ? getCloudinaryUrl(product.coverPublicId, { width: 1200, height: 800, crop: 'fill' })
    : "/images/basmatiBag.png";

  return (
    <>
      <NavbarServer />
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <a href="/" className="hover:text-[var(--green-600)] transition-colors">Home</a>
              <span>/</span>
              <a href="/#products" className="hover:text-[var(--green-600)] transition-colors">Products</a>
              <span>/</span>
              <span className="text-gray-900 font-medium">{product.en.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section - Product Showcase */}
        <section className="py-8 sm:py-12 lg:py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Product Image */}
              <div className="sticky top-24">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl">
                  {product.featured && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 rounded-full text-xs font-semibold shadow-lg">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Featured
                      </span>
                    </div>
                  )}
                  <img
                    src={imageUrl}
                    alt={product.en.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Gallery Thumbnails */}
                {product.galleryPublicIds && product.galleryPublicIds.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {product.galleryPublicIds.slice(0, 4).map((publicId, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 hover:ring-[var(--green-600)] transition-all"
                      >
                        <img
                          src={getCloudinaryUrl(publicId, { 
                            width: 300, 
                            height: 300, 
                            crop: 'fill' 
                          })}
                          alt={`${product.en.name} - Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Title & Description */}
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                    {product.en.name}
                  </h1>
                  {product.en.description && (
                    <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                      {product.en.description}
                    </p>
                  )}
                </div>

                {/* Price & Stock Status */}
                <div className="flex flex-wrap items-center gap-4 py-6 border-y border-gray-200">
                  {product.price?.amount && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-bold text-[var(--green-600)]">
                        {product.price.amount}
                      </span>
                      <span className="text-xl text-gray-600 font-medium">
                        {product.price.currency}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    <div className={`w-2.5 h-2.5 rounded-full ${product.inStock ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                    <span className={`text-sm font-semibold ${product.inStock ? "text-green-700" : "text-red-700"}`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                    {product.stockQuantity !== undefined && product.inStock && (
                      <span className="text-sm text-gray-500">
                        ({product.stockQuantity} available)
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Origin */}
                  {product.en.origin && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-[var(--green-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Origin
                        </h3>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {product.en.origin}
                      </p>
                    </div>
                  )}

                  {/* Category */}
                  {product.category && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Category
                        </h3>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {product.category}
                      </p>
                    </div>
                  )}
                </div>

                {/* Available Sizes */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                      Available Sizes
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {product.sizes.map((size, index) => (
                        <button
                          key={index}
                          className="px-5 py-2.5 bg-white border-2 border-[var(--green-600)] text-[var(--green-600)] rounded-lg text-sm font-semibold hover:bg-[var(--green-600)] hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <a
                    href="/#contact-us"
                    className="flex-1 bg-[var(--green-600)] hover:bg-[var(--green-700)] text-white px-8 py-4 rounded-xl font-semibold text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Contact Us to Order
                  </a>
                  <a
                    href="/#products"
                    className="flex-1 bg-white border-2 border-gray-300 hover:border-[var(--green-600)] text-gray-900 px-8 py-4 rounded-xl font-semibold text-center transition-all duration-200 hover:shadow-md"
                  >
                    View All Products
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full Gallery Section */}
        {product.galleryPublicIds && product.galleryPublicIds.length > 0 && (
          <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Product Gallery
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Explore detailed images of {product.en.name}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {product.galleryPublicIds.map((publicId, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
                  >
                    <img
                      src={getCloudinaryUrl(publicId, { 
                        width: 500, 
                        height: 500, 
                        crop: 'fill' 
                      })}
                      alt={`${product.en.name} - Gallery ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

