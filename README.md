# 🏰 Dimond Castle - Full-Stack Content Management Platform

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-proprietary-red)

A complete, modern, and production-ready content management system built with **Next.js 15**, **Express**, **MongoDB**, and **Cloudinary**. Features a powerful admin panel, bilingual support (EN/AR), and a beautiful public website.

---

## 🌟 Features

### 🎯 Core Features
- ✅ **Full-Stack Architecture** - Separate backend API, admin panel, and public website
- ✅ **Bilingual Support** - Complete EN/AR content with RTL support
- ✅ **Modern Tech Stack** - Next.js 15, React 19, TypeScript, Tailwind CSS
- ✅ **Rich Content Editor** - Block-based editor with 8+ content types
- ✅ **Media Management** - Full-featured library with Cloudinary integration
- ✅ **SEO Optimized** - Meta tags, OG images, semantic HTML
- ✅ **Responsive Design** - Mobile-first, works on all devices
- ✅ **Production Ready** - Security, performance, error handling

### 📝 Content Management
- **Blog Posts** - Create, edit, publish with rich content
- **Dynamic Pages** - Section-based page builder
- **Media Library** - Upload, organize, search images and videos
- **Draft/Publish** - Workflow with validation
- **Auto-save** - Never lose your work
- **Preview** - See before publishing

### 🎨 Design & UX
- **Beautiful UI** - Modern design with shadcn/ui components
- **Dark Theme** - Elegant emerald color scheme
- **Smooth Animations** - Framer Motion transitions
- **Toast Notifications** - User-friendly feedback
- **Loading States** - Clear progress indicators
- **Error Handling** - Graceful error messages

---

## 📁 Project Structure

```
Dimond-Castle-Landing--page/
├── dimond-castle-api/          # Backend API (Express + MongoDB)
│   ├── src/
│   │   ├── config/             # Environment, DB, Cloudinary config
│   │   ├── models/             # Mongoose models
│   │   ├── routes/             # API routes
│   │   ├── validation/         # Zod schemas
│   │   └── index.ts            # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── dimond-castle-admin-v2/     # Admin Panel (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/
│   │   │   │   ├── blogs/      # Blog management
│   │   │   │   ├── pages/      # Page management
│   │   │   │   └── media/      # Media library
│   │   │   └── dashboard/      # Dashboard
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── blogs/          # Blog-specific components
│   │   │   ├── pages/          # Page-specific components
│   │   │   ├── media/          # Media-specific components
│   │   │   └── dashboard/      # Dashboard components
│   │   └── lib/
│   │       ├── api.ts          # API client
│   │       ├── media-api.ts    # Media API client
│   │       ├── blog-store.ts   # Blog data layer
│   │       ├── page-store.ts   # Page data layer
│   │       └── cloudinary.ts   # Cloudinary helpers
│   ├── package.json
│   └── tailwind.config.ts
│
├── dimond-castle-web/          # Main Website (Next.js)
│   ├── app/
│   │   ├── blog/               # Blog pages
│   │   ├── components/         # Shared components
│   │   └── lib/                # Utilities and API client
│   ├── package.json
│   └── tailwind.config.ts
│
├── SETUP_GUIDE.md              # Complete setup instructions
├── PROJECT_STATUS.md           # Detailed project status
├── API_DOCUMENTATION.md        # API reference
├── QUICK_REFERENCE.md          # Quick command reference
└── README.md                   # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Dimond-Castle-Landing--page
```

### 2. Setup Backend API
```bash
cd dimond-castle-api
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=your_mongodb_connection_string
PORT=4000
CLIENT_ORIGIN=http://localhost:3000,http://localhost:3001
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
EOF

npm run dev
```

### 3. Setup Admin Panel
```bash
cd ../dimond-castle-admin-v2
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EOF

npm run dev
```

### 4. Setup Main Website
```bash
cd ../dimond-castle-web
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
EOF

npm run dev
```

### 5. Access the Applications
- **API:** http://localhost:4000
- **Admin Panel:** http://localhost:3000/admin
- **Main Website:** http://localhost:3001

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Complete setup and configuration guide |
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Detailed feature list and project status |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Complete API reference |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Quick commands and tips |

---

## 🛠️ Tech Stack

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **Zod** - Validation
- **Cloudinary** - Media storage
- **Helmet** - Security
- **Morgan** - Logging
- **CORS** - Cross-origin support

### Admin Panel
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Framer Motion** - Animations
- **Sonner** - Toast notifications
- **Lucide React** - Icons

### Main Website
- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **@tailwindcss/typography** - Prose styling

---

## 🎯 Key Features in Detail

### Block-Based Content Editor

The blog editor supports 8 different block types:

1. **Heading** (H2/H3) - Section titles
2. **Paragraph** - Regular text content
3. **Image** - Cloudinary images with alt text and captions
4. **Video** - Cloudinary videos with captions
5. **Link** - CTA buttons with custom URLs
6. **List** - Ordered or unordered lists
7. **Quote** - Blockquotes with citations
8. **Divider** - Horizontal rules

