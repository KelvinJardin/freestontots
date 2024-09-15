FROM node:18-alpine AS base

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN corepack enable pnpm && pnpm i

COPY src ./src
COPY public ./public
COPY next.config.js .
COPY tsconfig.json .
COPY prisma/ ./prisma

ARG ENV_VARIABLE
ENV ENV_VARIABLE=${ENV_VARIABLE}
ARG NEXT_PUBLIC_ENV_VARIABLE
ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}

RUN npm install -g prisma && \
  npx prisma generate && \
  pnpm build

# npx prisma migrate dev && npx prisma generate && pnpm dev
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma generate && node .next/standalone/server.js"]
