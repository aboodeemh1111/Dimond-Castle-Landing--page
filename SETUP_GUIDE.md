# Dimond Castle - Complete Setup Guide

This guide will help you set up and run the complete Dimond Castle platform, which consists of three main applications:

1. **dimond-castle-api** - Backend API (Express + MongoDB + Cloudinary)
2. **dimond-castle-admin-v2** - Admin Panel (Next.js)
3. **dimond-castle-web** - Main Website (Next.js)

---

## Prerequisites

- **Node.js** v18+ and npm
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account (free tier works)
- Git

---

## 1. Backend API Setup (`dimond-castle-api`)

### Step 1.1: Navigate to API Directory
```bash
cd dimond-castle-api
```

### Step 1.2: Install Dependencies
```bash
npm install
```

### Step 1.3: Configure Environment Variables

Create a `.env` file in the `dimond-castle-api` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dimond-castle?retryWrites=true&w=majority

# Server Configuration
PORT=4000
NODE_ENV=development

# CORS Configuration (comma-separated origins)
CLIENT_ORIGIN=http://localhost:3000,http://localhost:3001

# Cloudinary Configuration
# Option 1: Use CLOUDINARY_URL (recommended)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# Option 2: Use individual credentials
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
```

**How to get these values:**

- **MongoDB URI**: 
  1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  2. Create a free cluster
  3. Click "Connect" → "Connect your application"
  4. Copy the connection string and replace `<password>` with your database user password

- **Cloudinary Credentials**:
  1. Go to [Cloudinary](https://cloudinary.com/)
  2. Sign up for a free account
  3. Go to Dashboard
  4. Copy your Cloud Name, API Key, and API Secret
  5. Format as: `cloudinary://API_KEY:API_SECRET@CLOUD_NAME`

### Step 1.4: Start the API Server
```bash
npm run dev
```

The API should now be running at `http://localhost:4000`

Test it by visiting: `http://localhost:4000/api/health`

---

## 2. Admin Panel Setup (`dimond-castle-admin-v2`)

### Step 2.1: Navigate to Admin Directory
```bash
cd ../dimond-castle-admin-v2
```

### Step 2.2: Install Dependencies
```bash
npm install
```

### Step 2.3: Configure Environment Variables

Create a `.env.local` file in the `dimond-castle-admin-v2` directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

Replace `your_cloud_name` with your actual Cloudinary cloud name.

### Step 2.4: Start the Admin Panel
```bash
npm run dev
```

The admin panel should now be running at `http://localhost:3000`

Visit: `http://localhost:3000/admin/blogs`

---

## 3. Main Website Setup (`dimond-castle-web`)

### Step 3.1: Navigate to Web Directory
```bash
cd ../dimond-castle-web
```

### Step 3.2: Install Dependencies
```bash
npm install
```

### Step 3.3: Configure Environment Variables

Create a `.env.local` file in the `dimond-castle-web` directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

Replace `your_cloud_name` with your actual Cloudinary cloud name.

### Step 3.4: Start the Website
```bash
npm run dev
```

The main website should now be running at `http://localhost:3001`

Visit: `http://localhost:3001`

---

## Quick Start (All Services)

You can run all three services simultaneously in separate terminal windows:

**Terminal 1 - API:**
```bash
cd dimond-castle-api
npm run dev
```

**Terminal 2 - Admin Panel:**
```bash
cd dimond-castle-admin-v2
npm run dev
```

**Terminal 3 - Main Website:**
```bash
cd dimond-castle-web
npm run dev
```

---

## Features Overview

### Admin Panel Features

#### 📝 Blog Management
- Create, edit, and delete blog posts
- Bilingual content (English & Arabic)
- Rich block editor with:
  - Headings (H2, H3)
  - Paragraphs
  - Images (Cloudinary)
  - Videos (Cloudinary)
  - Links
  - Lists (ordered/unordered)
  - Quotes
  - Dividers
- SEO fields (meta title, description)
- Cover images
- Tags and categories
- Author attribution
- Publish/draft status
- Slug management with auto-suggestions

#### 📄 Page Management
- Create dynamic pages
- Predefined sections:
  - Hero
  - Introduction & Story
  - VIP Clients
  - Sectors
  - Services & Products
  - Transport Solutions
  - Contact
  - Rich Text
- Drag-and-drop section ordering
- Bilingual content (EN/AR)
- SEO configuration per language

