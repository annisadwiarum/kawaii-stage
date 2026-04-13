# Kawaii Stage - Development Roadmap & Task Planning

This document outlines the proposed phases for breathing new life into the **Kawaii Stage** project. The plan starts with shoring up the technical foundation and moves toward building the highly-anticipated gamification sections.

## Phase 1: Database Migration (Cloud Persistence)
**Goal:** Transition from `localStorage` to a robust server-side database so user progress is saved natively to their accounts across devices.

- [ ] **1.1 Setup Database:** Initialize a PostgreSQL database (e.g., via Supabase or Vercel Postgres).
- [ ] **1.2 Setup ORM:** Install Prisma, initialize schema, and create models:
  - `User` and `Account` (extending NextAuth default schema).
  - `LessonProgress`: Tracks `completedStepIds`, `quizScore`, `totalSteps`, and `status`.
  - `WritingProgress`: Tracks stats for each character (`attempts`, `accuracy`, `xp`).
- [ ] **1.3 Build API Routes / Server Actions:** 
  - Create functions to fetch progress for the logged-in user.
  - Create mutations to sync state (e.g., updating XP or completing a lesson).
- [ ] **1.4 Refactor Frontend Hooks:** Modify `useLessonProgress` and `useWritingPractice` to read from/write to the new API instead of `localStorage`. Manage optimistic UI updates for a snappy feel.

## Phase 2: Mini Game Arcade Implementation
**Goal:** Fulfill the "Coming Soon" promise on the landing page by turning the teased arcade into real, playable games.

- [ ] **2.1 Route Setup:** Create the arcade hub route `src/app/arcade/page.tsx` and dynamic game routes `src/app/arcade/[gameId]/page.tsx`.
- [ ] **2.2 Game 1 - "Kana Speed Tap":**
  - Implement a grid-based UI showing Random Romaji characters.
  - User has 60 seconds to match the falling or grid-based Hiragana/Katakana characters.
  - Save highest score and grant Sakura Coins / XP based on performance.
- [ ] **2.3 Game 2 - "Emoji Phrase Match" (Optional/Later):**
  - Present an emoji clue and 4 Japanese phrase options. 
- [ ] **2.4 Update Landing Page:** Remove the "Preview" block in `ProjectsSection.tsx` and wire the buttons directly to the live games.

## Phase 3: Dashboard & Community Mechanics
**Goal:** Give users a dedicated place to see their stats and introduce some healthy competition.

- [ ] **3.1 Profile Dashboard (`/profile`):**
  - Build a detailed view showing the user's best Streak, total Sakura Coins, and XP.
  - Visual breakdown of mastery (e.g., a radar chart mapping Listening, Reading, and Writing mastery).
- [ ] **3.2 Leaderboard (`/leaderboard`):**
  - Calculate global rankings based on Weekly XP.
  - Build UI using the neon styling to showcase top 10 learners.

## Phase 4: Content Expansion System
**Goal:** Scale the learning material effortlessly.

- [ ] **4.1 Externalize Data:** Move `lessons.ts` and `writingCharacters.ts` into the database or an external Headless CMS.
- [ ] **4.2 Basic Admin View (Stretch Goal):** Create a protected `/admin` route for the creator (Nissa-Chan) to add new phrases of the day, add new micro-lessons, or configure daily challenges without touching the codebase.
- [ ] **4.3 Daily Challenges:** Add a rotating "Daily Quests" array to the DB that refreshes every 24 hours (e.g., "Complete 2 Writing modules", "Play Kana Speed Tap once").
