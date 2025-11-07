# Product Management System - Setup Guide

This document provides a complete guide for the product management system that has been implemented across the Dimond Castle platform.

## 🎯 Overview

The product management system allows you to:
- ✅ Create, edit, and delete products from the admin panel
- ✅ Use an advanced page builder for each product
- ✅ Display products dynamically on the main website
- ✅ Generate unique product pages with custom URLs
- ✅ Support for bilingual content (English & Arabic)
- ✅ Full SEO capabilities for each product
- ✅ Image gallery and media management
- ✅ Inventory tracking and stock status
- ✅ Product categorization and tagging
- ✅ Featured products support

## 📁 Project Structure

### API (dimond-castle-api)
```
src/
├── models/
│   └── Product.ts              # Product database model
├── routes/
│   └── products.ts             # Product API endpoints
├── validation/
│   └── products.ts             # Zod validation schemas
└── scripts/
    └── seed-products.ts        # Database seeding script
```

### Admin Panel (dimond-castle-admin-v2)
```
src/
├── app/admin/products/
│   ├── page.tsx                # Product list page
│   ├── new/page.tsx            # Create new product
│   ├── [id]/page.tsx           # Edit product
│   └── preview/[id]/page.tsx   # Preview product
├── components/products/
│   └── ProductEditor.tsx       # Advanced product editor
├── lib/
│   └── products-api.ts         # API client functions
└── config/
    └── admin-nav.ts            # Updated with Products menu
```

### Website (dimond-castle-web)
```
app/
├── products/
│   └── [slug]/page.tsx         # Individual product pages
├── components/
│   └── Products.tsx            # Updated to fetch from API
└── lib/
    └── products-api.ts         # Public API client
```

## 🚀 Getting Started

### 1. Start the API Server

```bash
cd dimond-castle-api
npm install
npm run dev
```

The API will run on `http://localhost:4000`

### 2. Seed Initial Products

Populate the database with the existing hardcoded products:

```bash
cd dimond-castle-api
npm run seed:products
```

This will create 6 products:
- White Diamond Basmati
- White Diamond Sella
- White Diamond Jasmine
- White Diamond Premium
- White Diamond Long Grain
- White Diamond Super Kernel

### 3. Start the Admin Panel

```bash
cd dimond-castle-admin-v2
npm install
npm run dev
```

The admin panel will run on `http://localhost:3000`

### 4. Start the Website

```bash
cd dimond-castle-web
npm install
npm run dev
```

The website will run on `http://localhost:3001` (or next available port)

## 📝 Product Model Schema

Each product includes:

### Core Fields
- `slug` - URL-friendly identifier (e.g., "white-diamond-basmati")
- `status` - "draft" or "published"
- `sku` - Stock Keeping Unit (optional)
- `category` - Product category
- `tags` - Array of tags
- `featured` - Boolean for featured products
- `inStock` - Stock availability
- `stockQuantity` - Number of units in stock
- `order` - Manual ordering (lower numbers appear first)

### Pricing
- `price.amount` - Price value
- `price.currency` - Currency code (default: "USD")

### Media
- `coverPublicId` - Main product image (Cloudinary ID)
- `galleryPublicIds` - Array of gallery images

### Localized Content (English & Arabic)
- `name` - Product name
- `description` - Product description
- `origin` - Country/region of origin
- `seo.title` - SEO title
- `seo.description` - SEO description
- `seo.ogImage` - Open Graph image
- `sections` - Page builder sections (advanced)

### Metadata
- `viewCount` - Number of views
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## 🎨 Admin Panel Features

### Product List (`/admin/products`)
- View all products in a table format
- Filter by status (all, draft, published)
- Search products by name
- Quick actions: Edit, Preview, Delete
- Visual indicators for featured products and stock status

### Create Product (`/admin/products/new`)
- Simple form for basic product creation
- Bilingual input fields (English & Arabic)
- Auto-generate slug from product name
- Minimal required fields to get started quickly

### Edit Product (`/admin/products/[id]`)
- Comprehensive product editor with tabs:
  - **Product Details**: Basic info, pricing, inventory, categories, sizes, media
  - **Page Builder**: Advanced page builder for custom product pages
  - **SEO**: Meta titles, descriptions, and OG images
