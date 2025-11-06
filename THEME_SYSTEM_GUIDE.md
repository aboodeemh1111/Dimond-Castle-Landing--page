# 🎨 Theme System - Complete Guide

## Overview

The Theme System allows admins to control the entire website's visual identity from the admin panel without touching code. It manages brand colors, typography, global assets, and design tokens that are applied consistently across all pages and components.

---

## 🏗️ Architecture

### Backend (API)
- **MongoDB Model**: `dimond-castle-api/src/models/Theme.ts`
- **Validation**: `dimond-castle-api/src/validation/theme.ts`
- **Routes**: `dimond-castle-api/src/routes/theme.ts`

### Admin Panel
- **Main Page**: `/admin/theme`
- **Components**: `dimond-castle-admin-v2/src/components/theme/`
- **API Client**: `dimond-castle-admin-v2/src/lib/theme-api.ts`

### Public Site
- **Theme Provider**: `dimond-castle-web/app/components/ThemeProvider.tsx`
- **Font Loader**: `dimond-castle-web/app/components/ThemeFonts.tsx`
- **Helpers**: `dimond-castle-web/app/lib/theme-helpers.ts`
- **Themed Components**: `dimond-castle-web/app/components/themed/`

---

## 📊 Data Model

```typescript
type Theme = {
  _id: string
  brand: {
    primaryColor: string      // HEX e.g. "#2C5E47"
    secondaryColor: string    // HEX
    accentColor: string       // Gold/highlight color
    backgroundColor: string   // Site background
    surfaceColor: string      // Cards & sections
  }
  typography: {
    fontFamilyEN: string      // English font
    fontFamilyAR: string      // Arabic font
    baseFontSize: number      // 14-18px
    headingWeight: number     // 500-900
    bodyWeight: number        // 300-700
  }
  globalAssets: {
    logoLightId?: string      // Cloudinary public_id
    logoDarkId?: string
    faviconId?: string
    socialPreviewId?: string  // OG default image
  }
  designTokens: {
    borderRadius: 'none'|'sm'|'md'|'lg'|'xl'|'2xl'|'full'
    spacingScale: 'tight'|'normal'|'spacious'
    shadowLevel: 'none'|'soft'|'base'|'strong'
  }
  updatedBy?: string
  createdAt: string
  updatedAt: string
}
```

---

## 🎯 Admin Panel Usage

### Accessing the Theme Editor

1. Navigate to `/admin/theme` in the admin panel
2. You'll see four main sections:
   - **Brand Colors**
   - **Typography**
   - **Global Assets**
   - **Design Tokens**
3. A live preview panel shows changes in real-time

### Brand Colors

Configure your brand's color palette:

- **Primary Color**: Main brand color (buttons, headings, links)
- **Secondary Color**: Supporting brand color
- **Accent Color**: Highlight/gold color for CTAs
- **Background Color**: Site background
- **Surface Color**: Cards and section backgrounds

**Features:**
- HEX color input with validation
- Live color swatches
- Real-time preview

### Typography

Control all text styling:

**English Fonts:**
- Inter
- Work Sans
- Montserrat
- Roboto
- Open Sans
- Lato

**Arabic Fonts:**
- Tajawal
- Cairo
- IBM Plex Arabic
- Almarai
- Noto Sans Arabic

**Controls:**
- Base font size slider (14-18px)
- Heading weight (500-900)
- Body weight (300-700)

### Global Assets

Upload brand assets via Cloudinary:

- **Light Logo**: Primary logo
- **Dark Logo**: Optional dark theme logo
- **Favicon**: Browser tab icon
- **Social Preview**: Default OpenGraph image

**Features:**
- Media picker integration
- Browse or paste Cloudinary ID
- Optional fields (site works without them)

### Design Tokens

Global style settings:

**Border Radius:**
- none (0px)
- sm (2px)
- md (6px)
- lg (8px)
- xl (12px)
- 2xl (16px)
- full (9999px)

**Spacing Scale:**
- tight: Compact spacing
- normal: Balanced spacing
- spacious: Generous spacing

