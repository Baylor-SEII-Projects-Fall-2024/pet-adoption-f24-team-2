# Create a build of the project
FROM gradle:8.9.0-jdk22 AS build
WORKDIR /build
COPY pet-adoption-api/ ./
RUN ./gradlew build --no-daemon -p .

# Verify the directory structure
RUN ls -la /build/
RUN ls -la /build/libs/

# Copy the build artifacts
FROM openjdk:22
WORKDIR /app
COPY --from=build /build/libs/pet-adoption-api-1.0.0-SNAPSHOT.jar app.jar

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
