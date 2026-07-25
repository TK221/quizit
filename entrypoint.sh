#!/bin/sh

# Exit on errors and reject unset variables. Keep this script POSIX-compatible
# because the production image uses Alpine's /bin/sh.
set -eu

readonly MIGRATION_DIRECTORY="/app/migration"
readonly MAX_MIGRATION_ATTEMPTS="${MIGRATION_MAX_ATTEMPTS:-30}"
readonly MIGRATION_RETRY_DELAY_SECONDS="${MIGRATION_RETRY_DELAY_SECONDS:-2}"

validate_positive_integer() {
  case "$2" in
    '' | *[!0-9]*)
      printf '%s must be a positive integer.\n' "$1" >&2
      exit 1
      ;;
  esac

  if [ "$2" -eq 0 ]; then
    printf '%s must be greater than zero.\n' "$1" >&2
    exit 1
  fi
}

validate_non_negative_integer() {
  case "$2" in
    '' | *[!0-9]*)
      printf '%s must be a non-negative integer.\n' "$1" >&2
      exit 1
      ;;
  esac
}

run_migrations() {
  (
    cd "$MIGRATION_DIRECTORY"
    exec ./node_modules/.bin/ts-node migrate.ts
  )
}

validate_positive_integer "MIGRATION_MAX_ATTEMPTS" "$MAX_MIGRATION_ATTEMPTS"
validate_non_negative_integer \
  "MIGRATION_RETRY_DELAY_SECONDS" \
  "$MIGRATION_RETRY_DELAY_SECONDS"

attempt=1
while ! run_migrations; do
  if [ "$attempt" -ge "$MAX_MIGRATION_ATTEMPTS" ]; then
    printf 'Database migrations failed after %s attempt(s).\n' "$attempt" >&2
    exit 1
  fi

  printf \
    'Database is not ready; retrying in %ss (attempt %s/%s)...\n' \
    "$MIGRATION_RETRY_DELAY_SECONDS" \
    "$attempt" \
    "$MAX_MIGRATION_ATTEMPTS" >&2

  attempt=$((attempt + 1))
  sleep "$MIGRATION_RETRY_DELAY_SECONDS"
done

printf '%s\n' 'Database migrations applied. Starting server...'
exec node server.js
