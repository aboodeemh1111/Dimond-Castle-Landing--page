"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/lib/products-api";
import { getCloudinaryUrl } from "@/lib/cloudinary";
import { Loader2 } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default function ProductPreviewPage({ params }: Props) {
  const { id } = use(params);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
      </div>
    );
  }

  // Simple preview - in production, this would render the actual product page
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.en.name}</h1>
                <p className="text-green-100">{product.en.description}</p>
              </div>
              {product.price?.amount && (
                <div className="text-right">
                  <div className="text-sm text-green-100">Price</div>
                  <div className="text-3xl font-bold">
                    {product.price.currency} {product.price.amount}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image */}
              <div>
                {product.coverPublicId ? (
                  <img
                    src={getCloudinaryUrl(product.coverPublicId, {
                      width: 800,
                      height: 600,
                      crop: 'fill',
                    })}
                    alt={product.en.name}
                    className="w-full rounded-lg shadow-md object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-6">
                {product.en.origin && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                      Origin
                    </h3>
                    <p className="text-lg">{product.en.origin}</p>
                  </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
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

                {product.category && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                      Category
                    </h3>
                    <p className="text-lg">{product.category}</p>
                  </div>
                )}

                {product.tags && product.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
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

                <div className="flex items-center gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        product.inStock ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  {product.featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            {product.galleryPublicIds && product.galleryPublicIds.length > 0 && (
              <div className="mt-12 pt-12 border-t">
                <h2 className="text-2xl font-bold mb-6">Product Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {product.galleryPublicIds.map((publicId, index) => (
                    <img
                      key={index}
                      src={getCloudinaryUrl(publicId, {
                        width: 400,
                        height: 400,
                        crop: 'fill',
                      })}
                      alt={`${product.en.name} - Gallery ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Page Builder Sections Preview */}
            {product.en.sections && product.en.sections.length > 0 && (
              <div className="mt-12 pt-12 border-t">
                <h2 className="text-2xl font-bold mb-6">Product Details</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600">
                    Custom page builder sections would render here...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

