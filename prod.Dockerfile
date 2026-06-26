FROM node:20-alpine

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i

COPY src ./src
COPY public ./public
COPY tsconfig.json .
COPY next.config.js .
COPY postcss.config.js .
COPY tailwind.config.js .
COPY prisma/ ./prisma

RUN pnpm install prisma && \
    npx prisma generate && \
    pnpm build

RUN mkdir -p /app/uploads && chown -R app:app /app

ARG ENV_VARIABLE
ENV ENV_VARIABLE=${ENV_VARIABLE}
ARG NEXT_PUBLIC_ENV_VARIABLE
ENV NEXT_PUBLIC_ENV_VARIABLE=${NEXT_PUBLIC_ENV_VARIABLE}

USER app

CMD ["sh", "-c", "\
  npx prisma migrate deploy &&\
  npx next start -H 0.0.0.0\
"]
