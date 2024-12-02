FROM gradle:8.9.0-jdk22 AS build
WORKDIR /build
COPY . .
RUN ./gradlew build --no-daemon -p .
FROM openjdk:22
WORKDIR /app
COPY --from=build /build/build/libs/pet-adoption-api-1.0.0-SNAPSHOT.jar app.jar
EXPOSE 8080
ENV FRONTEND_URL=http://104.198.233.250:3000
ENTRYPOINT ["java", "-jar", "app.jar"]
