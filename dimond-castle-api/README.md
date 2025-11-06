# Dimond Castle API

Express + TypeScript API for Blogs and Pages (MongoDB Atlas).

## Setup

1) Copy environment file:

```
cp .env.example .env
```

2) Edit `.env`:

```
NODE_ENV=development
PORT=4000
MONGODB_URI=YOUR_MONGODB_ATLAS_URI
CLIENT_ORIGIN=http://localhost:3000
```

3) Install deps and run:

```
npm install
npm run dev
```

API at `http://localhost:4000`

## Endpoints (brief)

- GET /api/health

Blogs
- GET /api/blogs?q=&status=&page=&limit=
- GET /api/blogs/:id
- GET /api/blogs/slug/:slug
- POST /api/blogs
- PUT /api/blogs/:id
- DELETE /api/blogs/:id

Pages
- GET /api/pages?q=&status=&page=&limit=
- GET /api/pages/:id
- GET /api/pages/slug?slug=/transport-solutions
- POST /api/pages
- PUT /api/pages/:id
- DELETE /api/pages/:id

Validation uses Zod; payloads mirror the admin frontend data shapes.