#### 🖼️ Media Library
- Upload images (JPG, PNG, WEBP) and videos (MP4)
- Organize media in folders
- Search and filter by type
- Bulk upload with progress tracking
- Usage tracking (shows where media is used)
- Bulk delete with usage warnings
- Copy URLs to clipboard
- Media picker modal for easy selection

### Main Website Features
- Responsive design
- Bilingual support (English/Arabic)
- Blog listing page with beautiful cards
- Individual blog post pages with rich content rendering
- Dynamic page rendering
- SEO-optimized
- Cloudinary image optimization

---

## Testing the System

### 1. Test Blog Creation

1. Go to `http://localhost:3000/admin/blogs`
2. Click "New Post"
3. Add a title in English and Arabic
4. Add some content blocks
5. Upload a cover image via the media library
6. Click "Publish"
7. Visit `http://localhost:3001/blog` to see your post

### 2. Test Media Upload

1. Go to `http://localhost:3000/admin/media`
2. Click "Upload"
3. Select multiple images/videos
4. Set a folder (e.g., `dimond-castle/blog`)
5. Click "Start Upload"
6. Watch the upload progress in the Upload Manager

### 3. Test Language Switching

1. Go to `http://localhost:3001`
2. Click the language toggle (EN/AR)
3. Navigate to the blog section
4. Verify content switches between English and Arabic

---

## Troubleshooting

### API Won't Start
- **Check MongoDB connection**: Ensure your MongoDB URI is correct and the database is accessible
- **Check port**: Make sure port 4000 is not in use by another application
- **Check Cloudinary credentials**: Verify your Cloudinary configuration is correct

### Admin Panel Can't Connect to API
- **Check API URL**: Ensure `NEXT_PUBLIC_API_URL` in `.env.local` matches your API server
- **Check CORS**: Verify `CLIENT_ORIGIN` in the API `.env` includes `http://localhost:3000`
- **Check API is running**: Visit `http://localhost:4000/api/health`

### Images Not Loading
- **Check Cloudinary cloud name**: Ensure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set correctly in both admin and web `.env.local` files
- **Check public_id format**: Cloudinary public_ids should not include file extensions
- **Check browser console**: Look for 404 errors or incorrect URLs

### Upload Fails
- **Check file size**: Cloudinary free tier has upload limits
- **Check file format**: Only JPG, PNG, WEBP, MP4 are supported
- **Check Cloudinary quota**: Verify you haven't exceeded your monthly quota
- **Check API signature endpoint**: Test `POST http://localhost:4000/api/media/signature`

---

## Production Deployment

### Backend API (Express)
- Deploy to: **Railway**, **Render**, **Heroku**, or **DigitalOcean**
- Set environment variables in your hosting platform
- Ensure MongoDB Atlas allows connections from your hosting IP
- Update `CLIENT_ORIGIN` to include your production domains

### Admin Panel & Website (Next.js)
- Deploy to: **Vercel** (recommended), **Netlify**, or **Railway**
- Set environment variables in your hosting platform
- Update `NEXT_PUBLIC_API_URL` to your production API URL
- Ensure CORS is configured correctly in the API

### Example Production Environment Variables

**API (.env):**
```env
MONGODB_URI=mongodb+srv://...
PORT=4000
NODE_ENV=production
CLIENT_ORIGIN=https://admin.dimondcastle.com,https://dimondcastle.com
CLOUDINARY_URL=cloudinary://...
```

**Admin Panel (.env.local):**
```env
NEXT_PUBLIC_API_URL=https://api.dimondcastle.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

**Main Website (.env.local):**
```env
NEXT_PUBLIC_API_BASE_URL=https://api.dimondcastle.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## API Endpoints Reference

### Blog Endpoints
- `GET /api/blogs` - List all blogs (with filters)
- `GET /api/blogs/:id` - Get blog by ID
- `GET /api/blogs/slug/:slug` - Get blog by slug
- `POST /api/blogs` - Create new blog
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

### Page Endpoints
- `GET /api/pages` - List all pages
- `GET /api/pages/:id` - Get page by ID
- `GET /api/pages/slug/:slug` - Get page by slug
- `POST /api/pages` - Create new page
- `PUT /api/pages/:id` - Update page
- `DELETE /api/pages/:id` - Delete page

### Media Endpoints
- `POST /api/media/signature` - Get upload signature
- `GET /api/media` - List media assets
- `GET /api/media/usage?publicId=...` - Check media usage
- `DELETE /api/media/:publicId` - Delete media asset

---

## Support & Contribution

For issues or questions, please refer to the project documentation or contact the development team.

---

## License

All rights reserved © Dimond Castle Trading Company

