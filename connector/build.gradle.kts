plugins {
    `java-library`
    id("application")
    id("com.github.johnrengelman.shadow") version "7.1.2"
}

repositories {
    mavenCentral()
    maven {
        url = uri("https://oss.sonatype.org/content/repositories/snapshots/")
    }
    maven {
        url = uri("https://maven.iais.fraunhofer.de/artifactory/eis-ids-public/")
    }
}

val edcGroupId = "org.eclipse.edc"
val edcVersion = "0.0.1-milestone-7"

dependencies {
    implementation("${edcGroupId}:control-plane-core:${edcVersion}")
    implementation("${edcGroupId}:ids:${edcVersion}")
    implementation("${edcGroupId}:configuration-filesystem:${edcVersion}")
    implementation("${edcGroupId}:vault-filesystem:${edcVersion}")
    implementation("${edcGroupId}:iam-mock:${edcVersion}")
    implementation("${edcGroupId}:data-management-api:${edcVersion}")
    implementation("${edcGroupId}:api-observability:${edcVersion}")
    implementation("${edcGroupId}:data-plane-transfer-sync:${edcVersion}")
    implementation("${edcGroupId}:http-receiver:${edcVersion}")

    implementation("${edcGroupId}:data-plane-selector-api:${edcVersion}")
    implementation("${edcGroupId}:data-plane-selector-core:${edcVersion}")
    implementation("${edcGroupId}:data-plane-selector-client:${edcVersion}")

    implementation("${edcGroupId}:data-plane-api:${edcVersion}")
    implementation("${edcGroupId}:data-plane-core:${edcVersion}")
    implementation("${edcGroupId}:data-plane-http:${edcVersion}")
}

application {
    mainClass.set("${edcGroupId}.boot.system.runtime.BaseRuntime")
}

tasks.withType<com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar> {
    mergeServiceFiles()
    archiveFileName.set("connector.jar")
}
