"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";

interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (publicId: string, secureUrl: string) => void;
  type?: "image" | "video";
}

export default function MediaUploadModal({
  isOpen,
  onClose,
  onUploadComplete,
  type = "image",
}: MediaUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setUploadProgress(20);

      // Step 1: Get signature from backend (mocked)
      await api.getMediaSignature();
      setUploadProgress(40);

      // Step 2: Upload to API
      const media = await api.uploadMedia(selectedFile);
      setUploadProgress(100);

      // Step 3: Return URL to parent
      // API returns { url, _id, ... }
      onUploadComplete(media.url || "", media.url || "");

      // Reset and close
      setTimeout(() => {
        resetState();
        onClose();
      }, 500);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      resetState();
      onClose();
    }
  };

  const acceptedTypes =
    type === "image"
      ? "image/jpeg,image/png,image/gif,image/webp"
      : "video/mp4,video/webm";

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Upload ${type === "image" ? "Image" : "Video"}`}
      footer={
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            isLoading={isUploading}
          >
            Upload
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* File Input */}
        <div
          className="border-2 border-dashed border-admin-border rounded-lg p-8 text-center hover:border-admin-primary transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="hidden"
          />

          {previewUrl ? (
            <div className="space-y-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg"
              />
              <p className="text-sm text-admin-textLight">
                {selectedFile?.name}
              </p>
            </div>
          ) : (
            <div>
              <Upload className="w-12 h-12 mx-auto text-admin-textLight mb-4" />
              <p className="text-admin-text font-medium mb-2">
                Click to select {type}
              </p>
              <p className="text-sm text-admin-textLight">
                {type === "image" ? "JPEG, PNG, GIF, or WebP" : "MP4 or WebM"}
              </p>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-admin-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-center text-admin-textLight">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
