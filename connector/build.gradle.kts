plugins {
    `java-library`
    id("application")
    alias(libs.plugins.shadow)
}

repositories {
    mavenCentral()
}

dependencies {
    runtimeOnly(libs.edc.controlplane.base.bom) {
        exclude("org.eclipse.edc", "data-plane-signaling-core")
        exclude("org.eclipse.edc", "data-plane-signaling-oauth2")
        exclude("org.eclipse.edc", "data-plane-signaling-oauth2-token-exchange")
    }
    implementation(libs.edc.control.plane.spi)
    runtimeOnly(libs.edc.iam.mock)
    runtimeOnly(libs.edc.secrets.api)
}

application {
    mainClass.set("org.eclipse.edc.boot.system.runtime.BaseRuntime")
}

tasks.shadowJar {
    dependsOn("distTar", "distZip")
    mergeServiceFiles()
    duplicatesStrategy = DuplicatesStrategy.INCLUDE
    archiveFileName.set("connector.jar")
}
