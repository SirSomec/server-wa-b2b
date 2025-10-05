# syntax=docker/dockerfile:1.6

FROM node:22-alpine AS deps
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY frontend/package.json frontend/package.json
RUN pnpm install --filter @server-wa-b2b/frontend... --frozen-lockfile

FROM node:22-alpine AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY --from=deps /pnpm /pnpm
COPY --from=deps /app/node_modules /app/node_modules\r\nCOPY tsconfig.base.json ./tsconfig.base.json\r\nCOPY frontend ./frontend\r\nRUN pnpm --filter @server-wa-b2b/frontend build

FROM node:22-alpine AS runner
ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY --from=builder /pnpm /pnpm
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/frontend/.next ./frontend/.next
COPY --from=builder /app/frontend/package.json ./frontend/package.json
COPY --from=builder /app/frontend/public ./frontend/public
EXPOSE 3001
CMD ["pnpm", "--filter", "@server-wa-b2b/frontend", "start"]

