# Kawaii Stage

Kawaii Stage is a vibrant, neon-inspired Japanese learning hub owned by **Nissa-Chan**. The landing experience blends bite-sized lessons, daily challenges, and a mini-game arcade to keep learners hyped while tracking progress through streaks, XP, and badges.

## ✨ Highlights

- **Hero Glow** – “Learn Japanese the Kawaii Way” hero with animated focus tags (Hiragana, Kanji, Culture, Slang).
- **Learning Modules** – Four curated flows (Bite-Sized Lessons, Daily Kawaii Challenge, Real Talk Audio, Hyper Focus Mode) with gradient icons.
- **Today’s Phrase** – Auto-rotating carousel featuring kana, romaji, and real-life context to spark daily practice.
- **Progress Sneak Peek** – Quick glance at streak best, Sakura badge count, and weekly XP.
- **Mini Game Arcade** – Kana Speed Tap, Emoji Phrase Match, Culture Trivia Rush preview cards plus Sakura Coin CTA.
- **Waitlist & Footer** – Animated waitlist modal, plus footer badge “Made with senpai energy” and social-style quick links.

## 🔐 Authentication Flow

- Every “Mulai Belajar”, “Coba Mini Game”, and game preview CTA checks for a session.
- New or signed-out visitors are routed to **`/sign-in`** (custom page) to authenticate via Google OAuth before accessing modules or arcade.
- Logged-in users get a personalized welcome modal greeting them by name with a “Let’s go!” confirmation to jump straight to the desired section.

## 🧰 Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS & custom utility tokens
- Framer Motion for micro-interactions & modals
- NextAuth (Google OAuth provider) with global `SessionProvider`
- lucide-react iconography + custom UI primitives

## 🚀 Local Development

```bash
# install dependencies
yarn

# run dev server
yarn dev

# lint codebase
yarn lint

# build production bundle
yarn build
```

Visit `http://localhost:3000` to explore the landing experience. Sign-in flows redirect to Google OAuth when a Google client ID/secret is configured (via `.env.local`).

## 📂 Key Pages & Components

| Path | Description |
| --- | --- |
| `src/app/page.tsx` | Main landing page composing hero, modules, arcade, contact, and footer sections. |
| `src/app/sign-in/page.tsx` | Stylized sign-in portal with feature highlights and Google SSO button. |
| `src/components/HeroSection.tsx` | Hero CTA logic (auth gating + welcome modal). |
| `src/components/ProjectsSection.tsx` | Daily phrase, progress preview, and game arcade grid. |
| `src/components/WelcomeModal.tsx` | Shared modal component greeting authenticated users. |

## 🛠️ Environment Setup

Create an `.env.local` file with your NextAuth secrets:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Restart `yarn dev` after editing environment values. With auth configured, returning users land on a personalized onboarding modal while new explorers are guided through the `/sign-in` stage.
