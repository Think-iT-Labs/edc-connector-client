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
        exclude("org.eclipse.edc", "data-plane-signaling-oauth2")
        exclude("org.eclipse.edc", "data-plane-signaling-oauth2-token-exchange")
    }
    implementation(libs.edc.control.plane.spi)
    implementation(libs.edc.data.plane.signaling.core)

    runtimeOnly(libs.edc.iam.mock)
    runtimeOnly(libs.edc.secrets.api)
    // CEL policy engine + v5 CEL expressions management API, needed to hold
    // provider contract negotiations for manual approval (approve/reject).
    runtimeOnly(libs.edc.cel.core)
    runtimeOnly(libs.edc.cel.api.v5)
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
