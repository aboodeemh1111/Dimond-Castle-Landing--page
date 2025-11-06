'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { createPage, type PageInput } from '@/lib/pages-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function NewPagePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [titleEN, setTitleEN] = useState('')
  const [titleAR, setTitleAR] = useState('')
  const [slug, setSlug] = useState('')

  const createMutation = useMutation({
    mutationFn: createPage,
    onSuccess: (page) => {
      toast({ title: 'Page created successfully' })
      router.push(`/admin/pages/${page._id}`)
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to create page', description: error.message, variant: 'destructive' })
    },
  })

  const handleCreate = () => {
    if (!titleEN || !titleAR || !slug) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' })
      return
    }

    if (!slug.startsWith('/')) {
      toast({ title: 'Slug must start with /', variant: 'destructive' })
      return
    }

    const pageData: PageInput = {
      slug,
      status: 'draft',
      template: 'default',
      en: {
        title: titleEN,
        sections: [],
      },
      ar: {
        title: titleAR,
        sections: [],
      },
    }

    createMutation.mutate(pageData)
  }

  const generateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    return '/' + slug
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Page</h1>
          <p className="text-muted-foreground">Set up basic information for your new page</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Page Information</CardTitle>
          <CardDescription>Enter the basic details to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title-en">Title (English) *</Label>
            <Input
              id="title-en"
              placeholder="e.g., About Us"
              value={titleEN}
              onChange={(e) => {
                setTitleEN(e.target.value)
                if (!slug) {
                  setSlug(generateSlug(e.target.value))
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title-ar">Title (Arabic) *</Label>
            <Input
              id="title-ar"
              placeholder="e.g., من نحن"
              value={titleAR}
              onChange={(e) => setTitleAR(e.target.value)}
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              placeholder="/about-us"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="font-mono"
            />
            <p className="text-sm text-muted-foreground">
              Must start with / and contain only lowercase letters, numbers, hyphens, and slashes
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Page'}
            </Button>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
