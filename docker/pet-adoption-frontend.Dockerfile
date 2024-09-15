# Stage 1: Build
FROM node:20 AS build
WORKDIR /build

# Copy package.json and yarn.lock
COPY pet-adoption-frontend/package.json pet-adoption-frontend/yarn.lock ./
RUN yarn install

# Copy the rest of the application code and build
COPY pet-adoption-frontend ./
RUN yarn build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app

# Copy build artifacts from the build stage
COPY --from=build /build/.next ./.next
COPY --from=build /build/public ./public

# Install production dependencies
COPY pet-adoption-frontend/package.json pet-adoption-frontend/yarn.lock ./
RUN yarn install --production

# Expose port and start the application
EXPOSE 3000
CMD ["yarn", "start"]
