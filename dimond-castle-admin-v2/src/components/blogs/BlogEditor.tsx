"use client";

import { useEffect, useMemo, useState } from "react";
import type { BlogPost, Block, LocaleContent } from "@/lib/blog-store";
import { createPost, updatePost, deletePost, isSlugUnique } from "@/lib/blog-store";
import { slugify, cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { BlockEditor } from "./BlockEditor";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

type EditorProps = {
  initial?: BlogPost
}

export function BlogEditor({ initial }: EditorProps) {
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(initial ?? null)
  const [dirty, setDirty] = useState(false)
  const [slugInUse, setSlugInUse] = useState(false)

  useEffect(() => {
    if (!initial) {
      ;(async () => {
        const created = await createPost({
          slug: `post-${Math.random().toString(36).slice(2,10)}`,
          status: 'draft',
          tags: [],
          en: { title: "Untitled", excerpt: "", blocks: [] },
          ar: { title: "بدون عنوان", excerpt: "", blocks: [] },
        })
        setPost(created)
        router.replace(`/admin/blogs/${(created as any)._id || (created as any).id}`)
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!post) return
    if (dirty) {
      const t = setTimeout(async () => {
        const updated = await updatePost((post as any)._id || (post as any).id, post)
        setPost(updated)
        toast.success("Saved")
        setDirty(false)
      }, 800)
      return () => clearTimeout(t)
    }
  }, [dirty, post])

  useEffect(() => {
    let active = true
    if (!post) return
    ;(async () => {
      const unique = await isSlugUnique(post.slug, (post as any)._id || (post as any).id)
      if (active) setSlugInUse(!unique)
    })()
    return () => { active = false }
  }, [post?.slug])

  // Hooks must come before early returns
  const lastSaved = useMemo(() => post ? new Date(post.updatedAt).toLocaleString() : '', [post?.updatedAt])

  function setLocaleContent(locale: "en" | "ar", data: Partial<LocaleContent>) {
    setPost((p) => ({ ...p, [locale]: { ...p[locale], ...data } as LocaleContent }))
    setDirty(true)
  }

  function setBlocks(locale: "en" | "ar", blocks: Block[]) {
    setLocaleContent(locale, { blocks })
  }

  function updateField<K extends keyof BlogPost>(key: K, value: BlogPost[K]) {
    setPost((p) => ({ ...p, [key]: value, updatedAt: new Date().toISOString() }))
    setDirty(true)
  }

  function validateCanPublish(p: BlogPost) {
    const errors: string[] = []
    if (!p.en.title.trim()) errors.push("English title required")
    if (!p.ar.title.trim()) errors.push("Arabic title required")
    if (!(p.en.blocks && p.en.blocks.length)) errors.push("At least one English block required")
    if (!(p.ar.blocks && p.ar.blocks.length)) errors.push("At least one Arabic block required")
    return errors
  }

  function onPublishToggle() {
    if (!post) return
    if (post.status === "draft") {
      const errs = validateCanPublish(post)
      if (errs.length) {
        toast.error("Cannot publish", { description: errs.join(" · ") })
        return
      }
      updateField("status", "published")
      toast.success("Published")
    } else {
      updateField("status", "draft")
      toast("Unpublished")
    }
  }

  async function onSave() {
    if (!post) return
    await updatePost((post as any)._id || (post as any).id, post)
    toast.success("Saved")
  }

  async function onDelete() {
    if (!post) return
    await deletePost((post as any)._id || (post as any).id)
    toast.success("Deleted")
    router.push("/admin/blogs")
  }

  function onSlugSuggest() {
    if (!post) return
    const s = slugify(post.en.title || "")
    if (!s) return
    // uniqueness check handled asynchronously below
    updateField("slug", s)
  }

  if (!post) return null

  const statusBadge = (
    <Badge variant={post.status === "published" ? "default" : "secondary"}>
      {post.status === "published" ? "Published" : "Draft"}
    </Badge>
  )

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b bg-background/80 px-2 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Dashboard / Blogs /</div>
          <div className="font-medium">{post.en.title || "New Post"}</div>
          {statusBadge}
          <div className="hidden text-xs text-muted-foreground sm:block">Last saved {lastSaved}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onSave}>Save</Button>
          <Button variant={post.status === 'published' ? 'secondary' : 'default'} onClick={onPublishToggle}>
            {post.status === 'published' ? 'Unpublish' : 'Publish'}
          </Button>
          <Button variant="destructive" onClick={onDelete}>Delete</Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Main */}
        <div className="flex-1 space-y-4">
          <Tabs defaultValue="en">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>
            <TabsContent value="en" className="space-y-4">
              <Card>
                <CardHeader><CardTitle>Content</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="en-title">Title</Label>
                    <Input id="en-title" value={post.en.title} onChange={(e) => setLocaleContent('en', { title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="en-excerpt">Excerpt</Label>
                    <Textarea id="en-excerpt" rows={3} value={post.en.excerpt || ''} onChange={(e) => setLocaleContent('en', { excerpt: e.target.value })} />
                  </div>
                  <BlockEditor value={post.en.blocks} onChange={(blocks) => setBlocks('en', blocks)} dir="ltr" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <Label>Meta title</Label>
                  <Input value={post.en.seo?.title || ''} onChange={(e) => setLocaleContent('en', { seo: { ...(post.en.seo || {}), title: e.target.value } })} />
                  <Label>Meta description</Label>
                  <Textarea rows={3} value={post.en.seo?.description || ''} onChange={(e) => setLocaleContent('en', { seo: { ...(post.en.seo || {}), description: e.target.value } })} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ar" className="space-y-4" dir="rtl">
              <Card>
                <CardHeader><CardTitle>المحتوى</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="ar-title">العنوان</Label>
                    <Input id="ar-title" value={post.ar.title} onChange={(e) => setLocaleContent('ar', { title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ar-excerpt">الملخص</Label>
                    <Textarea id="ar-excerpt" rows={3} value={post.ar.excerpt || ''} onChange={(e) => setLocaleContent('ar', { excerpt: e.target.value })} />
                  </div>
                  <BlockEditor value={post.ar.blocks} onChange={(blocks) => setBlocks('ar', blocks)} dir="rtl" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>السيو</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <Label>عنوان الميتا</Label>
                  <Input value={post.ar.seo?.title || ''} onChange={(e) => setLocaleContent('ar', { seo: { ...(post.ar.seo || {}), title: e.target.value } })} />
                  <Label>وصف الميتا</Label>
                  <Textarea rows={3} value={post.ar.seo?.description || ''} onChange={(e) => setLocaleContent('ar', { seo: { ...(post.ar.seo || {}), description: e.target.value } })} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-80 space-y-4">
          <Card>
            <CardHeader><CardTitle>Meta</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Slug</Label>
                <div className="flex gap-2">
                  <Input value={post.slug} onChange={(e) => updateField('slug', e.target.value)} />
                  <Button variant="outline" onClick={onSlugSuggest}>Suggest</Button>
                </div>
                {slugInUse && (
                  <div className="flex items-center gap-2 text-xs text-red-500"><AlertTriangle className="h-3 w-3" /> Slug already in use</div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="text-sm text-muted-foreground">{post.status}</div>
              </div>
              <div className="space-y-2">
                <Label>Cover image public_id</Label>
                <Input value={post.coverPublicId || ''} onChange={(e) => updateField('coverPublicId', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input value={post.tags.join(', ')} onChange={(e) => updateField('tags', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input value={post.author || ''} onChange={(e) => updateField('author', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Publish date</Label>
                <Input type="datetime-local" value={post.publishAt ? new Date(post.publishAt).toISOString().slice(0,16) : ''} onChange={(e) => updateField('publishAt', e.target.value ? new Date(e.target.value).toISOString() : undefined)} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


