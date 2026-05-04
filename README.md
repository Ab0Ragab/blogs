# Blogs

A localized Next.js blog app with server-rendered routes and a Zustand-backed client store for blog browsing, filtering, pagination, and post detail state.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Zustand

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env` file with the blog API endpoint:

```bash
NEXT_PUBLIC_BLOG_API_URL=https://your-blog-api.example.com/posts
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Blog State Flow

The blog pages fetch initial data on the server, then pass it into client components that hydrate the Zustand store.

- `lib/blog-store.ts` defines the blog post types, filters, active post, and store actions.
- `components/blog-list.tsx` renders the filtered and paginated list from the store.
- `components/blog-filters.tsx` keeps URL search params and store filters in sync.
- `components/blog-post-detail.tsx` renders a single post and stores it as the active post.
- `app/[lang]/(main)/blog/page.tsx` fetches the initial list.
- `app/[lang]/(main)/blog/[id]/page.tsx` fetches a single post and metadata.

## Local Next.js Docs

This project uses a newer Next.js version with changed APIs. Before changing route conventions, async route props, cache APIs, or server/client component behavior, read the relevant docs in:

```text
node_modules/next/dist/docs/
```

## Verification

Before handing off changes, run:

```bash
npm run lint
npm run build
```
