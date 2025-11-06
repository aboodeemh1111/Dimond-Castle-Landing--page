# Page Builder System Documentation

## Overview

The Page Builder is a comprehensive visual content management system that allows you to build any page with sections, rows/columns, and components. It supports bilingual content (EN/AR), responsive design controls, and seamless integration with your existing site.

## Features

✅ **Visual Page Builder** - Drag-and-drop interface for building pages
✅ **Flexible Grid System** - Responsive rows and columns (1-12 column spans)
✅ **Rich Content Blocks** - 10+ content types (headings, images, videos, buttons, etc.)
✅ **Bilingual Support** - Full EN/AR content management with RTL support
✅ **Responsive Controls** - Per-breakpoint settings (base, sm, md, lg, xl)
✅ **Design Tokens** - Safe, finite choices for spacing, colors, and layout
✅ **SEO Optimized** - Per-locale SEO settings (title, description, OG image)
✅ **Live Preview** - Preview pages before publishing
✅ **Draft/Published Workflow** - Control page visibility

## Architecture

### Backend (API)

**Location**: `dimond-castle-api/`

- **Model**: `src/models/Page.ts` - MongoDB schema for pages
- **Validation**: `src/validation/pages.ts` - Zod schemas for request validation
- **Routes**: `src/routes/pages.ts` - CRUD endpoints for pages

**API Endpoints**:
- `GET /api/pages` - List pages (with search & filters)
- `GET /api/pages/:id` - Get page by ID
- `GET /api/pages/slug/:slug` - Get published page by slug (public)
- `POST /api/pages` - Create new page
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page
- `POST /api/pages/check-slug` - Check slug availability

### Admin Panel

**Location**: `dimond-castle-admin-v2/src/`

**Key Files**:
- `lib/pages-api.ts` - API client and TypeScript types
- `app/admin/pages/page.tsx` - Pages list view
- `app/admin/pages/new/page.tsx` - Create new page
- `app/admin/pages/[id]/page.tsx` - Page editor route

**Components** (`components/pages/`):
- `PageEditor.tsx` - Main editor layout
- `PageSettings.tsx` - Sidebar settings panel
- `SectionsList.tsx` - Sections management
- `SectionCatalog.tsx` - Section templates catalog
- `SectionCard.tsx` - Individual section editor
- `SectionStyleEditor.tsx` - Section style controls
- `RowsList.tsx` - Rows management
- `ColumnCard.tsx` - Column editor with responsive spans
- `BlocksList.tsx` - Blocks management
- `BlockCatalog.tsx` - Block types catalog
- `BlockCard.tsx` - Individual block editor

### Public Site

**Location**: `dimond-castle-web/app/`

**Key Files**:
- `lib/pages-api.ts` - API client for fetching pages
- `components/PageRenderer.tsx` - Renders pages from JSON
- `[slug]/page.tsx` - Dynamic route (supports both old & new system)

## Data Model

### Page Document

```typescript
type Page = {
  _id: string
  slug: string                    // Must start with /
  status: 'draft' | 'published'
  template: 'default' | 'landing' | 'blank'
  en: LocaleContent
  ar: LocaleContent
  createdAt: string
  updatedAt: string
}

type LocaleContent = {
  title: string
  seo?: SEO
  sections: Section[]
}

type SEO = {
  title?: string          // ≤60 chars
  description?: string    // ≤160 chars
  ogImage?: string        // Cloudinary public_id
}
```

### Section Structure

```typescript
type Section = {
  key: string              // Template identifier
  label?: string           // Admin-only label
  style?: SectionStyle     // Layout & design settings
  rows?: Row[]             // For grid-based sections
  blocks?: Block[]         // For simple sections
  en?: Record<string, any> // Locale-specific overrides
  ar?: Record<string, any>
  props?: Record<string, any> // Shared props
}

type SectionStyle = {
  background?: 'white' | 'cream' | 'green' | 'gold' | 'dark'
  container?: 'narrow' | 'normal' | 'wide' | 'full'
  paddingTop?: ResponsiveValue<Spacing>
  paddingBottom?: ResponsiveValue<Spacing>
  dividerTop?: boolean
  dividerBottom?: boolean
}
```

### Grid System

```typescript
type Row = {
  gap?: ResponsiveValue<Spacing>
  columns: GridCol[]  // 1-6 columns
}

type GridCol = {
  span?: ResponsiveValue<number>  // 1-12 per breakpoint
  align?: 'left' | 'center' | 'right'
  vAlign?: 'start' | 'center' | 'end'
  visibility?: ResponsiveValue<'show' | 'hide'>
  blocks: Block[]
}

type ResponsiveValue<T> = {
  base?: T
  sm?: T
  md?: T
  lg?: T
  xl?: T
}
```

### Content Blocks

```typescript
type Block =
  | { type: 'heading'; level: 1|2|3|4; textEN?: string; textAR?: string }
  | { type: 'paragraph'; textEN?: string; textAR?: string }
  | { type: 'image'; publicId: string; altEN?: string; altAR?: string; captionEN?: string; captionAR?: string }
  | { type: 'video'; publicId: string; captionEN?: string; captionAR?: string; posterId?: string }
  | { type: 'list'; ordered?: boolean; itemsEN?: string[]; itemsAR?: string[] }
  | { type: 'quote'; textEN?: string; textAR?: string; citeEN?: string; citeAR?: string }
  | { type: 'button'; labelEN: string; labelAR: string; href: string; style?: 'primary'|'secondary' }
  | { type: 'icon-feature'; titleEN: string; titleAR: string; textEN?: string; textAR?: string; icon?: string }
  | { type: 'embed'; provider: 'youtube'|'vimeo'|'map'|'iframe'; url?: string; html?: string }
  | { type: 'divider' }
```

