# syntax=docker/dockerfile:1.6

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY backend/package.json backend/package.json
COPY packages/contracts/package.json packages/contracts/package.json
RUN pnpm install --filter @server-wa-b2b/backend... --frozen-lockfile

FROM base AS builder
COPY . .
RUN pnpm --filter @server-wa-b2b/backend build

FROM node:22-alpine AS runner
ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY --from=builder /pnpm /pnpm
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main.js"]
