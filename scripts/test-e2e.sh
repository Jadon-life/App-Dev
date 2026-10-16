#!/usr/bin/env bash
# Isolated integration environment: no real users, payments, or database writes.
set -euo pipefail
cd "$(dirname "$0")/.."
export NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54329
export NEXT_PUBLIC_SUPABASE_ANON_KEY=local-test-anon-key
export SUPABASE_SERVICE_ROLE_KEY=local-test-service-role
export NEXT_PUBLIC_APP_URL=http://127.0.0.1:3100
unset PAYSTACK_SECRET_KEY NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
export NODE_USE_ENV_PROXY=1
npm run build:web
./node_modules/.bin/playwright test -c web/playwright.config.ts "$@"
