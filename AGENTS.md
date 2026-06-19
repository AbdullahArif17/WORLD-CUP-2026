# Project Anchor

## Tech Stack
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- ESLint
- PostCSS

## Directory Structure
- `app/` — Next.js App Router pages and layouts
- `components/` — Reusable UI components
- `lib/` — Utility functions, shared logic, API clients
- `.cursor/` — Cursor editor configuration and custom skills

## Conventions
- Use functional components with TypeScript
- Prefer Server Components by default; add `'use client'` only when needed
- Tailwind for all styling — no CSS modules or styled-components
- Colocate tests, stories, and related files with their component

## Entry Points
- `app/layout.tsx` — root layout
- `app/page.tsx` — home page
