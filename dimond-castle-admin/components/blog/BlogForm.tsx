"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2 } from "lucide-react";
import Tabs from "@/components/ui/Tabs";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import MediaPicker from "@/components/media/MediaPicker";
import BlockEditor from "./BlockEditor";
import { api } from "@/lib/api";
import type { BlogDoc, Block, Locale } from "@/types";

interface BlogFormProps {
  blog?: BlogDoc;
  isNew?: boolean;
}

export default function BlogForm({ blog, isNew = false }: BlogFormProps) {
  const router = useRouter();
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [slug, setSlug] = useState(blog?.slug || "");
  const [status, setStatus] = useState<"draft" | "published">(
    blog?.status || "draft"
  );
  const [coverImage, setCoverImage] = useState(blog?.coverImage || "");
  const [tags, setTags] = useState(blog?.tags?.join(", ") || "");

  // EN fields
  const [enTitle, setEnTitle] = useState(blog?.en.title || "");
  const [enExcerpt, setEnExcerpt] = useState(blog?.en.excerpt || "");
  const [enBlocks, setEnBlocks] = useState<Block[]>(blog?.en.blocks || []);
  const [enSeoTitle, setEnSeoTitle] = useState(blog?.en.seo?.title || "");
  const [enSeoDescription, setEnSeoDescription] = useState(
    blog?.en.seo?.description || ""
  );

  // AR fields
  const [arTitle, setArTitle] = useState(blog?.ar.title || "");
  const [arExcerpt, setArExcerpt] = useState(blog?.ar.excerpt || "");
  const [arBlocks, setArBlocks] = useState<Block[]>(blog?.ar.blocks || []);
  const [arSeoTitle, setArSeoTitle] = useState(blog?.ar.seo?.title || "");
  const [arSeoDescription, setArSeoDescription] = useState(
    blog?.ar.seo?.description || ""
  );

  // Auto-generate slug from EN title
  useEffect(() => {
    if (isNew && enTitle && !slug) {
      const autoSlug = enTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setSlug(autoSlug);
    }
  }, [enTitle, isNew, slug]);

  const handleSave = async (newStatus?: "draft" | "published") => {
    // Validation
    if (!enTitle || !arTitle) {
      alert("Please provide titles in both English and Arabic");
      return;
    }

    if (!slug) {
      alert("Please provide a slug");
      return;
    }

    try {
      setIsSaving(true);

      const blogData = {
        slug,
        status: newStatus || status,
        coverImage: coverImage || undefined,
        tags: tags
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
        author: "Admin",
        publishedAt:
          newStatus === "published" || status === "published"
            ? new Date().toISOString()
            : undefined,
        en: {
          title: enTitle,
          excerpt: enExcerpt || undefined,
          blocks: enBlocks,
          seo: {
            title: enSeoTitle || undefined,
            description: enSeoDescription || undefined,
          },
        },
        ar: {
          title: arTitle,
          excerpt: arExcerpt || undefined,
          blocks: arBlocks,
          seo: {
            title: arSeoTitle || undefined,
            description: arSeoDescription || undefined,
          },
        },
      };

      if (isNew) {
        const newBlog = await api.createBlog(blogData as any);
        router.push(`/blogs/${newBlog._id}`);
      } else if (blog) {
        await api.updateBlog(blog._id, blogData as any);
        router.refresh();
      }

      alert("Blog saved successfully!");
    } catch (error) {
      console.error("Failed to save blog:", error);
      alert("Failed to save blog. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!blog) return;

    try {
      setIsDeleting(true);
      await api.deleteBlog(blog._id);
      router.push("/blogs");
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Failed to delete blog");
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePublish = () => {
    setStatus("published");
    handleSave("published");
  };

  const tabs = [
    { id: "en", label: "English" },
    { id: "ar", label: "العربية" },
  ];

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <Card>
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Button onClick={() => handleSave()} isLoading={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>

            {status === "draft" && (
              <Button
                onClick={handlePublish}
                isLoading={isSaving}
                variant="secondary"
              >
                Publish
              </Button>
            )}
          </div>

          {!isNew && (
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </Card>

      {/* Shared Fields */}
      <Card
        header={<h3 className="text-lg font-semibold">General Information</h3>}
      >
        <div className="space-y-4">
          <Input
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-blog-post"
            helperText="URL-friendly identifier (lowercase, hyphens only)"
          />

          <MediaPicker
            value={coverImage}
            onChange={setCoverImage}
            label="Cover Image"
          />

          <Input
            label="Tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
            helperText="Comma-separated tags"
          />

          <div>
            <label className="block text-sm font-medium text-admin-text mb-2">
              Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="draft"
                  checked={status === "draft"}
                  onChange={(e) => setStatus(e.target.value as "draft")}
                  className="mr-2"
                />
                Draft
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="published"
                  checked={status === "published"}
                  onChange={(e) => setStatus(e.target.value as "published")}
                  className="mr-2"
                />
                Published
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Locale Tabs */}
      <Card>
        <Tabs
          tabs={tabs}
          activeTab={activeLocale}
          onChange={(id) => setActiveLocale(id as Locale)}
        />

        <div className="mt-6 space-y-6">
          {activeLocale === "en" ? (
            <>
              <Input
                label="Title *"
                value={enTitle}
                onChange={(e) => setEnTitle(e.target.value)}
                placeholder="Blog post title"
                required
              />

              <Input
                label="Excerpt"
                as="textarea"
                value={enExcerpt}
                onChange={(e) => setEnExcerpt(e.target.value)}
                placeholder="Short description (optional)"
              />

              <div>
                <label className="block text-sm font-medium text-admin-text mb-2">
                  Content
                </label>
                <BlockEditor value={enBlocks} onChange={setEnBlocks} />
              </div>

              <div className="border-t border-admin-border pt-6">
                <h4 className="font-medium text-admin-text mb-4">
                  SEO Settings
                </h4>
                <div className="space-y-4">
                  <Input
                    label="SEO Title"
                    value={enSeoTitle}
                    onChange={(e) => setEnSeoTitle(e.target.value)}
                    placeholder="Title for search engines"
                  />
                  <Input
                    label="SEO Description"
                    as="textarea"
                    value={enSeoDescription}
                    onChange={(e) => setEnSeoDescription(e.target.value)}
                    placeholder="Meta description (max 160 chars)"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <Input
                label="العنوان *"
                value={arTitle}
                onChange={(e) => setArTitle(e.target.value)}
                placeholder="عنوان المقالة"
                required
              />

              <Input
                label="المقتطف"
                as="textarea"
                value={arExcerpt}
                onChange={(e) => setArExcerpt(e.target.value)}
                placeholder="وصف قصير (اختياري)"
              />

              <div>
                <label className="block text-sm font-medium text-admin-text mb-2">
                  المحتوى
                </label>
                <BlockEditor value={arBlocks} onChange={setArBlocks} />
              </div>

              <div className="border-t border-admin-border pt-6">
                <h4 className="font-medium text-admin-text mb-4">
                  إعدادات SEO
                </h4>
                <div className="space-y-4">
                  <Input
                    label="عنوان SEO"
                    value={arSeoTitle}
                    onChange={(e) => setArSeoTitle(e.target.value)}
                    placeholder="العنوان لمحركات البحث"
                  />
                  <Input
                    label="وصف SEO"
                    as="textarea"
                    value={arSeoDescription}
                    onChange={(e) => setArSeoDescription(e.target.value)}
                    placeholder="الوصف التعريفي (حد أقصى 160 حرف)"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Blog"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p className="text-admin-text">
          Are you sure you want to delete this blog? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}
