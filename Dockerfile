# syntax=docker/dockerfile:1

# The application supports Node 22 and this image includes Alpine's small
# runtime footprint. Change the build argument to test another Node release.
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1

# -----------------------------------------------------------------------------
# Application build
# -----------------------------------------------------------------------------

# The main project is pinned to Yarn 4 in package.json.
FROM base AS yarn-4

RUN corepack enable && corepack prepare yarn@4.1.1 --activate

# Keep dependency installation separate so source-only changes reuse this layer.
FROM yarn-4 AS dependencies

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install --immutable

FROM dependencies AS builder

COPY . .

# Runtime configuration is supplied by Compose or the host, not baked into the image.
RUN SKIP_ENV_VALIDATION=1 yarn build

# -----------------------------------------------------------------------------
# Migration tool
# -----------------------------------------------------------------------------

# The migration helper has its own Yarn 1 lockfile. Isolate it from the main
# application's Yarn 4 installation so both dependency graphs remain reproducible.
FROM base AS migration

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

WORKDIR /app/migration

COPY drizzle/migration/package.json drizzle/migration/yarn.lock ./

RUN yarn install --frozen-lockfile

COPY drizzle ./drizzle
COPY drizzle/migration/migrate.ts ./migrate.ts

# -----------------------------------------------------------------------------
# Production runtime
# -----------------------------------------------------------------------------

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

# Next.js standalone contains the production server and its traced dependencies.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# The entrypoint calls this self-contained helper before starting the server.
COPY --from=migration --chown=nextjs:nodejs /app/migration ./migration
COPY --chown=nextjs:nodejs entrypoint.sh ./entrypoint.sh

# Convert CRLF defensively: a Windows checkout must not break Alpine's shell.
RUN sed -i 's/\r$//' /app/entrypoint.sh \
    && chmod 0555 /app/entrypoint.sh \
    && mkdir -p /app/.next \
    && chown nextjs:nodejs /app/.next

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

ENTRYPOINT ["/app/entrypoint.sh"]
