# Developing CrysLearn

CrysLearn is a Next.js 15 web application, an Expo SDK 51 mobile application, and a shared TypeScript package for Nigerian exam preparation. Supabase supplies auth and data; Paystack supplies checkout. Work in the existing isolated checkout. A separate Git worktree is only needed if explicitly requested.

## Setup

Use Node 24 (also pinned in `web/.nvmrc`) and npm. Install **at the repository root**:

```sh
npm ci
npm run dev:web
```

The root lockfile is authoritative for all workspaces. The obsolete web lockfile was removed. Web and mobile share React 18.2 to avoid loading incompatible React instances from hoisted packages. Three.js remains available for the opt-in book; unused React Three Fiber packages were removed.

Supply configuration securely through the execution environment or ignored local files (`web/.env.local`, `mobile/.env`). Never commit credentials. See the `.env.example` files for variable names. The web landing page can render without credentials; protected functionality fails closed with a useful error. Service-role credentials are only imported from server-only modules and are created on demand.

For browser auth, email confirmation and Google OAuth, allow your app's `/api/auth/callback` URL in Supabase Auth settings. The native app needs its `cryslearn://auth/callback` redirect allowed. Supabase Google OAuth must be enabled separately. No setup script creates users, runs payments, or changes a remote database.

## Local checks

```sh
npm run lint --workspace=web
npm run lint --workspace=cryslearn-mobile
npm run typecheck:web
npm run typecheck:mobile
npm test
npm run test:release
npm run check:mobile-sdk
npm run test:db
npm run build:web
```

`test:db` uses Docker to create and remove an isolated PostgreSQL 16 container, with no network or published port. Its fixtures model Supabase Auth/storage schemas and role grants, then apply all migrations and exercise row/column permissions. It does not replace validation against a deployed Supabase project.

`npm run test:e2e` builds an isolated fixture environment, starts a local Supabase test double and production Next server, and exercises desktop/mobile browser journeys with Playwright. It uses synthetic test sessions and local data, never a real account or payment. Chromium is expected at `/usr/bin/chromium`; set `PLAYWRIGHT_CHROMIUM_PATH` for another system installation. The E2E build embeds local test configuration; **run `npm run build:web` again with your real environment before a real deployment**. On hosts requiring an HTTP egress proxy for Node fetch, use `NODE_USE_ENV_PROXY=1` (Node 24).

## Database rollout

Review and apply migrations in filename order. Migration 00003's original forward reference to `user_exam_access` was moved to 00004, so clean installs work in that order. Do not rerun historical table-creation scripts against an existing database.

New migrations:

- `00008_secure_profile_access.sql`: removes recursive and unsafe parent policies and restricts self-service profile editing. Existing links remain stored but convey no access; a UUID is not proof of student consent.
- `00009_secure_exam_attempts.sql`: adds durable question composition, deadlines, ordered autosave and review snapshots; reserves attempt writes and answer keys for trusted server routes; adds a bounded year metadata function. Practice explanations remain intentionally available through authenticated practice APIs.

These migrations do not delete users, questions, payments, or existing scores. Historical attempts without question snapshots display summary scores and an explicit unavailable-review state. Server grading protects stored results; this learning product is not a proctored/high-stakes exam system, since practice explanations can be requested separately.

Coordinate migration 00009 with the web rollout: the new API needs its columns, while old clients used direct database writes that the migration revokes. Stage the tested deployment and use a maintenance window for the schema change and promotion. Database migrations are not automatically run by Vercel or these setup commands.

## Deployment

Use the connected Vercel project with root directory `web`, Node 24, Next.js framework, and source files outside the root enabled for `shared/`. `web/vercel.json` uses the root frozen install. Set Supabase URL, anon key and service-role key in Vercel. Set Paystack keys for payment functionality and use Paystack test mode for end-to-end validation first. `NEXT_PUBLIC_APP_URL` should be the canonical app origin, not the Supabase origin. Preserve HTTPS certificate and package integrity verification.

Confirm a production build, `/api/health`, signed-in account access, test-mode checkout and a real webhook delivery in staging before promoting. Do not assume cloud environment values have also been configured in Vercel. Deployment changes in this implementation are local until reviewed and published through the normal Git/Vercel workflow.

## Product limits

Crystal AI, device offline question packs and student-approved parent sharing had placeholder/incomplete implementations. Their screens now state their actual availability and link to working practice/planner features; they do not fabricate responses, downloads or student progress. They require separate backend/device work before being marketed as available.

Expo SDK 51 is old. Native auth, storage and JavaScript export can be checked here, but a native SDK upgrade and device testing are still required before claiming a production-ready mobile release. Never disable package verification, hide audit findings, or treat a passing web build as native validation.

## Live migration access

A project service-role key cannot execute SQL migrations. The reviewed Management API runner uses `SUPABASE_ACCESS_TOKEN`, supplied securely in environment settings for the destination `api.supabase.com`. It checks metadata before doing anything and never logs the token or user records. The project host and deployment domains must also be permitted by the environment network policy. Saving the draft alone does not apply those runtime changes.

```sh
# Check the target project and current schema without applying changes.
python3 scripts/apply-supabase-migrations.py
# Apply migrations 00008–00010 in one transaction, then verify live permissions.
python3 scripts/apply-supabase-migrations.py --apply
```

Stage the Vercel review build first. Apply the schema only when ready to promote it; migration 00009 intentionally blocks older browser clients from writing their own scores. Never promote a deployment whose required schema verification fails. The release runner's atomic SQL bundle was also exercised against the disposable PostgreSQL security fixture.

Migration 00010 restores the owner-only profile SELECT/UPDATE policies for existing projects where they are missing. A real sign-in check found a live project with profile rows and table grants but no `public.users` policies: authentication succeeded while profile reads returned no rows. Apply 00010 as `postgres` in the SQL Editor if Management API access is unavailable. It preserves migration 00008's column restrictions and does not enable student linking or profile insertion. Verify a signed-in account can read its own profile before releasing.
