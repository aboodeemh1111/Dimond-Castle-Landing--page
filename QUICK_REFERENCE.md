# Dimond Castle - Quick Reference

## 🚀 Quick Start Commands

### Start All Services (3 separate terminals)

**Terminal 1 - API:**
```bash
cd dimond-castle-api
npm run dev
# Runs on http://localhost:4000
```

**Terminal 2 - Admin Panel:**
```bash
cd dimond-castle-admin-v2
npm run dev
# Runs on http://localhost:3000
```

**Terminal 3 - Main Website:**
```bash
cd dimond-castle-web
npm run dev
# Runs on http://localhost:3001
```

---

## 🔑 Environment Variables

### API (.env)
```env
MONGODB_URI=mongodb+srv://...
PORT=4000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000,http://localhost:3001
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

### Admin Panel (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Main Website (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

---

## 📍 Important URLs

| Service | URL | Description |
|---------|-----|-------------|
| API Health | http://localhost:4000/api/health | Check if API is running |
| Admin Login | http://localhost:3000/admin | Admin dashboard |
| Admin Blogs | http://localhost:3000/admin/blogs | Blog management |
| Admin Pages | http://localhost:3000/admin/pages | Page management |
| Admin Media | http://localhost:3000/admin/media | Media library |
| Main Website | http://localhost:3001 | Public website |
| Blog Listing | http://localhost:3001/blog | Public blog page |

---

## 🎯 Common Tasks

### Create a New Blog Post

1. Go to `http://localhost:3000/admin/blogs`
2. Click "New Post"
3. Fill in English and Arabic content
4. Add blocks (text, images, videos, etc.)
5. Upload a cover image
6. Add tags
7. Click "Publish"
8. View on `http://localhost:3001/blog`

### Upload Media

1. Go to `http://localhost:3000/admin/media`
2. Click "Upload"
3. Select files (JPG, PNG, WEBP, MP4)
4. Set folder (optional): `dimond-castle/blog` or `dimond-castle/pages`
5. Click "Start Upload"
6. Monitor progress in Upload Manager

### Use Media in Blog Post

1. In blog editor, add an Image or Video block
2. Click "Browse" button
3. Search or filter media
4. Click on desired media
5. Media public_id is automatically filled

### Create a New Page

1. Go to `http://localhost:3000/admin/pages`
2. Click "New Page"
3. Add sections (Hero, Intro, Services, etc.)
4. Fill in content for each section
5. Configure SEO fields
6. Click "Publish"

### Check Media Usage

1. Go to `http://localhost:3000/admin/media`
2. Select media items (checkbox)
3. Click "Delete selected"
4. Review usage summary before confirming

---

## 🔧 Troubleshooting

### API Won't Start
```bash
# Check if MongoDB URI is correct
# Check if port 4000 is available
# Check Cloudinary credentials
cd dimond-castle-api
npm run dev
```

### Admin Panel Can't Connect
```bash
# Verify API is running
curl http://localhost:4000/api/health

# Check .env.local has correct API URL
cat .env.local
```

### Images Not Loading
```bash
# Check Cloudinary cloud name in .env.local
# Verify public_id format (no file extensions)
# Check browser console for errors
```

---

## 📦 NPM Scripts

### Backend API
```bash
npm run dev          # Start with ts-node-dev
npm run dev:nodemon  # Start with nodemon
```

### Admin Panel & Website
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🗄️ Database Operations

### Connect to MongoDB
```bash
# Use MongoDB Compass or mongosh
mongosh "mongodb+srv://cluster.mongodb.net/dimond-castle"
```

### View Collections
```javascript
// In MongoDB shell
show collections
db.blogposts.find().pretty()
db.pages.find().pretty()
```

### Clear Test Data
```javascript
// In MongoDB shell (CAUTION: This deletes data!)
db.blogposts.deleteMany({})
db.pages.deleteMany({})
```

---

## 🎨 Styling Reference

### Tailwind Classes Used

**Colors:**
- Primary: `emerald-600`, `emerald-700`
- Dark: `emerald-950`
- Text: `slate-900`, `slate-700`, `slate-600`
- Muted: `muted-foreground`

**Spacing:**
- Small: `gap-2`, `space-y-2`
- Medium: `gap-4`, `space-y-4`
- Large: `gap-6`, `space-y-6`

**Rounded:**
- Small: `rounded-md`
- Medium: `rounded-lg`
- Large: `rounded-xl`, `rounded-2xl`
- Full: `rounded-full`

---

## 🔐 API Endpoints

### Blogs
```bash
GET    /api/blogs              # List all blogs
GET    /api/blogs/:id          # Get blog by ID
GET    /api/blogs/slug/:slug   # Get blog by slug
POST   /api/blogs              # Create blog
PUT    /api/blogs/:id          # Update blog
DELETE /api/blogs/:id          # Delete blog
```

