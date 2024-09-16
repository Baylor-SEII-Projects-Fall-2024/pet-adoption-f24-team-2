FROM gradle:8.9.0-jdk22 AS build
WORKDIR /build
COPY pet-adoption-api/ ./
RUN ./gradlew build --no-daemon -p .

FROM openjdk:22
WORKDIR /app
COPY --from=build /build/build/libs/pet-adoption-api-1.0.0-SNAPSHOT.jar app.jar

ENV MYSQL_HOST=localhost
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=

ENTRYPOINT ["java", "-jar", "app.jar"]
