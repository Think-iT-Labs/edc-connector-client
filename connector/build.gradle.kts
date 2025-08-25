plugins {
    `java-library`
    id("application")
    alias(libs.plugins.shadow)
}

repositories {
    mavenCentral()
}

dependencies {
    runtimeOnly(libs.edc.controlplane.base.bom)
    runtimeOnly(libs.edc.dataplane.base.bom) {
        exclude(group = "org.eclipse.edc", module = "data-plane-selector-client")
    }
    runtimeOnly(libs.edc.federatedcatalog.bom)
    implementation(libs.edc.crawler.spi)
    runtimeOnly(libs.edc.iam.mock)
    runtimeOnly(libs.edc.dataplane.public.api.v2)
}

application {
    mainClass.set("org.eclipse.edc.boot.system.runtime.BaseRuntime")
}

tasks.withType<com.github.jengelman.gradle.plugins.shadow.tasks.ShadowJar> {
    dependsOn("distTar", "distZip")
    mergeServiceFiles()
    archiveFileName.set("connector.jar")
}
