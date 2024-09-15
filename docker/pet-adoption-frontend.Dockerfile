# Stage 1: Build
FROM node:20 AS build
WORKDIR /build

# Copy package.json and yarn.lock to the /build directory
COPY pet-adoption-frontend/package.json pet-adoption-frontend/yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the /build directory
COPY pet-adoption-frontend ./

# Build the frontend project
RUN yarn build

# Stage 2: Production
FROM node:20 AS production
WORKDIR /app

# Copy build artifacts from the build stage
COPY --from=build /build/.next ./
COPY --from=build /build/public ./public

# Install only production dependencies
COPY pet-adoption-frontend/package.json pet-adoption-frontend/yarn.lock ./
RUN yarn install --production

# Expose port and run the app
EXPOSE 3000
CMD ["yarn", "start"]
