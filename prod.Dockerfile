FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i

COPY src ./src
COPY public ./public
COPY next.config.js .
COPY tsconfig.json .
COPY prisma/ ./prisma

RUN pnpm install prisma && \
    npx prisma generate && \
    pnpm build

ARG ENV_VARIABLE
ENV ENV_VARIABLE=${ENV_VARIABLE}
ARG NEXT_PUBLIC_ENV_VARIABLE
ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}

CMD ["sh", "-c", "npx prisma migrate deploy && node .next/standalone/server.js"]
