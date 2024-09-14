# Create a build of the project
FROM node:20 AS build
WORKDIR /build

# Copy only package.json and yarn.lock first for better caching
COPY ../package.json ../yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY .. .

# Build the frontend project
RUN yarn run build

# Copy the build artifacts to a clean image
FROM node:20
WORKDIR /app
COPY --from=build /build/dist ./dist

# Run the app
ENTRYPOINT ["yarn", "start"]
