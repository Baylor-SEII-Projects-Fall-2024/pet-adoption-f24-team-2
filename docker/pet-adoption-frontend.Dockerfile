# Build stage
FROM node:20 AS build
WORKDIR /build

COPY pet-adoption-frontend/package.json pet-adoption-frontend/yarn.lock ./
RUN yarn install

COPY pet-adoption-frontend ./
RUN yarn build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy built files and necessary package files
COPY --from=build /build/.next ./.next
COPY pet-adoption-frontend/package.json pet-adoption-frontend/yarn.lock ./

# Install dependencies for production
RUN yarn install --production

ENTRYPOINT ["yarn", "start"]
