FROM gradle:9-jdk21 AS build

WORKDIR /home/gradle/project/

COPY --chown=gradle:gradle . ./

RUN --mount=type=cache,target=/home/gradle/.gradle/caches \
    gradle build --no-daemon

FROM eclipse-temurin:21

WORKDIR /app
COPY --from=build /home/gradle/project/build/libs/connector.jar /app

ENV EDC_FS_CONFIG=$EDC_FS_CONFIG

HEALTHCHECK --interval=5s --timeout=2s CMD curl -f http://localhost:9191/api/check/health || exit 1

EXPOSE 9191
EXPOSE 9192
EXPOSE 9193
EXPOSE 9194
EXPOSE 9291

ENTRYPOINT java -jar connector.jar
