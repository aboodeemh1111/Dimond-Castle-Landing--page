"use client";

import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Copy, Trash2, ImageIcon, VideoIcon, Link2, Quote, List, Minus } from "lucide-react";
import { useMemo } from "react";
import type { Block, Locale } from "../../lib/blogs";

type BlockEditorProps = {
  locale: Locale;
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  onRequestMedia?: (
    type: "image" | "video",
    onSelect: (publicId: string) => void
  ) => void;
};

const blockOptions: Array<{ type: Block["type"]; label: string; icon: React.ReactNode }> = [
  { type: "heading", label: "Heading", icon: <GripVertical className="h-4 w-4" /> },
  { type: "paragraph", label: "Paragraph", icon: <GripVertical className="h-4 w-4" /> },
  { type: "image", label: "Image", icon: <ImageIcon className="h-4 w-4" /> },
  { type: "video", label: "Video", icon: <VideoIcon className="h-4 w-4" /> },
  { type: "link", label: "Link", icon: <Link2 className="h-4 w-4" /> },
  { type: "list", label: "List", icon: <List className="h-4 w-4" /> },
  { type: "quote", label: "Quote", icon: <Quote className="h-4 w-4" /> },
  { type: "divider", label: "Divider", icon: <Minus className="h-4 w-4" /> },
];

const initialBlockByType: Record<Block["type"], Block> = {
  heading: { type: "heading", level: 2, text: "Section title" },
  paragraph: { type: "paragraph", text: "Start writing your story..." },
  image: { type: "image", publicId: "sample/admin/cover-1", alt: "", caption: "" },
  video: { type: "video", publicId: "sample/admin/promo-video", caption: "", posterId: undefined },
  link: { type: "link", href: "https://www.dimondcastle.com", label: "Dimond Castle" },
  list: { type: "list", ordered: false, items: ["List item"] },
  quote: { type: "quote", text: "Inspirational quote", cite: "Dimond Castle" },
  divider: { type: "divider" },
};

function cloneBlock(block: Block): Block {
  try {
    return structuredClone(block);
  } catch {
    return JSON.parse(JSON.stringify(block)) as Block;
  }
}

