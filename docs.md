**Project type:** Corporate landing website + Blog + Private Admin Panel (CMS)

**Brand/site name:** Dimond Castle

**Primary market:** Saudi Arabia (Arabic + English)

---

## 1) Project Overview

Dimond Castle’s website is a premium corporate presence with a lightweight blog for SEO and a secure admin panel for full content control (text, images, links, blog). Public visitors do not have accounts. Only internal admins log into the admin panel.

**Core objectives:**

- Present Dimond Castle’s story, values, sectors, VIP clients, products & services, and transport solutions.
- Publish SEO-optimized blog posts.
- Provide a contact form for inquiries.
- Deliver a professional admin panel to manage _all_ content and media.
- Ensure fast, secure, mobile-first experience and strong Google indexing.

**Non-goals:**

- No public user registration or e‑commerce in phase 1.

---

## 2) System Architecture

**Strict separation:** The public website and the admin panel are built, deployed, and hosted as **two distinct applications** in separate folders (and recommended: separate repositories, projects, and domains/subdomains).

**Public Web App:** Next.js (SSR/ISR) — serves marketing pages + blog at `https://www.dimondcastle.com`

**Admin Web App:** Next.js (protected routes) — serves CMS UI at `https://admin.dimondcastle.com`

**Backend API:** Express.js (REST) at `https://api.dimondcastle.com`

**Database:** **MongoDB Atlas** (managed cluster; role-scoped users; IP allowlist)

**Media:** **Cloudinary** for **images and videos** (delivery via CDN; transformations; signed uploads)

**Auth:** JWT (access + refresh), secure cookies (httpOnly where applicable)

**Analytics:** GA4 (public only); optional admin telemetry

**Conceptual diagram:**

```
Visitor ──> Public Web (Next.js) ─┐
                                 │
Admin  ──> Admin Web (Next.js) ───┼──> Express API ──> MongoDB Atlas (dimond_castle)
                                 │                 └─> Cloudinary (images/videos)
                   CDN <─────────┘

```

---

## 3) Environments & Branching

- **Environments:** `dev` (local), `staging` (optional), `production`.
- **Branching:** simple main/feature flow. Create a feature branch locally, test, then merge into `main` after code review.
- **Deployments:** performed **manually** from developer machines or provider dashboards (no CI/CD).

---

## 4) Repositories & Folder Structure (separate folders, no monorepo)

Security policy: the **public website** and the **admin panel** live in **separate top‑level folders** (and preferably separate repos and hosting projects). This minimizes blast radius and enforces least‑privilege.

### Folder layout on your machine/server

```
/projects
├─ dimond-castle-web/        # Public website (Next.js)
└─ dimond-castle-admin/      # Admin panel (Next.js)

/services
└─ dimond-castle-api/        # Express API

```

### Repo A — `dimond-castle-web` (Public Next.js)

```
/ (repo root)
├─ app/
│  ├─ (public)/page.tsx              # Landing page
│  ├─ about/page.tsx
│  ├─ products/page.tsx
│  ├─ transport/page.tsx
│  ├─ blog/page.tsx
│  ├─ blog/[slug]/page.tsx
│  └─ contact/page.tsx
├─ lib/                              # helpers (api client, seo)
├─ components/                       # shared UI components
└─ public/                           # static assets

```

### Repo B — `dimond-castle-admin` (Admin Next.js)

```
/ (repo root)
├─ app/
│  ├─ login/page.tsx
│  ├─ layout.tsx
│  ├─ dashboard/page.tsx
│  ├─ content/
│  ├─ blogs/
│  ├─ products/
│  ├─ clients/
│  ├─ sectors/
│  ├─ transport/
│  ├─ media/
│  └─ settings/
├─ lib/
└─ components/

```

### Repo C — `dimond-castle-api` (Express)

```
/ (repo root)
├─ src/
│  ├─ index.ts
│  ├─ routes/
│  ├─ controllers/
│  ├─ services/
│  ├─ models/
│  ├─ middlewares/
│  └─ config/
└─ scripts/                          # seed, maintenance

```

