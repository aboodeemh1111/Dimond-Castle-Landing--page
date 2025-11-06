"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function MediaPickerDialog({
  children,
  onSelect,
  title = "Select media",
}: {
  children: React.ReactNode
  onSelect: (publicId: string) => void
  title?: string
}) {
  const [open, setOpen] = useState(false)
  const [publicId, setPublicId] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="Cloudinary public_id (e.g. dimond-castle/blog/hero1)"
            value={publicId}
            onChange={(e) => setPublicId(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                if (!publicId.trim()) return
                onSelect(publicId.trim())
                setOpen(false)
                setPublicId("")
              }}
            >
              Select
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