### Pages
```bash
GET    /api/pages              # List all pages
GET    /api/pages/:id          # Get page by ID
GET    /api/pages/slug/:slug   # Get page by slug
POST   /api/pages              # Create page
PUT    /api/pages/:id          # Update page
DELETE /api/pages/:id          # Delete page
```

### Media
```bash
POST   /api/media/signature    # Get upload signature
GET    /api/media              # List media
GET    /api/media/usage        # Check usage
DELETE /api/media/:publicId    # Delete media
```

---

## 📝 Block Types

### Available in Blog Editor

1. **Heading** - H2 or H3
2. **Paragraph** - Regular text
3. **Image** - Cloudinary image with alt and caption
4. **Video** - Cloudinary video with caption
5. **Link** - CTA button with URL
6. **List** - Ordered or unordered
7. **Quote** - Blockquote with optional citation
8. **Divider** - Horizontal rule

---

## 🌐 Cloudinary Transformations

### Common Transformations
```javascript
// Auto format and quality
f_auto,q_auto

// Resize width
f_auto,q_auto,w_800

// Resize and crop
f_auto,q_auto,w_800,h_600,c_fill

// Convert to WebP
f_webp,q_auto
```

### Helper Functions
```javascript
// In code
getCloudinaryImageUrl(publicId, 'f_auto,q_auto,w_1200')
getCloudinaryVideoUrl(publicId, 'f_auto,q_auto')
```

---

## 🐛 Debug Mode

### Enable Detailed Logging

**API:**
```bash
# In dimond-castle-api/.env
NODE_ENV=development
```

**Next.js:**
```bash
# Run with debug
DEBUG=* npm run dev
```

---

## 📊 Performance Tips

### Optimize Images
- Use Cloudinary transformations
- Specify width/height
- Use f_auto for format
- Use q_auto for quality

### Optimize API Calls
- Use pagination
- Filter by status
- Limit fields in queries
- Cache responses

### Optimize Frontend
- Use Next.js Image component
- Lazy load images
- Debounce search inputs
- Use React.memo for expensive components

---

## 🔄 Git Workflow

### Recommended Branches
```bash
main          # Production
develop       # Development
feature/*     # New features
bugfix/*      # Bug fixes
hotfix/*      # Urgent fixes
```

### Common Commands
```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Merge to develop
git checkout develop
git merge feature/new-feature
```

---

## 📱 Testing on Mobile

### Local Network Testing

1. Find your local IP:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

2. Update CORS in API:
```env
CLIENT_ORIGIN=http://localhost:3000,http://192.168.1.100:3000
```

3. Access from mobile:
```
http://192.168.1.100:3001
```

---

## 🚀 Deployment Checklist

### Before Deploying

- [ ] Test all features locally
- [ ] Check for console errors
- [ ] Run production build
- [ ] Test production build locally
- [ ] Update environment variables
- [ ] Configure CORS for production domains
- [ ] Set up MongoDB Atlas IP whitelist
- [ ] Verify Cloudinary quota
- [ ] Test image/video uploads
- [ ] Test blog creation and publishing
- [ ] Test language switching
- [ ] Check mobile responsiveness
- [ ] Verify SEO meta tags

### Deployment Steps

1. **Deploy API** (Railway/Render)
   - Push code to Git
   - Connect repository
   - Set environment variables
   - Deploy

2. **Deploy Admin Panel** (Vercel)
   - Push code to Git
   - Import project
   - Set environment variables
   - Deploy

3. **Deploy Website** (Vercel)
   - Push code to Git
   - Import project
   - Set environment variables
   - Deploy

4. **Post-Deployment**
   - Test all endpoints
   - Verify CORS
   - Check logs for errors
   - Test media uploads
   - Test blog publishing
   - Monitor performance

---

## 📞 Support

For issues or questions:
1. Check this Quick Reference
2. Check SETUP_GUIDE.md
3. Check PROJECT_STATUS.md
4. Check browser console for errors
5. Check API logs for errors
6. Review MongoDB logs
7. Check Cloudinary dashboard

---

## 💡 Pro Tips

1. **Auto-save**: Blog and page editors auto-save after 800ms of inactivity
2. **Slug suggestions**: Click "Suggest" to auto-generate slug from title
3. **Media picker**: Use "Browse" button instead of typing public_ids
4. **Bulk operations**: Select multiple media items for bulk delete
5. **Usage check**: Always check usage before deleting media
6. **Preview**: Use preview to see how content looks before publishing
7. **Validation**: Publish button validates required fields automatically
8. **Language switching**: Content switches instantly without page reload
9. **Keyboard shortcuts**: Use Tab to navigate form fields quickly
10. **Upload manager**: Monitor multiple uploads simultaneously

---

**Last Updated:** November 6, 2025  
**Version:** 1.0.0

