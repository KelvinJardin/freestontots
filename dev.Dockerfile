FROM node:20-alpine

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY package.json pnpm-lock.yaml* ./

RUN corepack enable pnpm && pnpm i && chown -R app:app /app

USER app
