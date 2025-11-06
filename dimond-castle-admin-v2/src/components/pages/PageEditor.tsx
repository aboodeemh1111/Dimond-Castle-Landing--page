'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePage, type Page, type Section, type Status } from '@/lib/pages-api'
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
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { Save, Eye, Trash2 } from 'lucide-react'
import { SectionsList } from './SectionsList'
import { PageSettings } from './PageSettings'

type Props = {
  page: Page
  onDelete: () => void
}

export function PageEditor({ page, onDelete }: Props) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [localPage, setLocalPage] = useState<Page>(page)
  const [hasChanges, setHasChanges] = useState(false)
  const [locale, setLocale] = useState<'en' | 'ar'>('en')

  useEffect(() => {
    setLocalPage(page)
    setHasChanges(false)
  }, [page])

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Page>) => updatePage(page._id, data),
    onSuccess: (updated) => {
      queryClient.setQueryData(['page', page._id], updated)
      setLocalPage(updated)
      setHasChanges(false)
      toast({ title: 'Page saved successfully' })
    },
    onError: (error: Error) => {
      toast({ title: 'Failed to save page', description: error.message, variant: 'destructive' })
    },
  })

  const handleSave = () => {
    updateMutation.mutate({
      slug: localPage.slug,
      status: localPage.status,
      template: localPage.template,
      en: localPage.en,
      ar: localPage.ar,
    })
  }

  const handlePublish = () => {
    const newStatus: Status = localPage.status === 'published' ? 'draft' : 'published'
    updateMutation.mutate({ status: newStatus })
  }

  const updateLocalPage = (updates: Partial<Page>) => {
    setLocalPage((prev) => ({ ...prev, ...updates }))
    setHasChanges(true)
  }

  const updateSections = (sections: Section[]) => {
    setLocalPage((prev) => ({
      ...prev,
      [locale]: { ...prev[locale], sections },
    }))
    setHasChanges(true)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-6">
      {/* Left: Builder */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold truncate">{localPage[locale].title}</h1>
            {localPage.status === 'published' ? (
              <Badge className="bg-green-500">Published</Badge>
            ) : (
              <Badge variant="secondary">Draft</Badge>
            )}
            {hasChanges && <Badge variant="outline">Unsaved</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open(localPage.slug, '_blank')}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePublish}
              disabled={updateMutation.isPending}
            >
              {localPage.status === 'published' ? 'Unpublish' : 'Publish'}
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!hasChanges || updateMutation.isPending}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        <Tabs value={locale} onValueChange={(v) => setLocale(v as 'en' | 'ar')} className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-fit">
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="ar">العربية</TabsTrigger>
          </TabsList>

          <TabsContent value={locale} className="flex-1 mt-4 min-h-0">
            <ScrollArea className="h-full">
              <div className="pr-4">
                <SectionsList
                  sections={localPage[locale].sections}
                  onChange={updateSections}
                  locale={locale}
                />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right: Settings Sidebar */}
      <div className="w-80 flex-shrink-0">
        <ScrollArea className="h-full">
          <PageSettings page={localPage} onChange={updateLocalPage} onDelete={onDelete} />
        </ScrollArea>
      </div>
    </div>
  )
}
