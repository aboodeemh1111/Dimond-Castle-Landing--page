# 🚀 Quick Start - Product Management System

Get your product management system up and running in 5 minutes!

## Step 1: Start the API (Terminal 1)

```bash
cd dimond-castle-api
npm install  # Only needed first time
npm run dev
```

✅ API running at `http://localhost:4000`

## Step 2: Seed Products (Terminal 2)

```bash
cd dimond-castle-api
npm run seed:products
```

✅ 6 products created in database

## Step 3: Start Admin Panel (Terminal 3)

```bash
cd dimond-castle-admin-v2
npm install  # Only needed first time
npm run dev
```

✅ Admin panel running at `http://localhost:3000`

## Step 4: Start Website (Terminal 4)

```bash
cd dimond-castle-web
npm install  # Only needed first time
npm run dev
```

✅ Website running at `http://localhost:3001`

## 🎯 Test It Out!

### View Products in Admin
1. Open `http://localhost:3000/admin/products`
2. You should see 6 products listed
3. Click "Edit" on any product to see the advanced editor

### View Products on Website
1. Open `http://localhost:3001`
2. Scroll to the Products section
3. Products should load from the API
4. Click "Learn More" on any product to see its dedicated page

### Create a New Product
1. Go to `http://localhost:3000/admin/products`
2. Click "Add Product"
3. Fill in:
   - English Name: "Test Product"
   - Arabic Name: "منتج تجريبي"
   - Click "Generate" for slug
4. Click "Create Product"
5. Edit the product to add images, pricing, etc.
6. Click "Publish"
7. Check the website - your product should appear!

## 🔧 Environment Setup

Make sure you have these `.env` files:

### dimond-castle-api/.env
```env
MONGODB_URI=mongodb://localhost:27017/dimond-castle
# Or your MongoDB Atlas connection string

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### dimond-castle-admin-v2/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### dimond-castle-web/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## ❓ Troubleshooting

### "Cannot connect to MongoDB"
- Make sure MongoDB is running locally, or
- Use MongoDB Atlas and update `MONGODB_URI`

### "Products not showing on website"
- Check API is running on port 4000
- Verify products are published (not draft)
- Check browser console for errors

### "Images not loading"
- Verify Cloudinary credentials
- Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set
- Upload images through the admin panel

## 🎉 You're All Set!

Your product management system is ready. Check `PRODUCTS_SETUP.md` for detailed documentation.

### What You Can Do Now:
- ✅ Create products with bilingual content
- ✅ Upload product images
- ✅ Set pricing and inventory
- ✅ Use the page builder for custom layouts
- ✅ Publish products to the website
- ✅ Track product views
- ✅ Manage categories and tags
- ✅ Feature products on homepage
- ✅ SEO optimization per product

Happy product managing! 🎊

