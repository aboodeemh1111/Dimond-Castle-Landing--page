'use client'

import { type Page } from '@/lib/pages-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Trash2 } from 'lucide-react'

type Props = {
  page: Page
  onChange: (updates: Partial<Page>) => void
  onDelete: () => void
}

export function PageSettings({ page, onChange, onDelete }: Props) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Page Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={page.slug}
              onChange={(e) => onChange({ slug: e.target.value })}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Template</Label>
            <Select
              value={page.template}
              onValueChange={(v) => onChange({ template: v as any })}
            >
              <SelectTrigger id="template">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="landing">Landing</SelectItem>
                <SelectItem value="blank">Blank</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={page.status}
              onValueChange={(v) => onChange({ status: v as any })}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Titles</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="en">EN</TabsTrigger>
              <TabsTrigger value="ar">AR</TabsTrigger>
            </TabsList>
            <TabsContent value="en" className="space-y-2 mt-4">
              <Label htmlFor="title-en">Title (English)</Label>
              <Input
                id="title-en"
                value={page.en.title}
                onChange={(e) =>
                  onChange({ en: { ...page.en, title: e.target.value } })
                }
              />
            </TabsContent>
            <TabsContent value="ar" className="space-y-2 mt-4">
              <Label htmlFor="title-ar">Title (Arabic)</Label>
              <Input
                id="title-ar"
                value={page.ar.title}
                onChange={(e) =>
                  onChange({ ar: { ...page.ar, title: e.target.value } })
                }
                dir="rtl"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="en">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="en">EN</TabsTrigger>
              <TabsTrigger value="ar">AR</TabsTrigger>
            </TabsList>
            <TabsContent value="en" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="seo-title-en">SEO Title</Label>
                <Input
                  id="seo-title-en"
                  maxLength={60}
                  value={page.en.seo?.title || ''}
                  onChange={(e) =>
                    onChange({
                      en: {
                        ...page.en,
                        seo: { ...page.en.seo, title: e.target.value },
                      },
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {(page.en.seo?.title || '').length}/60
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-desc-en">SEO Description</Label>
                <Textarea
                  id="seo-desc-en"
                  maxLength={160}
                  rows={3}
                  value={page.en.seo?.description || ''}
                  onChange={(e) =>
                    onChange({
                      en: {
                        ...page.en,
                        seo: { ...page.en.seo, description: e.target.value },
                      },
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {(page.en.seo?.description || '').length}/160
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-og-en">OG Image (Cloudinary ID)</Label>
                <Input
                  id="seo-og-en"
                  value={page.en.seo?.ogImage || ''}
                  onChange={(e) =>
                    onChange({
                      en: {
                        ...page.en,
                        seo: { ...page.en.seo, ogImage: e.target.value },
                      },
                    })
                  }
                />
              </div>
            </TabsContent>
            <TabsContent value="ar" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="seo-title-ar">SEO Title</Label>
                <Input
                  id="seo-title-ar"
                  maxLength={60}
                  value={page.ar.seo?.title || ''}
                  onChange={(e) =>
                    onChange({
                      ar: {
                        ...page.ar,
                        seo: { ...page.ar.seo, title: e.target.value },
                      },
                    })
                  }
                  dir="rtl"
                />
                <p className="text-xs text-muted-foreground">
                  {(page.ar.seo?.title || '').length}/60
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-desc-ar">SEO Description</Label>
                <Textarea
                  id="seo-desc-ar"
                  maxLength={160}
                  rows={3}
                  value={page.ar.seo?.description || ''}
                  onChange={(e) =>
                    onChange({
                      ar: {
                        ...page.ar,
                        seo: { ...page.ar.seo, description: e.target.value },
                      },
                    })
                  }
                  dir="rtl"
                />
                <p className="text-xs text-muted-foreground">
                  {(page.ar.seo?.description || '').length}/160
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seo-og-ar">OG Image (Cloudinary ID)</Label>
                <Input
                  id="seo-og-ar"
                  value={page.ar.seo?.ogImage || ''}
                  onChange={(e) =>
                    onChange({
                      ar: {
                        ...page.ar,
                        seo: { ...page.ar.seo, ogImage: e.target.value },
                      },
                    })
                  }
                  dir="rtl"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={onDelete} className="w-full">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Page
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

