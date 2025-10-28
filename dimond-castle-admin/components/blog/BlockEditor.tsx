"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { useEffect } from "react";
import type { Block } from "@/types";

interface BlockEditorProps {
  value: Block[];
  onChange: (blocks: Block[]) => void;
  onImageAdd?: () => void;
}

export default function BlockEditor({
  value,
  onChange,
  onImageAdd,
}: BlockEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: blocksToTiptap(value),
    onUpdate: ({ editor }) => {
      const blocks = tiptapToBlocks(editor.getJSON());
      onChange(blocks);
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value) {
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = JSON.stringify(blocksToTiptap(value));
      if (currentContent !== newContent) {
        editor.commands.setContent(blocksToTiptap(value));
      }
    }
  }, [value, editor]);

  if (!editor) {
    return <div className="text-admin-textLight">Loading editor...</div>;
  }

  const MenuButton = ({
    onClick,
    isActive,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-200 transition-colors ${
        isActive ? "bg-admin-primary text-white hover:bg-indigo-600" : ""
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-admin-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="editor-menu-bar flex flex-wrap gap-1 p-3 bg-gray-50 border-b border-admin-border">
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 className="w-5 h-5" />
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="w-5 h-5" />
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
        >
          <Heading3 className="w-5 h-5" />
        </MenuButton>
        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          isActive={editor.isActive("heading", { level: 4 })}
        >
          <Heading4 className="w-5 h-5" />
        </MenuButton>

        <div className="w-px h-8 bg-admin-border mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <Bold className="w-5 h-5" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <Italic className="w-5 h-5" />
        </MenuButton>

        <div className="w-px h-8 bg-admin-border mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          <List className="w-5 h-5" />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          <ListOrdered className="w-5 h-5" />
        </MenuButton>

        <div className="w-px h-8 bg-admin-border mx-1" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
        >
          <Quote className="w-5 h-5" />
        </MenuButton>

        <MenuButton
          onClick={() => {
            const url = window.prompt("Enter URL:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          isActive={editor.isActive("link")}
        >
          <LinkIcon className="w-5 h-5" />
        </MenuButton>

        {onImageAdd && (
          <MenuButton onClick={onImageAdd}>
            <ImageIcon className="w-5 h-5" />
          </MenuButton>
        )}
      </div>

      {/* Editor Content */}
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

// Helper functions to convert between Block[] and TipTap JSON
function blocksToTiptap(blocks: Block[]): any {
  const content = blocks.map((block) => {
    switch (block.type) {
      case "heading":
        return {
          type: "heading",
          attrs: { level: block.level },
          content: [{ type: "text", text: block.text }],
        };
      case "paragraph":
        return {
          type: "paragraph",
          content: [{ type: "text", text: block.text }],
        };
      case "image":
        return {
          type: "image",
          attrs: {
            src: `https://res.cloudinary.com/demo/image/upload/${block.publicId}`,
          },
        };
      case "list":
        return {
          type: block.ordered ? "orderedList" : "bulletList",
          content: block.items.map((item) => ({
            type: "listItem",
            content: [
              { type: "paragraph", content: [{ type: "text", text: item }] },
            ],
          })),
        };
      case "quote":
        return {
          type: "blockquote",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: block.text }],
            },
          ],
        };
      default:
        return { type: "paragraph", content: [] };
    }
  });

  return {
    type: "doc",
    content: content.length > 0 ? content : [{ type: "paragraph" }],
  };
}

function tiptapToBlocks(doc: any): Block[] {
  if (!doc || !doc.content) return [];

  const blocks: Block[] = [];

  for (const node of doc.content) {
    switch (node.type) {
      case "heading":
        blocks.push({
          type: "heading",
          level: node.attrs.level as 1 | 2 | 3 | 4,
          text: extractText(node),
        });
        break;
      case "paragraph":
        const text = extractText(node);
        if (text) {
          blocks.push({
            type: "paragraph",
            text,
          });
        }
        break;
      case "image":
        // Extract publicId from Cloudinary URL
        const src = node.attrs.src || "";
        const publicId = src.split("/upload/")[1] || src;
        blocks.push({
          type: "image",
          publicId,
          alt: node.attrs.alt,
        });
        break;
      case "bulletList":
      case "orderedList":
        const items: string[] = [];
        if (node.content) {
          for (const listItem of node.content) {
            items.push(extractText(listItem));
          }
        }
        blocks.push({
          type: "list",
          ordered: node.type === "orderedList",
          items,
        });
        break;
      case "blockquote":
        blocks.push({
          type: "quote",
          text: extractText(node),
        });
        break;
    }
  }

  return blocks;
}

function extractText(node: any): string {
  if (!node) return "";
  if (node.type === "text") return node.text || "";
  if (node.content && Array.isArray(node.content)) {
    return node.content.map(extractText).join("");
  }
  return "";
}
