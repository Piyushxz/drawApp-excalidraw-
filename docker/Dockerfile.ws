FROM node:22-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY ./package.json ./package.json
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY ./turbo.json ./turbo.json

COPY ./apps/ws-backend ./apps/ws-backend
COPY ./packages ./packages

WORKDIR /usr/src/app/apps/ws-backend
RUN pnpm install --frozen-lockfile
RUN pnpm run build && ls -l dist

WORKDIR /usr/src/app/packages/db
RUN pnpm exec prisma generate

WORKDIR /usr/src/app/apps/ws-backend
EXPOSE 8080
CMD ["node", "dist/index.js"]