**Hosting**

- `dimond-castle-web` → Vercel project → domain `www.dimondcastle.com`
- `dimond-castle-admin` → Vercel project → subdomain `admin.dimondcastle.com`
- `dimond-castle-api` → Render/Railway/VPS → domain `api.dimondcastle.com`

---

## 5) Data Model (MongoDB Atlas)

Cluster: Atlas **M0/M10** to start, DB name: `dimond_castle`.

**users**

```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "passwordHash": "String",
  "role": "superadmin|editor|viewer",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**blogs**

```json
{
  "_id": "ObjectId",
  "title": "String",
  "slug": "String",
  "content": "String",
  "coverImage": "String",
  "metaTitle": "String",
  "metaDescription": "String",
  "tags": ["String"],
  "status": "draft|published",
  "author": "String",
  "publishedAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**products**

```json
{
  "_id": "ObjectId",
  "name": "String",
  "slug": "String",
  "type": "String",
  "description": "String",
  "images": ["String"],
  "videoUrl": "String",
  "sizes": ["String"],
  "country": "String",
  "metaTitle": "String",
  "metaDescription": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**clients**

```json
{
  "_id": "ObjectId",
  "name": "String",
  "logo": "String",
  "website": "String",
  "testimonial": "String",
  "isVip": true,
  "visible": true,
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**sectors**

```json
{
  "_id": "ObjectId",
  "name": "String",
  "icon": "String",
  "description": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**transport**

```json
{
  "_id": "ObjectId",
  "step": 1,
  "title": "String",
  "description": "String",
  "image": "String",
  "videoUrl": "String",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**siteSettings** (centralized editable content; bilingual optional)

```json
{
  "_id": "ObjectId",
  "locale": "ar|en",
  "hero": {
    "title": "String",
    "subtitle": "String",
    "image": "String",
    "videoUrl": "String",
    "ctas": [{ "label": "String", "href": "String" }]
  },
  "intro": { "title": "String", "body": "String", "image": "String" },
  "visionMissionObjectives": {
    "vision": "String",
    "mission": "String",
    "objectives": ["String"]
  },
  "values": [{ "title": "String", "body": "String", "icon": "String" }],
  "vipClientsTitle": "String",
  "sectorsTitle": "String",
  "servicesTitle": "String",
  "transportTitle": "String",
  "contact": {
    "email": "String",
    "phone": "String",
    "address": "String",
    "mapEmbed": "String"
  },
  "seoDefaults": {
    "title": "String",
    "description": "String",
    "ogImage": "String"
  },
  "footer": {
    "links": [{ "label": "String", "href": "String" }],
    "copyright": "String"
  },
  "updatedAt": "Date"
}
```

**media** (optional catalog of uploaded assets)

```json
{
  "_id": "ObjectId",
  "publicId": "String",
  "resourceType": "image|video",
  "format": "String",
  "width": 1280,
  "height": 720,
  "bytes": 123456,
  "url": "String",
  "secureUrl": "String",
  "folder": "String",
  "createdAt": "Date",
  "uploadedBy": "ObjectId"
}
```

**contacts**

```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "message": "String",
  "createdAt": "Date",
  "status": "new|in_progress|closed"
}
```

**Indexes**

- blogs: `{ slug: 1 } (unique)`, `{ status: 1, publishedAt: -1 }`
- products: `{ slug: 1 } (unique)`, `{ type: 1 }`
- clients: `{ visible: 1, isVip: 1 }`
- media: `{ publicId: 1 } (unique)`
- contacts: `{ createdAt: -1 }`

---

## 6) API Design (Express.js)

Base URL examples: `https://api.dimondcastle.com` (prod), `https://staging-api.dimondcastle.com`.

**Auth**

- `POST /auth/login` → { email, password } → { accessToken, refreshToken }
- `POST /auth/refresh` → refresh token → new access token

**Blogs**

- `GET /blogs` (public: supports `status=published`, search, pagination)
- `GET /blogs/:slug` (public)
- `POST /blogs` (admin)
- `PUT /blogs/:id` (admin)
- `DELETE /blogs/:id` (admin)

**Products**

- `GET /products`
- `GET /products/:slug`
- `POST /products` (admin)
- `PUT /products/:id` (admin)
- `DELETE /products/:id` (admin)

**Clients**

- `GET /clients?visible=true`
- `POST /clients` (admin)
- `PUT /clients/:id` (admin)
- `DELETE /clients/:id` (admin)

**Sectors**

- `GET /sectors`
- `POST /sectors` (admin)
- `PUT /sectors/:id` (admin)
- `DELETE /sectors/:id` (admin)

**Transport**

- `GET /transport`
- `POST /transport` (admin)
- `PUT /transport/:id` (admin)
- `DELETE /transport/:id` (admin)

**Site Settings**

- `GET /settings?locale=ar|en`
- `PUT /settings` (admin)

**Contacts**

- `POST /contact` (public form submit)
- `GET /contact` (admin list)
- `PUT /contact/:id` (update status)

**Media (Cloudinary)**

- `POST /media/signature` (admin) → returns signed params for **direct browser upload** to Cloudinary (no file goes through API server)
- `POST /media/webhook/cloudinary` → handle upload success (optional)
- `GET /media` (admin) → list from `media` collection (if tracking)
- `DELETE /media/:publicId` (admin) → delete via Cloudinary Admin API & DB

**Conventions**

- Auth protected routes: Bearer access token.
- Validation: Zod/Joi. Return 400 with details on invalid input.
- Pagination: `?page=1&limit=20`. Return `{ items, total, page, limit }`.
- Errors: structured `{ code, message, details? }`.

---

## 7) Security & RBAC

- Password hashing (bcrypt, cost ≥ 10).
- JWT short‑lived access (≈15m) + long‑lived refresh (≈7d).
- Roles: **superadmin** (all), **editor** (content CRUD), **viewer** (read-only in admin).
- Rate limiting on public POST endpoints (`/contact`).
- CORS: allow **only** `https://www.dimondcastle.com` and `https://admin.dimondcastle.com` to call the API.
- Helmet on Express; secure cookies for refresh where applicable; HSTS enabled at edge.
- Input sanitization against XSS/HTML injection in blog/content editors.
- Enforce HTTPS everywhere; redirect HTTP→HTTPS.
- Separate environment variables per app; no sharing secrets across folders.
- Separate Cloudinary folders/buckets: `dimond-castle/public/*` vs `dimond-castle/admin/*`.
- Database users with least privilege: readonly role for public readers (if used), write roles only for API.
- **Segregation controls:**
  - Different origins: `www` for public, `admin` for CMS, `api` for backend.
  - Distinct hosting projects and firewalls; admin origin blocked from search engines (robots `Disallow: /`).
  - Cookies scoped to subdomain where possible; avoid sharing session state across origins.
  - CSP headers: restrict scripts, images, frames to required domains only.
  - WAF / provider firewall rules to block common attacks and admin IP allowlisting (optional).

---

## 8) SEO & Content Strategy

- **Routing & URLs:** descriptive slugs `/blog/how-to-choose-rice`.
- **Head tags:** next-seo for dynamic titles/descriptions; OG/Twitter.
- **Structured Data:** JSON‑LD for Organization, Article, Product.
- **Sitemap:** `next-sitemap` auto generation; submitted to GSC.
- **Robots.txt:** allow all, disallow admin paths (`/admin/*`).
- **Images:** alt text from CMS; WebP where possible.
- **Content cadence:** at least 2 posts/month; internal linking to services/products.

---

## 9) Performance

- **Image/Video delivery:** Cloudinary URLs with on-the-fly transformations (width/quality/format). Prefer auto-format (`f_auto`) and auto-quality (`q_auto`).
- Next.js Image component + Cloudinary loader where applicable.
- ISR/SSG for blog and static sections (revalidate on content change).
- Code splitting, route-level loading states.
- CDN caching on Vercel; cache headers for static assets.
- Lazy load below-the-fold media and carousels.

---

## 10) Accessibility (A11y)

- Semantic HTML, ARIA where needed.
- Color contrast meeting WCAG AA.
- Keyboard navigability for admin panel.
- Alt text for meaningful images.

---

## 11) Internationalization (i18n)

- Locales: `ar` (default), `en`.
- RTL support (Tailwind `dir="rtl"` on `<html>` for Arabic; logical properties in CSS).
- Content fields per locale in `siteSettings` and blog (optional bilingual posts).
- Media alt text stored per-locale where possible (Cloudinary context metadata optional).

---

## 12) Admin Panel UX

- Sidebar navigation (Dashboard, Content, Blogs, Products, Clients, Sectors, Transport, Media, Settings, Users).
- WYSIWYG editor (TipTap/Editor.js), image uploader, link pickers.
- Preview before publish; draft/published states.
- Media library with search and copy‑URL.
- Global search across entities.

---

## 13) Validation & Error Handling

- Zod schemas for all DTOs.
- Transform/strip unexpected fields.
- Surface inline form errors in admin UI.
- Server logs include request id; return human-friendly messages to admins.

---

## 14) Testing Strategy

- **Unit tests:** models, utils, validation (Vitest/Jest).
- **Integration tests:** API endpoints with supertest.
- **E2E tests:** Playwright for core public flows (load pages, submit contact form) and admin flows (login, CRUD blog).
- Coverage target ≥ 70% in backend.

---

## 15) Release Process (Manual)

- **Web (Vercel):**
  1. Run lint, typecheck, and local build (`next build`).
  2. Push to `main` or upload build via Vercel dashboard.
  3. Trigger a **manual** deployment from Vercel dashboard; verify preview; promote to production.
- **API (Render/Railway/VPS):**
  1. Run tests locally and build (`tsc`).
  2. Push to `main` or upload via provider dashboard.
  3. Redeploy service **manually** from the provider dashboard.
- **Post-deploy:** smoke test public pages, admin login, CRUD actions, and contact form.

---

## 16) Environment Variables

**Frontend (Vercel):**

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

**Admin Frontend (Vercel):**

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (unsigned preset if used)

**Backend (Express):**

- `PORT`
- `MONGODB_URI` (Atlas SRV connection string)
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_BASE_FOLDER=dimond-castle`
- `CORS_ALLOWED_ORIGINS=https://www.dimondcastle.com,https://admin.dimondcastle.com`

---

## 17) Deployment Steps (summary)

1. **MongoDB Atlas**: create project & free/paid cluster; database `dimond_castle`; create users with least privilege; add API server IP to IP access list.
2. **Cloudinary**: create account; set root folder `dimond-castle/` with subfolders `public/` and `admin/`; configure upload presets (signed or unsigned) and transformations.
3. **Express API**: deploy to Render/Railway/VPS with env vars; enable Helmet, CORS, rate limits.
4. **Public Web (Next.js)**: deploy to Vercel; set env: API base URL, Cloudinary cloud name; configure domain `www.dimondcastle.com`.
5. **Admin Web (Next.js)**: deploy to Vercel; set env: API base URL, Cloudinary vars; domain `admin.dimondcastle.com`.
6. **Domain/DNS**: point A/ALIAS/CNAME records to providers; ensure HTTPS (automatic via providers).
7. **GSC**: submit `sitemap.xml`; verify domain via DNS TXT; monitor coverage.

---

## 18) Content Editing Workflow

- Draft → Preview → Review → Publish.
- When media is needed: Admin requests **signed upload** from `/media/signature` → uploads **directly** to Cloudinary → saves returned `public_id`/`secure_url` into the CMS entity.
- Change log (who/when) stored in admin activity log (optional table `auditLogs`).
- Revalidate pages via webhook or on publish.

---

## 19) Contact Form Handling

- Frontend POST `/contact` → save to `contacts` collection.
- Optional email notification using Nodemailer.
- Admin can update status: new → in_progress → closed.
- Rate limit (e.g., 5/min per IP) + captcha (turnstile/reCAPTCHA).

---

## 20) Example Config Snippets

**next-sitemap.config.js**

```jsx
module.exports = {
  siteUrl: "https://www.dimondcastle.com",
  generateRobotsTxt: true,
  exclude: ["/admin/*"],
};
```

**robots.txt (generated)**

```
User-agent: *
Disallow: /admin/
Sitemap: https://www.dimondcastle.com/sitemap.xml

```

**JSON-LD Organization (Next.js head)**

```tsx
const org = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dimond Castle",
  url: "https://www.dimondcastle.com",
  logo: "https://res.cloudinary.com/<cloud>/image/upload/v123/dimond-castle/logo.png",
};
```

---

## 21) Roadmap & Milestones

- **M1 – Design System & Layouts (1–2 weeks):** global styles, components, RTL support, key pages.
- **M2 – CMS API & Admin (2 weeks):** auth, CRUD for all entities, media uploads.
- **M3 – SEO & Content (1 week):** next-sitemap, structured data, initial blog posts.
- **M4 – QA & Launch (1 week):** tests, perf pass, analytics, GSC submission.

---

## 22) Acceptance Criteria (DoD)

- Public site loads < 2.5s on 4G; Lighthouse ≥ 90 (Performance/SEO/Best Practices/A11y).
- All public pages are CMS-driven (no hardcoded text/images).
- Admin panel: successful CRUD for blogs, products, clients, sectors, transport, site settings, media.
- Contact form stores entries and sends notification (if enabled).
- Sitemap and robots generated; site verified in GSC; GA4 receiving events.
- Basic E2E tests pass locally before deployment.

---

## 23) Backup, Monitoring & Logs

- MongoDB daily snapshots (Atlas automated backups).
- Export JSON dump monthly (cron) to object storage (optional).
- API logs via pino/winston; error alerts via Slack/Email.
- Uptime monitoring (UptimeRobot/Grafana Cloud).

---

## 24) Risks & Mitigations

- **Content delays:** Prepare placeholder copy; parallelize with design.
- **Image quality:** Enforce minimum resolution; use Cloudinary transformations.
- **SEO ramp-up:** Maintain steady blog cadence; internal linking; submit sitemaps on updates.

---

### Appendix A — UI Component Inventory (web)

- Header (sticky), Nav, Locale switch (ar/en)
- Hero, Section headings, Grid cards (values, sectors, products)
- Logo wall (VIP clients), Testimonial slider
- Blog list, Blog card, Blog detail (TOC, share)
- Contact form, Map embed, Footer

### Appendix B — Admin Component Inventory

- Sidebar, Topbar, Breadcrumbs, Data tables (with filters/pagination)
- Forms (Zod + React Hook Form), Rich text editor, Image/video uploader (Cloudinary), Link pickers
- Media library (grid + details), Role management, Activity log

### Appendix C — Cloudinary Quick Guide

- **Folders:** `dimond-castle/public/*` for site assets, `dimond-castle/admin/*` for CMS media.
- **Signed upload flow:** Admin requests signature → uploads with `timestamp`, `folder`, `public_id` → store `public_id` and `secure_url` in DB.
- **Delivery URL examples:**
  - Image: `https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_1200/<public_id>.jpg`
  - Video: `https://res.cloudinary.com/<cloud>/video/upload/f_auto,q_auto,w_1280/<public_id>.mp4`
- **Common transforms:** `f_auto,q_auto,w_<width>,c_fill,ar_16:9,dpr_auto`
- **Alt text:** store per-locale in DB; optionally use Cloudinary `context` metadata.

### Appendix D — MongoDB Atlas Notes

- Prefer SRV connection string (`mongodb+srv://`).
- Create separate DB users for dev/staging/prod; rotate passwords.
- Use **compound indexes** for common queries (e.g., `status+publishedAt`).
- Backups: Atlas automated snapshots; optional manual monthly JSON export.
- IP allowlist: production API hosts only (no `0.0.0.0/0`).