**Shadow Level:**
- none: No shadows
- soft: Subtle shadows
- base: Standard shadows
- strong: Prominent shadows

### Saving & Resetting

- **Save Changes**: Applies theme globally
- **Reset to Default**: Restores system defaults with confirmation

---

## 🌐 Public Site Integration

### CSS Variables

The theme is injected as CSS variables:

```css
:root {
  /* Brand Colors */
  --color-primary: #2C5E47;
  --color-secondary: #1a3a2e;
  --color-accent: #D4AF37;
  --color-background: #FFFFFF;
  --color-surface: #F9FAFB;
  
  /* Typography */
  --font-en: Inter, system-ui, sans-serif;
  --font-ar: Tajawal, system-ui, sans-serif;
  --font-size-base: 16px;
  --font-weight-heading: 700;
  --font-weight-body: 400;
  
  /* Design Tokens */
  --border-radius: 0.5rem;
  --spacing-section: 4rem;
  --spacing-container: 1.5rem;
  --spacing-gap: 1.5rem;
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
```

### Using Theme in Components

#### Method 1: CSS Variables (Recommended)

```tsx
<div style={{
  backgroundColor: 'var(--color-primary)',
  borderRadius: 'var(--border-radius)',
  boxShadow: 'var(--shadow)',
  padding: 'var(--spacing-container)'
}}>
  Content
</div>
```

#### Method 2: Themed Components

```tsx
import ThemedButton from '@/app/components/themed/ThemedButton'
import ThemedCard from '@/app/components/themed/ThemedCard'
import ThemedSection from '@/app/components/themed/ThemedSection'

<ThemedSection background="surface">
  <ThemedCard padding="lg">
    <h2>Card Title</h2>
    <p>Card content</p>
    <ThemedButton variant="primary" size="lg">
      Call to Action
    </ThemedButton>
  </ThemedCard>
</ThemedSection>
```

#### Method 3: Helper Functions

```tsx
import { getThemeColor, getThemeSpacing } from '@/app/lib/theme-helpers'

<div style={{
  color: getThemeColor('primary'),
  padding: getThemeSpacing('container')
}}>
  Content
</div>
```

---

## 🔧 API Endpoints

### GET `/api/theme`
Fetch current theme (public endpoint, cached for 5 minutes)

**Response:**
```json
{
  "_id": "...",
  "brand": { ... },
  "typography": { ... },
  "globalAssets": { ... },
  "designTokens": { ... },
  "createdAt": "...",
  "updatedAt": "..."
}
```

### PUT `/api/theme`
Update theme (admin only)

**Request Body:**
```json
{
  "brand": {
    "primaryColor": "#2C5E47",
    "secondaryColor": "#1a3a2e",
    ...
  },
  ...
}
```

### POST `/api/theme/reset`
Reset theme to defaults (admin only)

---

## 🎨 Integration Examples

### Page Builder Sections

Sections automatically use theme tokens:

```tsx
<section style={{
  backgroundColor: 'var(--color-surface)',
  paddingTop: 'var(--spacing-section)',
  paddingBottom: 'var(--spacing-section)',
}}>
  <div style={{
    padding: 'var(--spacing-container)',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow)',
  }}>
    Section content
  </div>
</section>
```

### Buttons

```tsx
<button style={{
  backgroundColor: 'var(--color-primary)',
  color: 'white',
  borderRadius: 'var(--border-radius)',
  boxShadow: 'var(--shadow)',
  fontWeight: 'var(--font-weight-heading)',
}}>
  Primary Button
</button>
```

### Typography

```tsx
<h1 style={{
  fontFamily: 'var(--font-en)',
  fontWeight: 'var(--font-weight-heading)',
  color: 'var(--color-primary)',
}}>
  Heading
</h1>

<p style={{
  fontFamily: 'var(--font-en)',
  fontSize: 'var(--font-size-base)',
  fontWeight: 'var(--font-weight-body)',
}}>
  Body text
</p>
```

### RTL Support

```tsx
<div dir="rtl" style={{
  fontFamily: 'var(--font-ar)',
}}>
  محتوى عربي
</div>
```

---

## 🚀 Default Theme

