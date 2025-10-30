"use client";

import { useEffect, useState } from "react";
import { Upload, Copy, Trash2, Image as ImageIcon, Video } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import MediaUploadModal from "@/components/media/MediaUploadModal";
import { api } from "@/lib/api";
import type { MediaDoc } from "@/types";

export default function MediaPage() {
  const [media, setMedia] = useState<MediaDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "image" | "video">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    media: MediaDoc | null;
  }>({
    isOpen: false,
    media: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const fetchedMedia = await api.getMedia({
        resourceType: filterType === "all" ? undefined : filterType,
        search: searchQuery || undefined,
      });
      setMedia(fetchedMedia);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [filterType, searchQuery]);

  const handleUploadComplete = () => {
    fetchMedia();
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };

  const handleDelete = async () => {
    if (!deleteModal.media) return;

    try {
      setIsDeleting(true);
      await api.deleteMedia(deleteModal.media._id);
      setDeleteModal({ isOpen: false, media: null });
      fetchMedia();
    } catch (error) {
      console.error("Failed to delete media:", error);
      alert("Failed to delete media");
    } finally {
      setIsDeleting(false);
    }
  };

  const getMediaUrl = (media: MediaDoc) => {
    if (media.url) return media.url;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    if (media.publicId?.startsWith("/")) return `${base}${media.publicId}`;
    return media.publicId;
  };

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 flex gap-4">
            <Input
              placeholder="Search by public ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "primary" : "secondary"}
              onClick={() => setFilterType("all")}
              size="md"
            >
              All
            </Button>
            <Button
              variant={filterType === "image" ? "primary" : "secondary"}
              onClick={() => setFilterType("image")}
              size="md"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Images
            </Button>
            <Button
              variant={filterType === "video" ? "primary" : "secondary"}
              onClick={() => setFilterType("video")}
              size="md"
            >
              <Video className="w-4 h-4 mr-2" />
              Videos
            </Button>
          </div>

          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </Card>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-admin-textLight">Loading media...</p>
          </div>
        ) : media.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-admin-textLight mb-4">No media found</p>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Media
            </Button>
          </div>
        ) : (
          media.map((item) => (
            <Card key={item._id} padding="none" className="overflow-hidden">
              {/* Media Preview */}
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {item.resourceType === "image" ? (
                  <img
                    src={getMediaUrl(item)}
                    alt={item.publicId}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={getMediaUrl(item)}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
              </div>

              {/* Media Info */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium text-admin-text truncate">
                    {(item.publicId || item._id).toString().split("/").pop()}
                  </p>
                  <p className="text-xs text-admin-textLight">
                    {item.width} × {item.height} •{" "}
                    {Math.round((item.bytes || 0) / 1024)} KB
                  </p>
                  <p className="text-xs text-admin-textLight break-all mt-1">
                    {getMediaUrl(item)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleCopyUrl(getMediaUrl(item))}
                    className="flex-1"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy URL
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      setDeleteModal({ isOpen: true, media: item })
                    }
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Upload Modal */}
      <MediaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, media: null })}
        title="Delete Media"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteModal({ isOpen: false, media: null })}
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
          Are you sure you want to delete "{deleteModal.media?.publicId}"? This
          action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