export function BlockEditor({ locale, blocks, onChange, onRequestMedia }: BlockEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dir = locale === "ar" ? "rtl" : "ltr";

  const items = useMemo(() => blocks.map((_, index) => index.toString()), [blocks]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);
    const reordered = arrayMove(blocks, oldIndex, newIndex);
    onChange(reordered);
  }

  function updateBlock(index: number, block: Block) {
    const next = [...blocks];
    next[index] = block;
    onChange(next);
  }

  function removeBlock(index: number) {
    const next = blocks.filter((_, i) => i !== index);
    onChange(next);
  }

  function duplicateBlock(index: number) {
    const next = [...blocks.slice(0, index + 1), cloneBlock(blocks[index]), ...blocks.slice(index + 1)];
    onChange(next);
  }

  function addBlock(type: Block["type"]) {
    const template = initialBlockByType[type];
    onChange([...blocks, { ...template } as Block]);
  }

  return (
    <div className="space-y-4" dir={dir}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {blocks.map((block, index) => (
            <SortableBlockCard
              key={index}
              id={index.toString()}
              index={index}
              block={block}
              locale={locale}
              onRemove={() => removeBlock(index)}
              onDuplicate={() => duplicateBlock(index)}
              onChange={(updated) => updateBlock(index, updated)}
              onRequestMedia={onRequestMedia}
            />
          ))}
        </SortableContext>
      </DndContext>

      <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Add block</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          {blockOptions.map((option) => (
            <button
              key={option.type}
              type="button"
              onClick={() => addBlock(option.type)}
              className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:shadow"
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

type SortableBlockCardProps = {
  id: string;
  index: number;
  block: Block;
  locale: Locale;
  onRemove: () => void;
  onDuplicate: () => void;
  onChange: (block: Block) => void;
  onRequestMedia?: BlockEditorProps["onRequestMedia"];
};

function SortableBlockCard({
  id,
  index,
  block,
  locale,
  onRemove,
  onDuplicate,
  onChange,
  onRequestMedia,
}: SortableBlockCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm ${isDragging ? "opacity-70" : ""}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-emerald-50 pb-3">
        <div className="flex items-center gap-3 text-sm font-semibold text-emerald-800">
          <button
            type="button"
            {...listeners}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600"
            aria-label="Drag block"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <span>
            {index + 1}. {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDuplicate}
            className="rounded-xl border border-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            <Copy className="mr-1 inline h-4 w-4" /> Duplicate
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
          >
            <Trash2 className="mr-1 inline h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      <div className="pt-4 text-left">
        <BlockFields
          block={block}
          locale={locale}
          onChange={onChange}
          onRequestMedia={onRequestMedia}
        />
      </div>
    </div>
  );
}

type BlockFieldsProps = {
  block: Block;
  locale: Locale;
  onChange: (block: Block) => void;
  onRequestMedia?: BlockEditorProps["onRequestMedia"];
};

function BlockFields({ block, onChange, onRequestMedia, locale }: BlockFieldsProps) {
  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-700">Level</label>
            <select
              value={block.level}
              onChange={(event) => onChange({ ...block, level: Number(event.target.value) as 1 | 2 | 3 | 4 })}
              className="rounded-xl border border-emerald-100 px-3 py-1.5 text-sm"
            >
              {[1, 2, 3, 4].map((level) => (
                <option key={level} value={level}>
                  H{level}
                </option>
              ))}
            </select>
          </div>
          <input
            type="text"
            value={block.text}
            onChange={(event) => onChange({ ...block, text: event.target.value })}
            placeholder="Heading text"
            dir={locale === "ar" ? "rtl" : "ltr"}
            className="w-full rounded-xl border border-emerald-100 px-3 py-2 text-lg font-semibold text-slate-900"
          />
        </div>
      );
    case "paragraph":
      return (
        <textarea
          value={block.text}
          onChange={(event) => onChange({ ...block, text: event.target.value })}
          rows={5}
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm leading-6 text-slate-700"
          placeholder="Key message..."
        />
      );
    case "image":
      return (
        <div className="space-y-3">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-6">
            <div className="relative h-40 w-full overflow-hidden rounded-2xl bg-slate-200">
              {block.publicId ? (
                <Image
                  src={`https://res.cloudinary.com/demo/image/upload/w_600,f_auto/${block.publicId}.jpg`}
                  alt={block.alt || ""}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">No image</div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  onRequestMedia?.("image", (publicId) => onChange({ ...block, publicId }))
                }
                className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Choose image
              </button>
              {block.publicId && (
                <button
                  type="button"
                  onClick={() => onChange({ ...block, publicId: "" })}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <input
            type="text"
            value={block.alt ?? ""}
            onChange={(event) => onChange({ ...block, alt: event.target.value })}
            placeholder="Alt text"
            className="w-full rounded-xl border border-emerald-100 px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={block.caption ?? ""}
            onChange={(event) => onChange({ ...block, caption: event.target.value })}
            placeholder="Caption"
            className="w-full rounded-xl border border-emerald-100 px-3 py-2 text-sm"
          />
        </div>
      );
    case "video":
      return (
        <div className="space-y-3">
          <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-6 text-center">
            <p className="text-sm font-semibold text-emerald-800">Video asset</p>
            <p className="mt-1 text-xs text-emerald-600">{block.publicId || "No video selected"}</p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => onRequestMedia?.("video", (publicId) => onChange({ ...block, publicId }))}
                className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Choose video
              </button>
              {block.publicId && (
                <button
                  type="button"
                  onClick={() => onChange({ ...block, publicId: "" })}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <input
            type="text"
            value={block.caption ?? ""}
            onChange={(event) => onChange({ ...block, caption: event.target.value })}
            placeholder="Caption"
            className="w-full rounded-xl border border-emerald-100 px-3 py-2 text-sm"
          />
          <input
            type="text"
            value={block.posterId ?? ""}
            onChange={(event) => onChange({ ...block, posterId: event.target.value })}
            placeholder="Poster public ID (optional)"
            className="w-full rounded-xl border border-emerald-100 px-3 py-2 text-sm"
          />
        </div>
      );
    case "link":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Label</label>
            <input
              type="text"
              value={block.label}
              onChange={(event) => onChange({ ...block, label: event.target.value })}
              className="w-full rounded-xl border border-emerald-100 px-3 py-2 text-sm"
              placeholder="Learn more"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Href</label>
            <input
              type="text"
              value={block.href}
              onChange={(event) => onChange({ ...block, href: event.target.value })}
              className="w-full rounded-xl border border-emerald-100 px-3 py-2 text-sm"
              placeholder="https:// or /path"
            />
          </div>
        </div>
      );
    case "list":
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">List style</label>
            <select
              value={block.ordered ? "ordered" : "unordered"}
              onChange={(event) => onChange({ ...block, ordered: event.target.value === "ordered" })}
              className="rounded-xl border border-emerald-100 px-3 py-1.5 text-sm"
            >
              <option value="unordered">Bullets</option>
              <option value="ordered">Numbers</option>
            </select>
          </div>
          <div className="space-y-2">
            {block.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(event) => {
                    const items = [...block.items];
                    items[itemIndex] = event.target.value;
                    onChange({ ...block, items });
                  }}
                  className="w-full rounded-xl border border-emerald-100 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => onChange({ ...block, items: block.items.filter((_, i) => i !== itemIndex) })}
                  className="rounded-xl border border-red-200 bg-red-50 px-2 py-1 text-xs text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange({ ...block, items: [...block.items, "New item"] })}
              className="rounded-xl border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              + Add item
            </button>
          </div>
        </div>
      );
    case "quote":
      return (
        <div className="space-y-3">
          <textarea
            value={block.text}
            onChange={(event) => onChange({ ...block, text: event.target.value })}
            rows={4}
            dir={locale === "ar" ? "rtl" : "ltr"}
            className="w-full rounded-2xl border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-sm italic text-emerald-900"
          />
          <input
            type="text"
            value={block.cite ?? ""}
            onChange={(event) => onChange({ ...block, cite: event.target.value })}
            placeholder="Citation"
            className="w-full rounded-xl border border-emerald-100 px-3 py-2 text-xs uppercase tracking-wide text-emerald-600"
          />
        </div>
      );
    case "divider":
      return <div className="h-1 rounded-full bg-emerald-200" />;
    default:
      return null;
  }
}
