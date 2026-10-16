# CrysLearn

> Learn with clarity. Score with confidence..

CrysLearn is a mobile-first exam preparation platform for Nigerian students preparing for JAMB, WAEC, NECO, and Post-UTME exams.

## Features

- Past-question library with subject and available-year filters
- Timed mock exams with automatic scoring
- Answer review with the explanations stored in the question bank
- Subject-by-subject performance tracking
- One-time exam unlock payment (Paystack)
- Weekly study planner with account-scoped local persistence
- Mobile account, exam catalog and synced result summaries

Crystal AI, offline question downloads and consent-based parent sharing are not yet available. Their screens state this explicitly.

## Project Structure

```
CrysLearn/
├── web/            → Next.js 15 web app (deployed to Vercel)
├── mobile/         → React Native (Expo) app (Android + iOS)
├── shared/         → Shared types, constants, and validations
├── supabase/       → Database migrations and seed data
├── FOUNDERS_GUIDE.md → Complete guide for the founder
└── package.json    → Monorepo root
```

## Quick Start

### 1. Set up the database

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Review and run migrations in `supabase/migrations/` (in filename order, 00001–00009). Migrations 00008 and 00009 are required for the hardened profile and exam APIs. See the coordinated rollout notes in [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).
3. Run seed files in `supabase/seed/` to populate exam data

### 2. Configure environment

```bash
cp web/.env.example web/.env.local
# Fill in your Supabase and Paystack keys
```

### 3. Run the web app

```bash
npm ci
npm run dev:web
```

Visit http://localhost:3000

### 4. Run the mobile app

```bash
npm ci
npm run start --workspace=cryslearn-mobile
```

### 5. Deploy

- **Web:** Push to GitHub → Import in Vercel → Add env vars → Deploy
- **Mobile:** `npx eas build --platform android` → Upload to Google Play

## Tech Stack

| Layer          | Technology                                    |
| -------------- | --------------------------------------------- |
| Frontend (Web) | Next.js 15, TypeScript, Tailwind CSS          |
| Mobile         | React Native (Expo)                           |
| Backend        | Supabase (PostgreSQL + Auth + Edge Functions) |
| Payments       | Paystack                                      |
| Hosting        | Vercel (web), Expo EAS (mobile)               |

## Environment Variables

See `web/.env.example` and `mobile/.env.example` for required variables. Keep values in secure environment settings or ignored local files.

For regression tests, browser fixtures, database checks, and deployment limits, read [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md).

## License

Private — All rights reserved.
