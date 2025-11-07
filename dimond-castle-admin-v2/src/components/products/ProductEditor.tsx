'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProduct, type Product } from '@/lib/products-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Save, Eye, Trash2, Plus, X } from 'lucide-react'
import { SectionsList } from '@/components/pages/SectionsList'
import { MediaPickerModal } from '@/components/media/MediaPickerModal'
import { getCloudinaryUrl } from '@/lib/cloudinary'

type Props = {
  product: Product
  onDelete: () => void
}

export function ProductEditor({ product, onDelete }: Props) {
  const queryClient = useQueryClient()

  const [localProduct, setLocalProduct] = useState<Product>(product)
  const [hasChanges, setHasChanges] = useState(false)
  const [locale, setLocale] = useState<'en' | 'ar'>('en')
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    setLocalProduct(product)
    setHasChanges(false)
  }, [product])

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Product>) => updateProduct(product._id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['product', product._id], updated)
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setLocalProduct(updated)
      setHasChanges(false)
      toast.success('Product saved successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save product')
    },
  })

  const handleSave = () => {
    updateMutation.mutate({
      slug: localProduct.slug,
      status: localProduct.status,
      sku: localProduct.sku,
      price: localProduct.price,
      sizes: localProduct.sizes,
      category: localProduct.category,
      tags: localProduct.tags,
      featured: localProduct.featured,
      coverPublicId: localProduct.coverPublicId,
      galleryPublicIds: localProduct.galleryPublicIds,
      inStock: localProduct.inStock,
      stockQuantity: localProduct.stockQuantity,
      en: localProduct.en,
      ar: localProduct.ar,
      order: localProduct.order,
    })
  }

  const handlePublish = () => {
    const newStatus = localProduct.status === 'published' ? 'draft' : 'published'
    updateMutation.mutate({ status: newStatus })
  }

  const updateField = (field: keyof Product, value: any) => {
    setLocalProduct((prev) => ({ ...prev, [field]: value }))
    setHasChanges(true)
  }

  const updateLocaleField = (field: keyof Product['en'], value: any) => {
    setLocalProduct((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], [field]: value },
    }))
    setHasChanges(true)
  }

  const updateSections = (sections: any[]) => {
    setLocalProduct((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], sections },
    }))
    setHasChanges(true)
  }

  const addSize = () => {
    const newSize = prompt('Enter size (e.g., 5kg, 10kg):')
    if (newSize) {
      updateField('sizes', [...(localProduct.sizes || []), newSize])
    }
  }

  const removeSize = (index: number) => {
    updateField('sizes', localProduct.sizes?.filter((_, i) => i !== index))
  }

  const addTag = () => {
    const newTag = prompt('Enter tag:')
    if (newTag) {
      updateField('tags', [...(localProduct.tags || []), newTag])
    }
  }

  const removeTag = (index: number) => {
    updateField('tags', localProduct.tags?.filter((_, i) => i !== index))
  }

  const addGalleryImage = (publicId: string) => {
    updateField('galleryPublicIds', [...(localProduct.galleryPublicIds || []), publicId])
  }

  const removeGalleryImage = (index: number) => {
    updateField('galleryPublicIds', localProduct.galleryPublicIds?.filter((_, i) => i !== index))
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6">
      {/* Left: Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold truncate">{localProduct[locale].name}</h1>
            {localProduct.status === 'published' ? (
              <Badge className="bg-green-500">Published</Badge>
            ) : (
              <Badge variant="secondary">Draft</Badge>
            )}
            {hasChanges && <Badge variant="outline">Unsaved</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open(`/products/${localProduct.slug}`, '_blank')}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm" onClick={handlePublish}>
              {localProduct.status === 'published' ? 'Unpublish' : 'Publish'}
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || updateMutation.isPending}>
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList>
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="page">Page Builder</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="details" className="space-y-6 mt-0">
              {/* Language Toggle */}
              <Card>
                <CardHeader>
                  <CardTitle>Language</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant={locale === 'en' ? 'default' : 'outline'}
                      onClick={() => setLocale('en')}
                    >
                      English
                    </Button>
                    <Button
                      variant={locale === 'ar' ? 'default' : 'outline'}
                      onClick={() => setLocale('ar')}
                    >
                      العربية
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Product Name ({locale.toUpperCase()})</Label>
                    <Input
                      value={localProduct[locale].name}
                      onChange={(e) => updateLocaleField('name', e.target.value)}
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <Label>Description ({locale.toUpperCase()})</Label>
                    <Textarea
                      value={localProduct[locale].description || ''}
                      onChange={(e) => updateLocaleField('description', e.target.value)}
                      placeholder="Enter product description"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label>Origin ({locale.toUpperCase()})</Label>
                    <Input
                      value={localProduct[locale].origin || ''}
                      onChange={(e) => updateLocaleField('origin', e.target.value)}
                      placeholder="e.g., India, Pakistan, Thailand"
                    />
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input
                      value={localProduct.slug}
                      onChange={(e) => updateField('slug', e.target.value)}
                      placeholder="product-slug"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Inventory */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Inventory</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        value={localProduct.price?.amount || ''}
                        onChange={(e) =>
                          updateField('price', {
                            ...localProduct.price,
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>Currency</Label>
                      <Input
                        value={localProduct.price?.currency || 'USD'}
                        onChange={(e) =>
                          updateField('price', {
                            ...localProduct.price,
                            currency: e.target.value,
                          })
                        }
                        placeholder="USD"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>SKU</Label>
                    <Input
                      value={localProduct.sku || ''}
                      onChange={(e) => updateField('sku', e.target.value)}
                      placeholder="Product SKU"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>In Stock</Label>
                    <Switch
                      checked={localProduct.inStock}
                      onCheckedChange={(checked) => updateField('inStock', checked)}
                    />
                  </div>
                  <div>
                    <Label>Stock Quantity</Label>
                    <Input
                      type="number"
                      value={localProduct.stockQuantity || ''}
                      onChange={(e) => updateField('stockQuantity', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Categories & Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Categories & Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={localProduct.category || ''}
                      onChange={(e) => updateField('category', e.target.value)}
                      placeholder="e.g., Basmati, Jasmine, Long Grain"
                    />
                  </div>
                  <div>
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {localProduct.tags?.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {tag}
                          <button onClick={() => removeTag(index)}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={addTag}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Tag
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Featured Product</Label>
                    <Switch
                      checked={localProduct.featured}
                      onCheckedChange={(checked) => updateField('featured', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sizes */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Sizes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {localProduct.sizes?.map((size, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {size}
                        <button onClick={() => removeSize(index)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={addSize}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Size
                  </Button>
                </CardContent>
              </Card>

              {/* Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
              <div>
                <Label>Cover Image</Label>
                {localProduct.coverPublicId ? (
                  <div className="relative mt-2">
                    <img
                      src={getCloudinaryUrl(localProduct.coverPublicId, {
                        width: 400,
                        height: 300,
                        crop: 'fill',
                      })}
                      alt="Cover"
                      className="w-full h-48 object-cover rounded"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => updateField('coverPublicId', undefined)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <MediaPickerModal
                    onSelect={(publicId) => updateField('coverPublicId', publicId)}
                    title="Select Cover Image"
                  >
                    <Button
                      variant="outline"
                      className="w-full mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Select Cover Image
                    </Button>
                  </MediaPickerModal>
                )}
                  </div>
                  <div>
                    <Label>Gallery Images</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {localProduct.galleryPublicIds?.map((publicId, index) => (
                        <div key={index} className="relative">
                          <img
                            src={getCloudinaryUrl(publicId, {
                              width: 200,
                              height: 200,
                              crop: 'fill',
                            })}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-24 object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeGalleryImage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <MediaPickerModal
                      onSelect={addGalleryImage}
                      title="Add Gallery Image"
                    >
                      <Button
                        variant="outline"
                        className="w-full mt-2"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Gallery Image
                      </Button>
                    </MediaPickerModal>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="page" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Product Page Builder ({locale.toUpperCase()})</CardTitle>
                </CardHeader>
                <CardContent>
                  <SectionsList
                    sections={localProduct[locale].sections || []}
                    onChange={updateSections}
                    locale={locale}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6 mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings ({locale.toUpperCase()})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>SEO Title</Label>
                    <Input
                      value={localProduct[locale].seo?.title || ''}
                      onChange={(e) =>
                        updateLocaleField('seo', {
                          ...localProduct[locale].seo,
                          title: e.target.value,
                        })
                      }
                      placeholder="SEO title for search engines"
                    />
                  </div>
                  <div>
                    <Label>SEO Description</Label>
                    <Textarea
                      value={localProduct[locale].seo?.description || ''}
                      onChange={(e) =>
                        updateLocaleField('seo', {
                          ...localProduct[locale].seo,
                          description: e.target.value,
                        })
                      }
                      placeholder="SEO description for search engines"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>OG Image</Label>
                    <Input
                      value={localProduct[locale].seo?.ogImage || ''}
                      onChange={(e) =>
                        updateLocaleField('seo', {
                          ...localProduct[locale].seo,
                          ogImage: e.target.value,
                        })
                      }
                      placeholder="Open Graph image URL"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>

      {/* Right: Info Panel */}
      <div className="w-80 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Product Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <Badge variant={localProduct.status === 'published' ? 'default' : 'secondary'}>
                {localProduct.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Views:</span>
              <span>{localProduct.viewCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span>{new Date(localProduct.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Updated:</span>
              <span>{new Date(localProduct.updatedAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Product
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

