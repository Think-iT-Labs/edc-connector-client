FROM gradle:jdk17 AS build

COPY --chown=gradle:gradle . /home/gradle/project/
WORKDIR /home/gradle/project/
RUN gradle build --no-daemon

FROM openjdk:17-slim

WORKDIR /app
COPY --from=build /home/gradle/project/build/libs/connector.jar /app

ENV EDC_FS_CONFIG=$EDC_FS_CONFIG

EXPOSE 9191
EXPOSE 9192
EXPOSE 9193
EXPOSE 9194
EXPOSE 9291

ENTRYPOINT java -jar connector.jar