- Real-time save status indicator
- Language switcher (English/Arabic)
- Publish/Unpublish toggle
- Preview button
- Delete product option

### Product Editor Features
- 📝 Rich text editing for descriptions
- 🖼️ Media picker integration with Cloudinary
- 📦 Multiple size options management
- 🏷️ Tag management
- ⭐ Featured product toggle
- 📊 Stock tracking
- 🎨 Full page builder with sections, rows, and blocks
- 🌐 Bilingual content editing

## 🌐 Website Integration

### Products Section (Homepage)
The `Products.tsx` component now:
- Fetches products from the API
- Displays loading state
- Shows up to 6 products (configurable)
- Supports bilingual display
- Links to individual product pages

### Individual Product Pages (`/products/[slug]`)
Each product has its own page with:
- Hero section with product name and image
- Price display (if available)
- Origin information
- Available sizes
- Category and tags
- Stock status
- Image gallery
- Custom page builder sections (if configured)

### SEO Features
- Dynamic meta titles and descriptions
- Open Graph images
- Proper heading hierarchy
- Semantic HTML structure

## 🔌 API Endpoints

### Public Endpoints (No Authentication)
- `GET /api/products/public` - Get all published products
  - Query params: `category`, `featured`, `inStock`, `search`, `limit`, `skip`, `sort`
- `GET /api/products/public/:slug` - Get single product by slug

### Admin Endpoints (Requires Authentication)
- `GET /api/products` - Get all products (including drafts)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/bulk/reorder` - Reorder products
- `GET /api/products/meta/categories` - Get all categories

## 🎯 Common Tasks

### Adding a New Product
1. Go to `/admin/products`
2. Click "Add Product"
3. Fill in English and Arabic names
4. Generate or enter a slug
5. Click "Create Product"
6. Edit the product to add more details, images, pricing, etc.
7. Use the page builder to create custom content
8. Click "Publish" when ready

### Editing Product Order
Products are ordered by the `order` field (lower numbers first). To reorder:
1. Edit each product
2. Set the `order` field in the database or add a UI for this

### Adding Product Images
1. Edit a product
2. Go to "Product Details" tab
3. Click "Select Cover Image" or "Add Gallery Image"
4. Choose from existing media or upload new images
5. Save the product

### Creating Custom Product Pages
1. Edit a product
2. Go to "Page Builder" tab
3. Add sections, rows, and blocks
4. Configure styles and content
5. Preview to see the result
6. Save and publish

## 🔧 Configuration

### Environment Variables

**API (.env)**
```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Admin Panel (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

**Website (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## 🐛 Troubleshooting

### Products Not Showing on Website
1. Check if products are published (status: "published")
2. Verify API is running and accessible
3. Check browser console for errors
4. Verify `NEXT_PUBLIC_API_URL` is set correctly

### Images Not Loading
1. Check Cloudinary configuration
2. Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
3. Ensure images are uploaded to Cloudinary
4. Check `coverPublicId` and `galleryPublicIds` are correct

### API Errors
1. Check MongoDB connection
2. Verify all environment variables are set
3. Check API logs for detailed error messages
4. Ensure validation schemas are satisfied

## 📚 Next Steps

### Recommended Enhancements
1. **Product Variants**: Add support for color/size variants
2. **Pricing Tiers**: Multiple price points based on quantity
3. **Related Products**: Show similar products
4. **Reviews & Ratings**: Customer feedback system
5. **Inventory Alerts**: Low stock notifications
6. **Bulk Operations**: Import/export products via CSV
7. **Product Analytics**: Track views, conversions
8. **Search & Filters**: Advanced filtering on website
9. **Wishlist**: Save favorite products
10. **Compare Products**: Side-by-side comparison

## 🎉 Success!

Your product management system is now fully operational! You can:
- ✅ Manage products from the admin panel
- ✅ Display products on your website
- ✅ Create unique product pages
- ✅ Edit content in multiple languages
- ✅ Track inventory and views
- ✅ Optimize for SEO

For questions or issues, refer to the code comments or create an issue in the repository.

