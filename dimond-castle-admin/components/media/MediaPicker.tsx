"use client";

import { useState } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import Button from "@/components/ui/Button";
import MediaUploadModal from "./MediaUploadModal";

interface MediaPickerProps {
  value?: string; // publicId
  onChange: (publicId: string) => void;
  type?: "image" | "video";
  label?: string;
}

export default function MediaPicker({
  value,
  onChange,
  type = "image",
  label = "Cover Image",
}: MediaPickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUploadComplete = (publicId: string) => {
    onChange(publicId);
    setIsModalOpen(false);
  };

  const handleClear = () => {
    onChange("");
  };

  // Generate Cloudinary URL from publicId
  const getMediaUrl = (publicId: string) => {
    if (!publicId) return "";
    return `https://res.cloudinary.com/demo/${type}/upload/w_400/${publicId}`;
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-admin-text">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative inline-block">
          {type === "image" ? (
            <img
              src={getMediaUrl(value)}
              alt="Selected media"
              className="w-full max-w-md h-48 object-cover rounded-lg border border-admin-border"
            />
          ) : (
            <video
              src={getMediaUrl(value)}
              className="w-full max-w-md h-48 object-cover rounded-lg border border-admin-border"
              controls
            />
          )}

          <div className="absolute top-2 right-2 flex gap-2">
            <Button size="sm" variant="danger" onClick={handleClear}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-xs text-admin-textLight mt-2 break-all">{value}</p>
        </div>
      ) : (
        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
          <ImageIcon className="w-4 h-4 mr-2" />
          Upload {type === "image" ? "Image" : "Video"}
        </Button>
      )}

      {value && (
        <div className="mt-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsModalOpen(true)}
          >
            Change {type === "image" ? "Image" : "Video"}
          </Button>
        </div>
      )}

      <MediaUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadComplete={handleUploadComplete}
        type={type}
      />
    </div>
  );
}
