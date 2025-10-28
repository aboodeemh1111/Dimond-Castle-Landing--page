Dimond Castle — Admin Panel (Build Spec)

App URL: https://admin.dimondcastle.com
Backend API: https://api.dimondcastle.com
Public Site: https://www.dimondcastle.com

Goal: Full CMS + page builder: manage blog, pages/sections, navigation, theme, media, site settings, contact messages — in Arabic & English.

1. Tech & Project Setup

Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
State: Zustand (simple store) or React Query (for API)
Editor: TipTap/Editor.js (block-based)
Icons: Lucide React
Media: Cloudinary (signed uploads, CDN)
Auth: JWT (access + refresh) — single role (Admin)
DB: MongoDB Atlas (via API)
Deploy: Vercel (admin app)

Env (Admin App):

NEXT_PUBLIC_API_BASE_URL=https://api.dimondcastle.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<cloud>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<optional if using unsigned>

2. App Structure (Admin Frontend)
   /app
   /login/page.tsx
   /dashboard/page.tsx
   /blogs/page.tsx
   /blogs/new/page.tsx
   /blogs/[id]/page.tsx
   /pages/page.tsx
   /pages/new/page.tsx
   /pages/[id]/page.tsx
   /navigation/page.tsx
   /theme/page.tsx
   /media/page.tsx
   /settings/page.tsx
   /contacts/page.tsx
   /layout.tsx // Admin shell (sidebar + topbar) w/ Protected wrapper
   /lib
   auth.ts // token helpers, Protected component
   api.ts // fetch helpers (with bearer token)
   /components
   Sidebar.tsx, Topbar.tsx, Card.tsx, Table.tsx, Tabs.tsx
   BlockEditor/\* // rich blocks for blog/page (heading, p, image, video, link, list)
   /styles
   globals.css

Routing rule: Everything under / except /login uses a Protected wrapper (redirect to /login if no access token).

3. Authentication (Single Role Admin)

Login flow:

/login → email + password

POST /auth/login → { accessToken, refreshToken }

Store accessToken in memory (Zustand); refreshToken as httpOnly cookie (set by API).

Guards:

Authorization: Bearer <accessToken> for all admin API calls.

Refresh flow: call /auth/refresh on 401 to get new access token.

UI:

Topbar → “Logout” clears state and cookies.

4. Collections (MongoDB Atlas)
   4.1 users (admins only)
   type User = {
   \_id: string;
   email: string;
   name: string;
   passwordHash: string;
   isActive: boolean;
   createdAt: string;
   updatedAt: string;
   };

4.2 blogs
type Block =
| { type: 'heading'; level: 1|2|3|4; text: string }
| { type: 'paragraph'; text: string }
| { type: 'image'; publicId: string; alt?: string; caption?: string }
| { type: 'video'; publicId: string; caption?: string; posterId?: string }
| { type: 'link'; href: string; label: string }
| { type: 'list'; ordered?: boolean; items: string[] }
| { type: 'quote'; text: string; cite?: string };

type BlogDoc = {
\_id: string;
slug: string;
status: 'draft' | 'published';
coverImage?: string; // cloudinary publicId
tags?: string[];
author?: string;
publishedAt?: string;
ar: { title: string; excerpt?: string; blocks: Block[]; seo?: { title?: string; description?: string } };
en: { title: string; excerpt?: string; blocks: Block[]; seo?: { title?: string; description?: string } };
createdAt: string;
updatedAt: string;
};

4.3 pages (page builder)
type SectionInstance = {
key: 'hero-basic' | 'rich-text' | 'logo-wall' | 'products-grid' | 'transport-steps' | 'cta-banner' /_ extend _/;
// Per-locale props when text is involved:
ar?: Record<string, any>;
en?: Record<string, any>;
// Shared props (like media ids, flags, layout options)
props?: Record<string, any>;
};

type PageDoc = {
\_id: string;
slug: string; // '/about', '/transport', '/custom-slug'
status: 'draft'|'published';
template?: 'blank'|'default';
ar: { title: string; seo?: { title?: string; description?: string; ogImage?: string }; sections: SectionInstance[] };
en: { title: string; seo?: { title?: string; description?: string; ogImage?: string }; sections: SectionInstance[] };
createdAt: string;
updatedAt: string;
};

4.4 navigation
type NavItem = {
label: { ar: string; en: string };
href: string; // '/about' | external url
children?: NavItem[];
};

type NavigationDoc = {
\_id: string;
name: 'main';
items: NavItem[];
updatedAt: string;
};

4.5 theme
type ThemeDoc = {
\_id: string;
colors: { primary: string; secondary: string; bg: string; text: string; accent?: string };
logoLight?: string; // cloudinary publicId
logoDark?: string;
typography?: { heading: string; body: string };
updatedAt: string;
};

