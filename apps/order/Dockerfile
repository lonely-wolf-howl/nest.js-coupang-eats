FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm i -g pnpm

RUN pnpm i

COPY . .

CMD ["pnpm", "start:dev", "product"]
