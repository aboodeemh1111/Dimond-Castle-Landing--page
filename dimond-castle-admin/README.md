# Diamond Castle Admin Panel

Full-featured admin panel for managing Diamond Castle content (blogs, pages, media, etc.)

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- TipTap (rich text editor)
- Cloudinary (media management)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy `env.example` to `.env.local` and configure:

```bash
cp env.example .env.local
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Default Login (Mock API)

- Email: `admin@dimondcastle.com`
- Password: `admin123`

## Features

- Authentication with JWT tokens
- Blog management with block editor
- Media library with Cloudinary integration
- Bilingual content (EN/AR)
- Page builder (coming soon)
- Navigation editor (coming soon)
- Theme customization (coming soon)

## Project Structure

```
dimond-castle-admin/
├── app/              # Next.js app router
├── components/       # React components
├── lib/              # Utilities and API
├── types/            # TypeScript types
└── public/           # Static assets
```