## Usage Guide

### Creating a Page

1. Navigate to `/admin/pages`
2. Click "New Page"
3. Enter page title (EN & AR) and slug
4. Click "Create Page"

### Building Content

1. **Add Sections**: Click "Add Section" and choose from:
   - **Content Sections**: Hero, Rich Text, Two Column, Image Gallery, CTA Banner
   - **Layout Sections**: Custom Grid, Spacer, Divider

2. **Configure Section Style**:
   - Background color
   - Container width
   - Padding (top/bottom)
   - Dividers

3. **Add Rows & Columns** (for grid sections):
   - Choose column layout (1-4 columns)
   - Set responsive spans per breakpoint
   - Configure alignment and visibility

4. **Add Content Blocks**:
   - Heading (H1-H4)
   - Paragraph
   - Image (Cloudinary)
   - Video (Cloudinary)
   - List (ordered/unordered)
   - Quote
   - Button (CTA)
   - Icon Feature
   - Embed (YouTube, Vimeo, Map, iframe)
   - Divider

5. **Switch Locales**: Use EN/AR tabs to edit bilingual content

### Page Settings

**Sidebar Controls**:
- Slug (must be unique)
- Template (default/landing/blank)
- Status (draft/published)
- Titles (EN/AR)
- SEO (per locale)

### Publishing

1. Click "Save" to save draft
2. Click "Publish" to make live
3. Click "Preview" to view before publishing

## Design Tokens

### Spacing
- `none` - No padding
- `xs` - 1rem (16px)
- `sm` - 2rem (32px)
- `md` - 3rem (48px)
- `lg` - 4rem (64px)
- `xl` - 6rem (96px)

### Container Widths
- `narrow` - 768px
- `normal` - 1280px
- `wide` - 1400px
- `full` - 100%

### Background Colors
- `white` - White background
- `cream` - Cream/beige
- `green` - Brand green
- `gold` - Brand gold
- `dark` - Dark slate

### Responsive Breakpoints
- `base` - Mobile (default)
- `sm` - 640px+
- `md` - 768px+
- `lg` - 1024px+
- `xl` - 1280px+

## Example: Hero Section

```json
{
  "key": "hero",
  "label": "Homepage Hero",
  "style": {
    "background": "cream",
    "container": "wide",
    "paddingTop": { "base": "xl" },
    "paddingBottom": { "base": "xl" }
  },
  "rows": [
    {
      "gap": { "base": "lg" },
      "columns": [
        {
          "span": { "base": 12, "md": 7 },
          "blocks": [
            {
              "type": "heading",
              "level": 1,
              "textEN": "White Diamond Rice",
              "textAR": "أرز وايت دايموند"
            },
            {
              "type": "paragraph",
              "textEN": "Premium basmati for Saudi cuisine.",
              "textAR": "بسمتي فاخر للمائدة السعودية."
            },
            {
              "type": "button",
              "labelEN": "Explore Products",
              "labelAR": "اكتشف المنتجات",
              "href": "/products",
              "style": "primary"
            }
          ]
        },
        {
          "span": { "base": 12, "md": 5 },
          "blocks": [
            {
              "type": "image",
              "publicId": "dimond-castle/hero/bag_v1",
              "altEN": "White Diamond rice bag",
              "altAR": "كيس أرز وايت دايموند"
            }
          ]
        }
      ]
    }
  ]
}
```

## Security

- ✅ All HTML embeds sanitized server-side
- ✅ Only whitelisted embed providers
- ✅ No custom CSS or arbitrary Tailwind
- ✅ Cloudinary public_id only (no raw URLs)
- ✅ JWT-only admin access
- ✅ Rate limiting on API

## Validation Rules

- Page titles (EN/AR): Required
- Slug: Required, format `^\/[a-z0-9-\/]+$`, unique
- At least one section before publish
- Columns per row: 1-6
- Column spans: 1-12
- SEO title: ≤60 characters
- SEO description: ≤160 characters
- Media: Cloudinary public_id required

## Future Enhancements

- [ ] Version history & rollback
- [ ] Auto-save drafts
- [ ] Undo/redo
- [ ] More block types (FAQ, pricing table, timeline, carousel)
- [ ] Advanced responsive controls per block
- [ ] A/B testing
- [ ] Analytics integration
- [ ] Component library (reusable sections)
- [ ] Import/export pages

## Troubleshooting

### Page not rendering
- Check page status is "published"
- Verify slug format starts with `/`
- Check API connection in browser console

### Images not loading
- Verify Cloudinary public_id is correct
- Check Cloudinary environment variables
- Ensure images are uploaded to Cloudinary

### Responsive layout issues
- Review column span values (should total ≤12)
- Check breakpoint settings
- Test in browser responsive mode

## Support

For issues or questions:
1. Check browser console for errors
2. Verify API server is running
3. Check MongoDB connection
4. Review validation errors in API response

---

**Built with**: Next.js, React, TypeScript, MongoDB, Zod, shadcn/ui, Tailwind CSS