Each block can be:
- ✅ Added
- ✅ Deleted
- ✅ Duplicated
- ✅ Reordered (up/down)

### Section-Based Page Builder

Create dynamic pages with predefined sections:

1. **Hero** - Full-width hero with background image
2. **Introduction & Story** - Company story with image
3. **VIP Clients** - Client logos showcase
4. **Sectors** - Services sectors list
5. **Services & Products** - Detailed service cards
6. **Transport Solutions** - Step-by-step process
7. **Contact** - Contact form and map
8. **Rich Text** - Free-form content with block editor

### Media Library

Full-featured media management:

- ✅ **Upload** - Multiple files with progress tracking
- ✅ **Search** - By public_id, tags, or caption
- ✅ **Filter** - By type (images/videos)
- ✅ **Organize** - Folder structure
- ✅ **Usage Tracking** - See where media is used
- ✅ **Bulk Operations** - Select and delete multiple
- ✅ **Copy URLs** - Quick clipboard copy
- ✅ **Media Picker** - Modal for easy selection

---

## 🔐 Security Features

- ✅ **Helmet.js** - Security headers
- ✅ **CORS** - Origin validation
- ✅ **Rate Limiting** - 300 requests/minute
- ✅ **Input Validation** - Zod schemas
- ✅ **MongoDB Injection Prevention** - Mongoose
- ✅ **Signed Uploads** - Cloudinary signatures
- ✅ **Environment Variables** - Sensitive data protection

---

## 🚀 Performance

- ✅ **Response Compression** - Gzip
- ✅ **Database Indexing** - Optimized queries
- ✅ **Image Optimization** - Cloudinary auto-format
- ✅ **Code Splitting** - Next.js automatic
- ✅ **Lazy Loading** - Images and components
- ✅ **Debounced Auto-save** - 800ms delay
- ✅ **Client-side Caching** - Optimistic updates

---

## 🌐 Internationalization

Complete bilingual support:

- ✅ **English (EN)** - Left-to-right (LTR)
- ✅ **Arabic (AR)** - Right-to-left (RTL)
- ✅ **Language Switcher** - Instant switching
- ✅ **Content Translation** - Separate EN/AR fields
- ✅ **SEO per Language** - Dedicated meta tags
- ✅ **RTL Layout** - Proper Arabic layout

---

## 📱 Responsive Design

Mobile-first approach with breakpoints:

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

Features:
- ✅ Touch-friendly UI
- ✅ Mobile drawer menu
- ✅ Responsive grids
- ✅ Adaptive typography
- ✅ Optimized images

---

## 🧪 Testing

### Manual Testing Checklist

**Backend API:**
- ✅ Health check endpoint
- ✅ Blog CRUD operations
- ✅ Page CRUD operations
- ✅ Media upload and management
- ✅ CORS configuration
- ✅ Validation

**Admin Panel:**
- ✅ Navigation and routing
- ✅ Blog editor (all features)
- ✅ Page editor (all sections)
- ✅ Media library (upload, search, delete)
- ✅ Auto-save functionality
- ✅ Mobile responsiveness

**Main Website:**
- ✅ Homepage
- ✅ Blog listing
- ✅ Individual blog posts
- ✅ Language switching
- ✅ Image/video rendering
- ✅ Mobile responsiveness

---

## 🚢 Deployment

### Recommended Hosting

**Backend API:**
- Railway (recommended)
- Render
- Heroku
- DigitalOcean

**Admin Panel & Website:**
- Vercel (recommended)
- Netlify
- Railway

### Deployment Steps

1. **Deploy Backend API**
   - Push code to Git
   - Connect to hosting platform
   - Set environment variables
   - Deploy

2. **Deploy Admin Panel**
   - Push code to Git
   - Import to Vercel
   - Set environment variables
   - Deploy

3. **Deploy Main Website**
   - Push code to Git
   - Import to Vercel
   - Set environment variables
   - Deploy

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed deployment instructions.

---

## 📊 Project Statistics

- **Total Files:** 150+
- **Lines of Code:** 15,000+
- **Components:** 50+
- **API Endpoints:** 15+
- **Supported Languages:** 2 (EN, AR)
- **Block Types:** 8
- **Page Sections:** 8
- **Media Formats:** 4 (JPG, PNG, WEBP, MP4)

---

## 🤝 Contributing

This is a proprietary project. For questions or issues, please contact the development team.

---

## 📝 License

All rights reserved © Dimond Castle Trading Company

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [Express.js](https://expressjs.com/)

---

## 📞 Support

For setup help, see:
1. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup instructions
2. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Common commands
3. [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference

---

## 🎉 Status

**✅ PRODUCTION READY**

All features are complete, tested, and ready for deployment.

---

**Last Updated:** November 6, 2025  
**Version:** 1.0.0