4.6 media (optional catalog)
type MediaDoc = {
\_id: string;
publicId: string;
resourceType: 'image'|'video';
format?: string;
width?: number;
height?: number;
bytes?: number;
url?: string;
secureUrl?: string;
folder?: string;
createdAt: string;
uploadedBy?: string; // userId
};

4.7 settings
type SettingsDoc = {
\_id: string;
contact: { email?: string; phone?: string; address?: string; mapEmbed?: string };
seoDefaults?: { title?: string; description?: string; ogImage?: string };
updatedAt: string;
};

4.8 contacts
type ContactDoc = {
\_id: string;
name: string;
email: string;
message: string;
createdAt: string;
status: 'new' | 'in_progress' | 'closed';
};

Indexes:

blogs: { slug: 1 } unique, { status: 1, publishedAt: -1 }

pages: { slug: 1 } unique, { status: 1 }

navigation: { name: 1 } unique

media: { publicId: 1 } unique

contacts: { createdAt: -1 }

5. API Contracts (to call from Admin)

All admin routes require Authorization: Bearer <accessToken>
Base: ${NEXT_PUBLIC_API_BASE_URL}

Auth

POST /auth/login → { accessToken, refreshToken }
body: { email, password }

POST /auth/refresh → { accessToken }

POST /auth/logout → 204 (clear refresh cookie)

Blogs

GET /blogs?status=all|draft|published&page=1&limit=20&search=...

GET /blogs/:id or GET /blogs/slug/:slug

POST /blogs → create (send BlogDoc sans ids/dates)

PUT /blogs/:id

DELETE /blogs/:id

Pages (Page Builder)

GET /pages?status=all|draft|published

GET /pages/:id or GET /pages/slug/:slug

POST /pages → create page skeleton (slug, titles)

PUT /pages/:id → update sections (add/remove/reorder), titles, seo

DELETE /pages/:id

Navigation

GET /navigation/main

PUT /navigation/main → replace entire items array (validated)

Theme

GET /theme

PUT /theme

Media (Cloudinary)

POST /media/signature → { timestamp, signature, apiKey, cloudName, folder, uploadPreset? }
(Use for direct browser upload to Cloudinary)

DELETE /media/:publicId → remove asset (and from media collection if used)

Optional: GET /media (list)

Settings

GET /settings

PUT /settings

Contacts

GET /contacts?page=1&limit=20&status=new|in_progress|closed

PUT /contacts/:id → update status

Revalidation: After content mutations, API triggers ISR revalidation/Webhook for the public site.

6. Cloudinary Integration (Admin UI)

Signed upload flow (recommended):

Admin opens image/video picker → clicks Upload.

Admin app calls POST /media/signature to get signed params.

Browser uploads directly to Cloudinary:

https://api.cloudinary.com/v1_1/<cloud>/image/upload

https://api.cloudinary.com/v1_1/<cloud>/video/upload

Send: file, api_key, timestamp, signature, folder, public_id?, upload_preset?.

Cloudinary returns { public_id, secure_url, resource_type, width, height, bytes }.

Admin app saves public_id in the edited entity (blog/page/section/theme).

Delivery examples:

Image: https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_1200/<public_id>.jpg
Video: https://res.cloudinary.com/<cloud>/video/upload/f_auto,q_auto,w_1280/<public_id>.mp4

7. UI/UX Requirements (Admin)
   Layout

Sidebar (fixed): Dashboard, Blogs, Pages, Navigation, Media, Theme, Settings, Contacts, Logout

Topbar: Search (optional), “New” dropdown, user menu

Cards/Tables: rounded-2xl, soft shadows, gold accents #D4AF37

Blogs

List page: table with title, status, updatedAt, actions (edit, delete)

Editor page:

Tabs: EN / AR

Fields: title, excerpt, coverImage, tags, publishedAt, status

Block editor: add/reorder/remove blocks (heading, paragraph, image, video, link, list, quote)

Actions: Preview, Publish/Unpublish, Save Draft, Delete

Pages (Page Builder)

List page: table with slug, status, updatedAt

Editor page:

Basic info: slug, status, template

Tabs: EN / AR (page title + SEO)

Sections list (sortable):

Add section from catalog (hero-basic, rich-text, logo-wall, products-grid, transport-steps, cta-banner, …)

For each section: show a props form

Text props per-locale (EN/AR tabs inside section card)

Media props (Cloudinary picker)

Layout toggles

Actions: duplicate, delete, move up/down

Navigation

Tree editor with drag & drop

Each item: labels (AR/EN), href, children[]

