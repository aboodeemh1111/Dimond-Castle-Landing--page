"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createProduct } from "@/lib/products-api";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    slug: "",
    enName: "",
    enDescription: "",
    enOrigin: "",
    arName: "",
    arDescription: "",
    arOrigin: "",
  });

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (product) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
      router.push(`/admin/products/${product._id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create product");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.slug || !formData.enName || !formData.arName) {
      toast.error("Please fill in all required fields");
      return;
    }

    createMutation.mutate({
      slug: formData.slug,
      status: "draft",
      featured: false,
      inStock: true,
      en: {
        name: formData.enName,
        description: formData.enDescription,
        origin: formData.enOrigin,
      },
      ar: {
        name: formData.arName,
        description: formData.arDescription,
        origin: formData.arOrigin,
      },
      sizes: [],
      tags: [],
      order: 0,
      viewCount: 0,
    } as any);
  };

  const generateSlug = () => {
    const slug = formData.enName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    setFormData({ ...formData, slug });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
          <p className="text-gray-600 mt-1">
            Add a new product to your catalog
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* English Content */}
        <Card>
          <CardHeader>
            <CardTitle>English Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.enName}
                onChange={(e) =>
                  setFormData({ ...formData, enName: e.target.value })
                }
                placeholder="Enter product name in English"
                required
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.enDescription}
                onChange={(e) =>
                  setFormData({ ...formData, enDescription: e.target.value })
                }
                placeholder="Enter product description in English"
                rows={3}
              />
            </div>
            <div>
              <Label>Origin</Label>
              <Input
                value={formData.enOrigin}
                onChange={(e) =>
                  setFormData({ ...formData, enOrigin: e.target.value })
                }
                placeholder="e.g., India, Pakistan, Thailand"
              />
            </div>
          </CardContent>
        </Card>

        {/* Arabic Content */}
        <Card>
          <CardHeader>
            <CardTitle>Arabic Content (المحتوى العربي)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>
                Product Name (اسم المنتج) <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.arName}
                onChange={(e) =>
                  setFormData({ ...formData, arName: e.target.value })
                }
                placeholder="أدخل اسم المنتج بالعربية"
                required
                dir="rtl"
              />
            </div>
            <div>
              <Label>Description (الوصف)</Label>
              <Textarea
                value={formData.arDescription}
                onChange={(e) =>
                  setFormData({ ...formData, arDescription: e.target.value })
                }
                placeholder="أدخل وصف المنتج بالعربية"
                rows={3}
                dir="rtl"
              />
            </div>
            <div>
              <Label>Origin (المنشأ)</Label>
              <Input
                value={formData.arOrigin}
                onChange={(e) =>
                  setFormData({ ...formData, arOrigin: e.target.value })
                }
                placeholder="مثال: الهند، باكستان، تايلاند"
                dir="rtl"
              />
            </div>
          </CardContent>
        </Card>

        {/* URL Slug */}
        <Card>
          <CardHeader>
            <CardTitle>URL Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>
                Slug <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="product-slug"
                  required
                />
                <Button type="button" variant="outline" onClick={generateSlug}>
                  Generate
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                URL: /products/{formData.slug || "product-slug"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}