```typescript
{
  brand: {
    primaryColor: '#2C5E47',      // Forest green
    secondaryColor: '#1a3a2e',    // Dark green
    accentColor: '#D4AF37',       // Gold
    backgroundColor: '#FFFFFF',    // White
    surfaceColor: '#F9FAFB',      // Light gray
  },
  typography: {
    fontFamilyEN: 'Inter',
    fontFamilyAR: 'Tajawal',
    baseFontSize: 16,
    headingWeight: 700,
    bodyWeight: 400,
  },
  designTokens: {
    borderRadius: 'lg',
    spacingScale: 'normal',
    shadowLevel: 'base',
  }
}
```

---

## 📦 Installation

### Admin Panel Dependencies

```bash
cd dimond-castle-admin-v2
npm install @radix-ui/react-slider @radix-ui/react-radio-group --legacy-peer-deps
```

### No Additional Dependencies for Public Site

The public site uses only CSS variables and doesn't require additional packages.

---

## ✅ Features

- ✅ **Brand Colors**: 5 customizable colors with HEX validation
- ✅ **Typography**: Safe font lists for EN/AR with weight controls
- ✅ **Global Assets**: Cloudinary integration for logos & images
- ✅ **Design Tokens**: Border radius, spacing, shadows
- ✅ **Live Preview**: Real-time visual feedback
- ✅ **Reset to Defaults**: One-click restore
- ✅ **CSS Variables**: Automatic injection into public site
- ✅ **Font Loading**: Google Fonts integration
- ✅ **Themed Components**: Pre-built components using theme
- ✅ **Helper Functions**: Easy theme access in code
- ✅ **RTL Support**: Arabic font handling
- ✅ **Caching**: 5-minute cache for performance
- ✅ **Validation**: Zod schemas for data integrity
- ✅ **Type Safety**: Full TypeScript support

---

## 🎯 Use Cases

### Seasonal Branding
Change colors and assets for holidays or special events without developer intervention.

### Client Rebranding
Update entire site identity (colors, fonts, logos) from one place.

### A/B Testing
Test different color schemes or typography settings.

### Multi-Brand Sites
Switch between brand identities for different markets.

### Designer Handoff
Designers can input exact color values and font choices directly.

---

## 🔒 Security

- HEX-only color validation prevents CSS injection
- Safe font lists prevent arbitrary font loading
- Cloudinary references only (no direct file uploads)
- Controlled design token options
- No arbitrary CSS or JavaScript injection possible

---

## 🎓 Best Practices

1. **Test Changes**: Use the live preview before saving
2. **Document Colors**: Keep a record of your brand colors
3. **Consistent Spacing**: Stick to one spacing scale
4. **Font Pairing**: Choose complementary EN/AR fonts
5. **Accessibility**: Ensure sufficient color contrast
6. **Logo Formats**: Use PNG with transparency for logos
7. **Favicon Size**: Use 32x32 or 64x64 for favicons
8. **Social Preview**: Use 1200x630 for OG images

---

## 🐛 Troubleshooting

### Theme Not Applying
- Check if API server is running
- Clear browser cache
- Verify theme saved successfully in admin

### Fonts Not Loading
- Ensure Google Fonts are accessible
- Check browser console for font errors
- Verify font names match exactly

### Colors Not Showing
- Validate HEX format (#RRGGBB)
- Check CSS variable names
- Inspect element to verify CSS injection

---

## 📚 Related Documentation

- [Page Builder Guide](./PAGE_BUILDER_README.md)
- [Blog System](./dimond-castle-admin-v2/README.md)
- [Media Management](./dimond-castle-api/README.md)

---

## 🎉 Summary

The Theme System provides a complete, safe, and user-friendly way to manage your website's visual identity. All changes are applied globally, ensuring consistency across pages, blogs, and components. The system is designed to be powerful for designers while remaining safe and controlled for non-technical users.

**Key Benefits:**
- 🎨 Complete brand control
- 🚀 No code required
- 🔒 Safe and secure
- ⚡ Real-time preview
- 🌍 Bilingual support
- 📱 Responsive design
- ♿ Accessibility-friendly

