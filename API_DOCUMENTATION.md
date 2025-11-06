# Dimond Castle API Documentation

**Base URL:** `http://localhost:4000` (development)  
**Version:** 1.0.0  
**Last Updated:** November 6, 2025

---

## Table of Contents

1. [Authentication](#authentication)
2. [Blog Endpoints](#blog-endpoints)
3. [Page Endpoints](#page-endpoints)
4. [Media Endpoints](#media-endpoints)
5. [Error Handling](#error-handling)
6. [Data Models](#data-models)
7. [Examples](#examples)

---

## Authentication

**Current Status:** No authentication required (v1.0.0)

Future versions will implement JWT-based authentication.

---

## Blog Endpoints

### List All Blogs

**GET** `/api/blogs`

Retrieve a list of blog posts with optional filtering and pagination.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status: `draft` or `published` |
| `limit` | number | No | Number of results per page (default: 50) |
| `page` | number | No | Page number (default: 1) |
| `search` | string | No | Search in title or excerpt |

**Example Request:**
```bash
GET /api/blogs?status=published&limit=10&page=1
```

**Example Response:**
```json
{
  "items": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "slug": "my-first-post",
      "status": "published",
      "coverPublicId": "dimond-castle/blog/cover-image",
      "tags": ["rice", "premium"],
      "author": "John Doe",
      "publishAt": "2025-11-06T10:00:00.000Z",
      "en": {
        "title": "My First Post",
        "excerpt": "This is a great post about rice.",
        "blocks": [...],
        "seo": {
          "title": "My First Post - Dimond Castle",
          "description": "Learn about premium rice"
        }
      },
      "ar": {
        "title": "مقالتي الأولى",
        "excerpt": "هذه مقالة رائعة عن الأرز.",
        "blocks": [...],
        "seo": {
          "title": "مقالتي الأولى - قلعة الألماس",
          "description": "تعرف على الأرز الفاخر"
        }
      },
      "createdAt": "2025-11-06T09:00:00.000Z",
      "updatedAt": "2025-11-06T10:30:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### Get Blog by ID

**GET** `/api/blogs/:id`

Retrieve a single blog post by its MongoDB ObjectId.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | MongoDB ObjectId |

**Example Request:**
```bash
GET /api/blogs/507f1f77bcf86cd799439011
```

**Example Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "slug": "my-first-post",
  "status": "published",
  ...
}
```

**Error Response (404):**
```json
{
  "error": "Blog not found"
}
```

---

### Get Blog by Slug

**GET** `/api/blogs/slug/:slug`

Retrieve a single blog post by its URL-friendly slug.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `slug` | string | Yes | URL-friendly slug |

**Example Request:**
```bash
GET /api/blogs/slug/my-first-post
```

**Example Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "slug": "my-first-post",
  ...
}
```

---

### Create Blog

**POST** `/api/blogs`

Create a new blog post.

**Request Body:**

```json
{
  "slug": "my-new-post",
  "status": "draft",
  "coverPublicId": "dimond-castle/blog/cover",
  "tags": ["rice", "premium"],
  "author": "John Doe",
  "publishAt": "2025-11-06T10:00:00.000Z",
  "en": {
    "title": "My New Post",
    "excerpt": "A great post",
    "blocks": [
      {
        "type": "heading",
        "level": 2,
        "text": "Introduction"
      },
      {
        "type": "paragraph",
        "text": "This is the first paragraph."
      },
      {
        "type": "image",
        "publicId": "dimond-castle/blog/image1",
        "alt": "Rice field",
        "caption": "Beautiful rice field"
      }
    ],
    "seo": {
      "title": "My New Post - Dimond Castle",
      "description": "Learn about rice"
    }
  },
  "ar": {
    "title": "مقالتي الجديدة",
    "excerpt": "مقالة رائعة",
    "blocks": [...],
    "seo": {...}
  }
}
```

**Validation Rules:**

- `slug`: Required, must match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`
- `status`: Optional, must be `draft` or `published` (default: `draft`)
- `en.title`: Required (can be empty string for drafts)
- `ar.title`: Required (can be empty string for drafts)
- `en.blocks`: Optional, array of block objects
- `ar.blocks`: Optional, array of block objects

**Example Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "slug": "my-new-post",
  ...
}
```

**Error Response (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["slug"],
      "message": "Invalid slug format"
    }
  ]
}
```

---

### Update Blog

**PUT** `/api/blogs/:id`

Update an existing blog post.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | MongoDB ObjectId |

**Request Body:**

Same as Create Blog, but all fields are optional. Only provided fields will be updated.

**Example Request:**
```bash
PUT /api/blogs/507f1f77bcf86cd799439011
```

```json
{
  "status": "published",
  "en": {
    "title": "Updated Title"
  }
}
```

**Example Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "slug": "my-first-post",
  "status": "published",
  "en": {
    "title": "Updated Title",
    ...
  },
  ...
}
```

---

### Delete Blog

**DELETE** `/api/blogs/:id`

Delete a blog post permanently.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | MongoDB ObjectId |

**Example Request:**
```bash
DELETE /api/blogs/507f1f77bcf86cd799439011
```

**Example Response (200 OK):**
```json
{
  "message": "Blog deleted successfully"
}
```

---

## Page Endpoints

### List All Pages

**GET** `/api/pages`

Retrieve a list of pages with optional filtering and pagination.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | No | Filter by status: `draft` or `published` |
| `limit` | number | No | Number of results per page (default: 50) |
| `page` | number | No | Page number (default: 1) |

**Example Request:**
```bash
GET /api/pages?status=published
```

**Example Response:**
```json
{
  "items": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "slug": "about-us",
      "status": "published",
      "template": "default",
      "en": {
        "title": "About Us",
        "seo": {
          "title": "About Us - Dimond Castle",
          "description": "Learn about our company",
          "ogImageId": "dimond-castle/pages/about-og"
        }
      },
      "ar": {
        "title": "من نحن",
        "seo": {...}
      },
      "sections": [
        {
          "key": "hero",
          "en": {
            "heading": "Welcome to Dimond Castle",
            "subheading": "Premium rice since 2015",
            "bgPublicId": "dimond-castle/pages/hero-bg",
            "ctaLabel": "Learn More",
            "ctaLink": "#story",
            "align": "center",
            "overlay": true
          },
          "ar": {...}
        }
      ],
      "createdAt": "2025-11-06T09:00:00.000Z",
      "updatedAt": "2025-11-06T10:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 50
}
```

---

### Get Page by ID

**GET** `/api/pages/:id`

Retrieve a single page by its MongoDB ObjectId.

**Example Request:**
```bash
GET /api/pages/507f1f77bcf86cd799439013
```

---

### Get Page by Slug

**GET** `/api/pages/slug/:slug`

Retrieve a single page by its URL-friendly slug.

**Example Request:**
```bash
GET /api/pages/slug/about-us
```

---

### Create Page

**POST** `/api/pages`

Create a new page.

**Request Body:**

```json
{
  "slug": "services",
  "status": "draft",
  "template": "default",
  "en": {
    "title": "Our Services",
    "seo": {
      "title": "Services - Dimond Castle",
      "description": "Explore our services",
      "ogImageId": "dimond-castle/pages/services-og"
    }
  },
  "ar": {
    "title": "خدماتنا",
    "seo": {...}
  },
  "sections": [
    {
      "key": "hero",
      "en": {
        "heading": "Our Services",
        "subheading": "Premium rice distribution",
        "bgPublicId": "dimond-castle/pages/services-hero"
      },
      "ar": {...}
    },
    {
      "key": "services",
      "en": {
        "title": "What We Offer",
        "description": "Comprehensive rice solutions",
        "items": [
          {
            "name": "Wholesale",
            "text": "Bulk rice distribution",
            "imagePublicId": "dimond-castle/pages/wholesale"
          }
        ]
      },
      "ar": {...}
    }
  ]
}
```

**Example Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "slug": "services",
  ...
}
```

---

### Update Page

**PUT** `/api/pages/:id`

Update an existing page.

**Example Request:**
```bash
PUT /api/pages/507f1f77bcf86cd799439013
```

```json
{
  "status": "published"
}
```

---

### Delete Page

**DELETE** `/api/pages/:id`

Delete a page permanently.

**Example Request:**
```bash
DELETE /api/pages/507f1f77bcf86cd799439013
```

---

## Media Endpoints

### Get Upload Signature

**POST** `/api/media/signature`

Generate a signed upload signature for Cloudinary.

**Request Body:**

```json
{
  "folder": "dimond-castle/blog",
  "resource_type": "image"
}
```

**Example Response:**
```json
{
  "timestamp": 1699272000,
  "signature": "a1b2c3d4e5f6...",
  "apiKey": "123456789012345",
  "cloudName": "your-cloud-name",
  "folder": "dimond-castle/blog",
  "resource_type": "image"
}
```

**Usage:**

Use this signature to upload files directly to Cloudinary:

```javascript
const formData = new FormData();
formData.append('file', file);
formData.append('api_key', signature.apiKey);
formData.append('timestamp', signature.timestamp);
formData.append('signature', signature.signature);
formData.append('folder', signature.folder);

const response = await fetch(
  `https://api.cloudinary.com/v1_1/${signature.cloudName}/${signature.resource_type}/upload`,
  { method: 'POST', body: formData }
);
```

---

### List Media

**GET** `/api/media`

List media assets from Cloudinary.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | No | Search query (public_id, tags, context) |
| `type` | string | No | Filter by type: `all`, `image`, or `video` |
| `page` | number | No | Page number (default: 1) |
| `max_results` | number | No | Results per page (default: 30, max: 100) |
| `folder` | string | No | Filter by folder |

**Example Request:**
```bash
GET /api/media?type=image&max_results=20&folder=dimond-castle/blog
```

**Example Response:**
```json
{
  "items": [
    {
      "asset_id": "abc123...",
      "public_id": "dimond-castle/blog/rice-field",
      "resource_type": "image",
      "format": "jpg",
      "bytes": 245678,
      "width": 1920,
      "height": 1080,
      "created_at": "2025-11-06T10:00:00Z",
      "url": "http://res.cloudinary.com/.../image.jpg",
      "secure_url": "https://res.cloudinary.com/.../image.jpg",
      "context": {
        "custom": {
          "alt": "Beautiful rice field",
          "caption": "Premium rice growing"
        }
      },
      "tags": ["rice", "field", "nature"]
    }
  ],
  "total_count": 45,
  "next_cursor": "abc123..."
}
```

---

### Check Media Usage

**GET** `/api/media/usage`

Check where a media asset is being used.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `publicId` | string | Yes | Cloudinary public_id |

**Example Request:**
```bash
GET /api/media/usage?publicId=dimond-castle/blog/rice-field
```

**Example Response:**
```json
{
  "blog": {
    "coverCount": 1,
    "blocksCount": 2,
    "total": 3,
    "posts": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "slug": "my-first-post",
        "en": {
          "title": "My First Post"
        }
      }
    ]
  },
  "pages": {
    "total": 0
  }
}
```

---

### Delete Media

**DELETE** `/api/media/:publicId`

Delete a media asset from Cloudinary.

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `publicId` | string | Yes | Cloudinary public_id (URL-encoded) |

**Example Request:**
```bash
DELETE /api/media/dimond-castle%2Fblog%2Frice-field
```

**Example Response:**
```json
{
  "result": "ok"
}
```

**Note:** This endpoint attempts to delete as image first, then as video if not found.

---

## Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "error": "Error message",
  "details": [] // Optional, for validation errors
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 500 | Internal Server Error |

### Common Errors

**Validation Error (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["en", "title"],
      "message": "Required"
    }
  ]
}
```

**Not Found (404):**
```json
{
  "error": "Blog not found"
}
```

**Server Error (500):**
```json
{
  "error": "Internal Server Error"
}
```

---

## Data Models

### Block Types

#### Heading Block
```json
{
  "type": "heading",
  "level": 2,
  "text": "Section Title"
}
```

#### Paragraph Block
```json
{
  "type": "paragraph",
  "text": "This is a paragraph of text."
}
```

#### Image Block
```json
{
  "type": "image",
  "publicId": "dimond-castle/blog/image",
  "alt": "Image description",
  "caption": "Image caption"
}
```

#### Video Block
```json
{
  "type": "video",
  "publicId": "dimond-castle/blog/video",
  "caption": "Video caption",
  "posterId": "dimond-castle/blog/poster"
}
```

#### Link Block
```json
{
  "type": "link",
  "label": "Click here",
  "url": "https://example.com"
}
```

#### List Block
```json
{
  "type": "list",
  "ordered": false,
  "items": ["Item 1", "Item 2", "Item 3"]
}
```

#### Quote Block
```json
{
  "type": "quote",
  "text": "This is a quote",
  "cite": "Author Name"
}
```

#### Divider Block
```json
{
  "type": "divider"
}
```

---

### Section Types

#### Hero Section
```json
{
  "key": "hero",
  "en": {
    "heading": "Welcome",
    "subheading": "Subtitle text",
    "bgPublicId": "dimond-castle/pages/hero-bg",
    "ctaLabel": "Learn More",
    "ctaLink": "#story",
    "align": "center",
    "overlay": true
  },
  "ar": {...}
}
```

#### Introduction & Story Section
```json
{
  "key": "introStory",
  "en": {
    "title": "Our Story",
    "text": "Long text about the company...",
    "imagePublicId": "dimond-castle/pages/story-image"
  },
  "ar": {...}
}
```

#### VIP Clients Section
```json
{
  "key": "vipClients",
  "en": {
    "title": "Our Clients",
    "subtitle": "Trusted by the best",
    "logos": [
      "dimond-castle/clients/logo1",
      "dimond-castle/clients/logo2"
    ]
  },
  "ar": {...}
}
```

#### Sectors Section
```json
{
  "key": "sectors",
  "en": {
    "title": "Sectors We Serve",
    "items": [
      {
        "name": "Retail",
        "description": "Supermarkets and stores"
      }
    ]
  },
  "ar": {...}
}
```

#### Services & Products Section
```json
{
  "key": "services",
  "en": {
    "title": "Our Services",
    "description": "What we offer",
    "items": [
      {
        "name": "Wholesale",
        "text": "Bulk distribution",
        "imagePublicId": "dimond-castle/services/wholesale"
      }
    ]
  },
  "ar": {...}
}
```

#### Transport Solutions Section
```json
{
  "key": "transportSteps",
  "en": {
    "title": "How We Deliver",
    "items": [
      {
        "step": 1,
        "title": "Order",
        "description": "Place your order",
        "mediaPublicId": "dimond-castle/transport/step1"
      }
    ]
  },
  "ar": {...}
}
```

#### Contact Section
```json
{
  "key": "contact",
  "en": {
    "title": "Contact Us",
    "subtitle": "Get in touch",
    "buttonLabel": "Send Message",
    "buttonLink": "#contact-form",
    "mapEmbedUrl": "https://maps.google.com/..."
  },
  "ar": {...}
}
```

#### Rich Text Section
```json
{
  "key": "richText",
  "en": {
    "blocks": [
      // Same block types as blog posts
    ]
  },
  "ar": {...}
}
```

---

## Examples

### Complete Blog Post Creation

```javascript
const blogPost = {
  slug: "premium-rice-guide",
  status: "published",
  coverPublicId: "dimond-castle/blog/premium-rice-cover",
  tags: ["rice", "guide", "premium"],
  author: "Dimond Castle Team",
  publishAt: new Date().toISOString(),
  en: {
    title: "The Ultimate Guide to Premium Rice",
    excerpt: "Learn everything about selecting and cooking premium rice.",
    blocks: [
      {
        type: "heading",
        level: 2,
        text: "Introduction"
      },
      {
        type: "paragraph",
        text: "Premium rice is more than just a grain..."
      },
      {
        type: "image",
        publicId: "dimond-castle/blog/rice-varieties",
        alt: "Different types of premium rice",
        caption: "Various premium rice varieties"
      },
      {
        type: "heading",
        level: 2,
        text: "How to Cook"
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Rinse the rice thoroughly",
          "Soak for 30 minutes",
          "Cook with proper water ratio",
          "Let it rest before serving"
        ]
      },
      {
        type: "quote",
        text: "The quality of rice determines the quality of the meal.",
        cite: "Chef Ahmad"
      },
      {
        type: "divider"
      },
      {
        type: "link",
        label: "Shop Premium Rice",
        url: "https://dimondcastle.com/products"
      }
    ],
    seo: {
      title: "The Ultimate Guide to Premium Rice - Dimond Castle",
      description: "Learn everything about selecting, cooking, and enjoying premium rice from Dimond Castle."
    }
  },
  ar: {
    title: "الدليل الشامل للأرز الفاخر",
    excerpt: "تعلم كل شيء عن اختيار وطهي الأرز الفاخر.",
    blocks: [...], // Arabic version
    seo: {
      title: "الدليل الشامل للأرز الفاخر - قلعة الألماس",
      description: "تعلم كل شيء عن اختيار وطهي والاستمتاع بالأرز الفاخر من قلعة الألماس."
    }
  }
};

// Create the blog post
const response = await fetch('http://localhost:4000/api/blogs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(blogPost)
});

const result = await response.json();
console.log('Created blog:', result);
```

---

### Upload Media with Progress

```javascript
// 1. Get upload signature
const sigResponse = await fetch('http://localhost:4000/api/media/signature', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    folder: 'dimond-castle/blog',
    resource_type: 'image'
  })
});

const sig = await sigResponse.json();

// 2. Upload to Cloudinary
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('api_key', sig.apiKey);
formData.append('timestamp', sig.timestamp);
formData.append('signature', sig.signature);
formData.append('folder', sig.folder);

const xhr = new XMLHttpRequest();

xhr.upload.addEventListener('progress', (e) => {
  if (e.lengthComputable) {
    const progress = (e.loaded / e.total) * 100;
    console.log(`Upload progress: ${progress}%`);
  }
});

xhr.addEventListener('load', () => {
  if (xhr.status === 200) {
    const result = JSON.parse(xhr.responseText);
    console.log('Uploaded:', result.public_id);
  }
});

xhr.open('POST', `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`);
xhr.send(formData);
```

---

### Fetch and Display Blog Posts

```javascript
// Fetch published blogs
const response = await fetch('http://localhost:4000/api/blogs?status=published&limit=10');
const data = await response.json();

// Display in UI
data.items.forEach(post => {
  const language = 'en'; // or 'ar'
  const content = post[language];
  
  console.log(`Title: ${content.title}`);
  console.log(`Excerpt: ${content.excerpt}`);
  console.log(`Cover: ${post.coverPublicId}`);
  console.log(`URL: /blog/${post.slug}`);
});
```

---

## Rate Limiting

The API implements rate limiting:

- **Window:** 1 minute
- **Max Requests:** 300 per IP address

If you exceed the limit, you'll receive a `429 Too Many Requests` response.

---

## CORS Configuration

The API allows requests from origins specified in the `CLIENT_ORIGIN` environment variable.

**Default (Development):**
- `http://localhost:3000` (Admin Panel)
- `http://localhost:3001` (Main Website)

**Production:**
Configure `CLIENT_ORIGIN` with your production domains:
```env
CLIENT_ORIGIN=https://admin.dimondcastle.com,https://dimondcastle.com
```

---

## Changelog

### Version 1.0.0 (2025-11-06)
- Initial release
- Blog CRUD endpoints
- Page CRUD endpoints
- Media management endpoints
- Cloudinary integration
- Bilingual support (EN/AR)
- Block-based content editor
- Section-based page builder

---

**For more information, see:**
- [Setup Guide](SETUP_GUIDE.md)
- [Project Status](PROJECT_STATUS.md)
- [Quick Reference](QUICK_REFERENCE.md)

