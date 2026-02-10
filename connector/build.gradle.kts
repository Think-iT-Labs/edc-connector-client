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
    runtimeOnly(libs.edc.dataplane.base.bom)
    runtimeOnly(libs.edc.federatedcatalog.bom)
    implementation(libs.edc.data.plane.spi)
    implementation(libs.edc.crawler.spi)
    runtimeOnly(libs.edc.iam.mock)
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
