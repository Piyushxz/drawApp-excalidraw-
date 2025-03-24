FROM node:20-slim AS base

WORKDIR /usr/src/app

RUN npm install -g pnpm

# Copy only necessary files
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./turbo.json ./turbo.json
COPY ./apps/http-backend ./apps/http-backend
COPY ./packages ./packages



RUN pnpm install --frozen-lockfile

RUN apt-get update && apt-get install -y openssl


# Generate Prisma client
WORKDIR /usr/src/app/packages/db
RUN pnpm exec prisma generate

# Set working directory back to backend
WORKDIR /usr/src/app/apps/http-backend

CMD ["node", "dist/index.js"]