Save replaces items array atomically

Theme

Color pickers: primary, secondary, bg, text, accent

Logo upload (light/dark)

Typography selects (safe list)

Media Library

Grid with filters (image/video), search by publicId

Upload button → signed upload modal

Copy URL / Delete asset

Settings

Contact info fields

SEO defaults (title, description, ogImage)

Save button (debounced)

Contacts

Table: name, email, message (truncated), createdAt, status

Detail modal + status update

8. i18n (EN/AR) Rules

Every text field is per-locale: stored under en and ar.

Edit forms show tabs to switch locale.

For sections/components: All textual props appear twice (EN & AR).

Preview toggle for RTL in admin (e.g., <html dir="rtl"> in preview frame).

9. Validation (Frontend)

Slugs: ^/[a-z0-9-]+$ for pages; blog ^[a-z0-9-]+$ (no leading slash).

Required titles: ar.title & en.title for blogs/pages.

Navigation: validate href format (internal /... or https://...).

Media: require valid Cloudinary public_id when needed.

Length guards: title ≤ 100, excerpt ≤ 200, meta description ≤ 160.

Use zod schemas co-located with forms.

10. Security (Frontend Responsibilities)

Send Authorization: Bearer <token> on every admin request.

On 401 → call /auth/refresh and retry once.

Sanitize user inputs in rich editor (the API should sanitize too).

Never embed API secrets in frontend env.

11. Styling Tokens (Tailwind)
    // tailwind theme extension snippet
    colors: {
    primary: '#D4AF37',
    secondary: '#2E5E4E',
    cream: '#F9F7F3',
    textDark: '#1E1E1E',
    graySoft: '#CFCFCF',
    accent: '#E9DFC7',
    white: '#FFFFFF',
    }

Cards: rounded-2xl bg-white shadow-sm hover:shadow-md transition
Inputs: rounded-xl border-gray-200 focus:ring-primary/40 focus:border-primary
Buttons: solid (primary), outline (secondary), subtle hover darken.

12. Minimal Types (to start coding)
    export type Locale = 'en' | 'ar';

export type SEO = { title?: string; description?: string; ogImage?: string };

export type BlogStatus = 'draft' | 'published';
export type PageStatus = 'draft' | 'published';

export type CloudPublicId = string;

13. Core Components to Implement First

Auth

/login page + useAuth() hook

Protected wrapper for /dashboard and below

Media Upload Modal

Calls /media/signature

Uploads to Cloudinary

Returns public_id to form caller

Block Editor (Blog + Rich Text Sections)

Add/reorder/delete blocks (drag & drop)

Render preview (read-only)

Section Catalog & Renderer (Pages)

Catalog: hero-basic, rich-text, logo-wall

Renderer stub with prop forms (EN/AR tabs)

14. Example API Calls (Frontend Helper)
    // lib/api.ts
    export async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`, {
    ...opts,
    headers: {
    'Content-Type': 'application/json',
    ...(opts.headers || {}),
    Authorization: `Bearer ${getAccessToken()}`, // from auth store
    },
    cache: 'no-store',
    });
    if (res.status === 401) {
    await refresh(); // call /auth/refresh
    return api<T>(path, opts);
    }
    if (!res.ok) throw new Error(await res.text());
    return res.json();
    }

15. Manual Release Process (Admin App)

Local checks: lint, typecheck, next build

Vercel Deploy: push to main (or use dashboard)

Config env: set NEXT_PUBLIC_API_BASE_URL, Cloudinary envs

Smoke test: login, CRUD blog, page builder, media upload

16. Acceptance Criteria (Admin MVP)

Login works; all admin routes gated.

Blogs: create, edit (blocks), publish/unpublish, delete.

Pages: create; add/reorder/remove sections; per-locale content; publish.

Navigation: edit tree; save.

Theme: update colors/logos; changes reflected in preview build.

Media: upload via Cloudinary (signed); copy public_id; delete asset.

Settings: update contact + SEO defaults.

Contacts: list & update status.

All forms validate; errors shown inline.

Arabic editing supports RTL preview.

17. Future (Optional) Enhancements

Activity audit log (auditLogs)

Scheduled publishing for blogs/pages

Reusable “snippets” (content fragments like footers/CTAs)

Role expansion (if ever needed)

2FA for admin login

Quick Cursor Task Starters

“Generate /login page, useAuth() hook, and Protected layout wrapper.”

“Scaffold Blogs list + editor pages with a block editor (heading, paragraph, image, video, link, list).”

“Create a MediaUploadModal that fetches /media/signature and uploads directly to Cloudinary.”

“Build a Pages builder: sections catalog, section card with EN/AR tabs, sortable list, and JSON output.”
