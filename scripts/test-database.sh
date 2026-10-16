#!/usr/bin/env bash
# Disposable local PostgreSQL only. Never reads project credentials or publishes ports.
set -euo pipefail

TASK_REPO_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
TASK_POSTGRES_IMAGE="${TEST_POSTGRES_IMAGE:-postgres:16-alpine}"
TASK_POSTGRES_CONTAINER="cryslearn-db-test-$$-$RANDOM"

command -v docker >/dev/null || { printf 'Docker is required for isolated database tests.\n' >&2; exit 1; }
cleanup() { docker rm --force "$TASK_POSTGRES_CONTAINER" >/dev/null 2>&1 || true; }
trap cleanup EXIT

docker run --detach --rm --network none --name "$TASK_POSTGRES_CONTAINER" \
  --tmpfs /var/lib/postgresql/data:rw \
  -e POSTGRES_HOST_AUTH_METHOD=trust "$TASK_POSTGRES_IMAGE" >/dev/null

TASK_POSTGRES_READY=false
for ((attempt = 0; attempt < 60; attempt++)); do
  if docker exec "$TASK_POSTGRES_CONTAINER" pg_isready -q -h 127.0.0.1 -U postgres; then
    TASK_POSTGRES_READY=true
    break
  fi
  sleep 0.5
done
if [[ "$TASK_POSTGRES_READY" != true ]]; then
  docker logs "$TASK_POSTGRES_CONTAINER" >&2
  printf 'PostgreSQL did not become ready.\n' >&2
  exit 1
fi

run_sql() {
  docker exec --interactive "$TASK_POSTGRES_CONTAINER" psql --no-psqlrc --quiet --set ON_ERROR_STOP=1 --username postgres --dbname postgres < "$1" >/dev/null
}

run_sql "$TASK_REPO_ROOT/supabase/tests/bootstrap.sql"
for migration in "$TASK_REPO_ROOT"/supabase/migrations/*.sql; do
  if [[ -n "${TEST_RELEASE_BUNDLE:-}" && "${migration##*/}" =~ ^(0000[89]|00010)_ ]]; then
    continue
  fi
  printf 'Applying %s\n' "${migration##*/}"
  run_sql "$migration"
done
if [[ -n "${TEST_RELEASE_BUNDLE:-}" ]]; then
  printf 'Applying atomic release bundle\n'
  run_sql "$TEST_RELEASE_BUNDLE"
fi
run_sql "$TASK_REPO_ROOT/supabase/tests/privacy.sql"
printf 'PASS: clean migration sequence, profile privacy, parent isolation, question keys, server-owned attempts, service-role access.\n'
