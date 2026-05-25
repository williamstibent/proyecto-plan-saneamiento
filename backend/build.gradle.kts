import org.springframework.boot.gradle.tasks.bundling.BootJar

plugins {
    java
    id("org.springframework.boot") version "3.5.0"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.sanitia"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

extra["springCloudAwsVersion"] = "3.3.0"
extra["testcontainersVersion"] = "1.20.4"
extra["mapstructVersion"] = "1.6.3"

dependencyManagement {
    imports {
        mavenBom("io.awspring.cloud:spring-cloud-aws-dependencies:${property("springCloudAwsVersion")}")
        mavenBom("org.testcontainers:testcontainers-bom:${property("testcontainersVersion")}")
    }
}

dependencies {
    // Spring Boot starters
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    // Base de datos
    implementation("org.flywaydb:flyway-core")
    implementation("org.flywaydb:flyway-database-postgresql")
    runtimeOnly("org.postgresql:postgresql")

    // AWS (SQS, S3, SES)
    implementation("io.awspring.cloud:spring-cloud-aws-starter-s3")
    implementation("io.awspring.cloud:spring-cloud-aws-starter-sqs")
    implementation("io.awspring.cloud:spring-cloud-aws-starter-ses")

    // Generación de PDFs
    implementation("com.github.librepdf:openpdf:2.0.3")

    // Mapeo de DTOs
    implementation("org.mapstruct:mapstruct:${property("mapstructVersion")}")
    annotationProcessor("org.mapstruct:mapstruct-processor:${property("mapstructVersion")}")

    // Lombok (reduce boilerplate)
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok-mapstruct-binding:0.2.0")

    // Dev tools
    developmentOnly("org.springframework.boot:spring-boot-devtools")

    // Test
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.testcontainers:postgresql")
    testImplementation("org.assertj:assertj-core")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.named<BootJar>("bootJar") {
    archiveFileName.set("sanitia-backend.jar")
}
