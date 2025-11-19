"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
          <DialogDescription className="sr-only">
            Paste an existing media path (e.g. /uploads/hero.png) to link it manually.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            placeholder="/uploads/hero-image.png"
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

