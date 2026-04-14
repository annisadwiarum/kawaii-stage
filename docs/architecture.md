# Kawaii Stage - Architecture Overview

## 1. Introduction
**Kawaii Stage** is a modern web application designed for learning Japanese in a fun, brightly colored, and interactive environment. The UI leans heavily towards a Japanese "kawaii" and neon aesthetic, packed with gamification loops (XP, streaks, and badges).

## 2. Technology Stack
- **Framework**: [Next.js 15](https://nextjs.org/) (App Directory)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion (for animations and micro-interactions), and Lucide React (icons)
- **Components**: Pre-built atomic primitives from shadcn/ui and Radix UI
- **Authentication**: NextAuth.js (configured with Google OAuth via `SessionProvider`)
- **Package Manager**: Yarn

## 3. Core Modules & Features

### A. Landing Page (`src/app/page.tsx`)
The public-facing hub of the application.
- **Hero & General Sections**: Introduces the product with rich visuals (`HeroSection`, `AboutSection`, `ContactSection`, `FooterSection`).
- **Projects Section (`ProjectsSection`)**: Acts as a hub for daily rotating phrases, progress summary sneak peeks, and teasing upcoming features like the Mini Game Arcade.
- **Welcome Modal**: A personalized greeting modal built with Framer Motion, triggered when an authenticated user enters certain gateways.

### B. Micro Lessons (`src/app/lessons/`)
A guided, step-by-step interactive learning flow.
- **Data Source**: Statically defined in `src/data/lessons.ts`.
- **Components**: `LessonPlayer` and `LessonNavigation`.
- **Logic**: Users complete small learning bites and quizzes. Progress determines whether the next lesson in the syllabus is available.

### C. Writing Lab (`src/app/write/`)
An interactive canvas for tracing Japanese Kana and Kanji.
- **Data Source**: Vector path and SVG metadata defined in `src/data/writingCharacters.ts`.
- **Components**: `WritingTrainer` and `CharacterAccordion`.
- **Logic**: Tracks attempts and grades accuracy based on the user's cursor/touch path compared to the standard stroke order, granting bonus XP.

### D. Authentication (`src/app/sign-in/`)
- A stylized sign-in portal that enforces protected routes.
- Once authenticated, it intelligently redirects the user back to where they intended to go (`redirect` search param).

## 4. State Management & Data Persistence

The application employs a **Hybrid State Architecture** via Server Actions and `localStorage` to ensure cross-device persistence without sacrificing "zero-latency" UX.

- **Auth State**: Handled globally via NextAuth's `<SessionProvider>`.
- **Database (Server)**:
  - **ORM**: Prisma Client.
  - **Driver**: SQLite (`better-sqlite3`) as the current persistent datastore.
  - Acts as the ultimate source of truth for user lessons and writing progress across multiple devices.
- **Progress State / Optimistic UI (`useLessonProgress` & `useWritingPractice`)**: 
  - **Storage**: `window.localStorage` caching.
  - **Structure**: Hooks execute an async **hydration** phase on initialization—fetching the latest data for the logged-in user from the Server via Next.js Server Actions (`src/app/actions/progress.ts`). The fetched data updates the local store. Subsequent gameplay read/writes strictly interact with `localStorage` for 0ms reactivity while dispatching "fire-and-forget" state updates back to the Server to keep the database synced.

## 5. Application Structure

```text
src/
├── app/                  # Next.js Route handlers (App Router)
│   ├── api/              # API Routes (NextAuth endpoints)
│   ├── lessons/          # Protected micro-lesson page
│   ├── sign-in/          # Public Auth page
│   └── write/            # Protected Kana tracing page
├── components/           # Reusable React components
│   ├── lessons/          # Lesson UI (player, navigation)
│   ├── provider/         # Context wrappers (Session, Theme)
│   ├── ui/               # Lower-level primitive components (buttons, dialogs)
│   └── writing/          # Writing lab specific UI
├── data/                 # Static content JSON/TS
├── hooks/                # Custom React hooks containing logic & localStorage sync
└── lib/                  # Utilities (e.g., tailwind merge)
```
