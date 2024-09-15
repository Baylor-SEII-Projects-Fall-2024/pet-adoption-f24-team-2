FROM node:20 AS build
WORKDIR /build

COPY pet-adoption-frontend/package.json pet-adoption-frontend/yarn.lock ./
RUN yarn install

COPY pet-adoption-frontend ./
RUN yarn build

FROM node:20-alpine AS production
WORKDIR /app

COPY --from=build /build/.next ./.next

ENTRYPOINT ["yarn", "start"]
