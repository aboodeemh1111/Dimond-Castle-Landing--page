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
        sections: product.en.sections,
      },
      ar: {
        title: product.ar.name,
        seo: product.ar.seo,
        sections: product.ar.sections,
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
    ? getCloudinaryUrl(product.coverPublicId, { width: 800, height: 600, crop: 'fill' })
    : "/images/basmatiBag.png";

  return (
    <>
      <NavbarServer />
      <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {product.en.name}
                </h1>
                {product.en.description && (
                  <p className="text-xl text-green-100 mb-6">
                    {product.en.description}
                  </p>
                )}
                {product.price?.amount && (
                  <div className="inline-block bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
                    <div className="text-sm text-green-100 mb-1">Price</div>
                    <div className="text-3xl font-bold">
                      {product.price.currency} {product.price.amount}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={product.en.name}
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="md:col-span-2 space-y-8">
              {/* Origin */}
              {product.en.origin && (
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Origin
                  </h2>
                  <p className="text-2xl font-semibold text-gray-900">
                    {product.en.origin}
                  </p>
                </div>
              )}

              {/* Gallery */}
              {product.galleryPublicIds && product.galleryPublicIds.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Product Gallery
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {product.galleryPublicIds.map((publicId, index) => (
                      <img
                        key={index}
                        src={getCloudinaryUrl(publicId, { 
                          width: 400, 
                          height: 400, 
                          crop: 'fill' 
                        })}
                        alt={`${product.en.name} - Image ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Available Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Available Sizes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Category */}
              {product.category && (
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                    Category
                  </h3>
                  <p className="text-lg font-semibold text-gray-900">
                    {product.category}
                  </p>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm border">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      product.inStock ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-lg font-semibold text-gray-900">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                {product.stockQuantity !== undefined && (
                  <p className="text-sm text-gray-600 mt-2">
                    {product.stockQuantity} units available
                  </p>
                )}
              </div>

              {/* Featured Badge */}
              {product.featured && (
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-200">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <span className="text-lg font-semibold text-yellow-900">
                      Featured Product
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

