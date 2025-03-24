FROM node:22-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm
COPY ./packages ./packages

RUN cd packages/db && npx prisma generate && cd .. && cd ..
COPY ./pnpm-lock.yaml ./pnpm-lock.yaml
COPY ./pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY ./turbo.json ./turbo.json

COPY ./apps/http-backend ./apps/http-backend

RUN pnpm install 

RUN cd apps/http-backend && pnpm run build

CMD ["node","dist/index.js"]











