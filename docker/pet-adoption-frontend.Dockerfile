# Create a build of the project
FROM node:20 AS build
WORKDIR /build

# Copy package.json and yarn.lock from the pet-adoption-frontend directory
COPY pet-adoption-frontend/package.json pet-adoption-frontend/yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code from the pet-adoption-frontend directory
COPY pet-adoption-frontend ./

# Build the frontend project
RUN yarn run build

# Copy the build artifacts to a clean image
FROM node:20
WORKDIR /app
COPY --from=build /build/.next ./.next

# Run the app
ENTRYPOINT ["yarn", "start"]
