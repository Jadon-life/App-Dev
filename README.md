# CrysLearn

> Learn with clarity. Score with confidence..

CrysLearn is a mobile-first exam preparation platform for Nigerian students preparing for JAMB, WAEC, NECO, and Post-UTME exams.

## Features

- 10+ years of past questions (filterable by subject and year)
- Timed mock exams with automatic scoring
- AI-powered answer explanations
- Subject-by-subject performance tracking
- One-time exam unlock payment (Paystack)
- Offline mode (mobile app)
- Parent dashboard to monitor child's progress

## Project Structure

```
CrysLearn/
├── web/            → Next.js 14 web app (deployed to Vercel)
├── mobile/         → React Native (Expo) app (Android + iOS)
├── shared/         → Shared types, constants, and validations
├── supabase/       → Database migrations and seed data
├── FOUNDERS_GUIDE.md → Complete guide for the founder
└── package.json    → Monorepo root
```

## Quick Start

### 1. Set up the database

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run migration files in `supabase/migrations/` (in order, 001-006)
3. Run seed files in `supabase/seed/` to populate exam data

### 2. Configure environment

```bash
cp web/.env.example web/.env.local
# Fill in your Supabase and Paystack keys
```

### 3. Run the web app

```bash
cd web
npm install
npm run dev
```

Visit http://localhost:3000

### 4. Run the mobile app

```bash
cd mobile
npm install
npx expo start
```

### 5. Deploy

- **Web:** Push to GitHub → Import in Vercel → Add env vars → Deploy
- **Mobile:** `npx eas build --platform android` → Upload to Google Play

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend (Web) | Next.js 14, TypeScript, Tailwind CSS |
| Mobile | React Native (Expo) |
| Backend | Supabase (PostgreSQL + Auth + Edge Functions) |
| Payments | Paystack |
| Hosting | Vercel (web), Expo EAS (mobile) |

## Environment Variables

See `web/.env.example` and `mobile/.env.example` for required variables.

## License

Private — All rights reserved.
