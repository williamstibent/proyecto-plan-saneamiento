# SanitIA — Backend

API REST construida con **Spring Boot 3.5 / Java 21**. Monolito modular multi-tenant para la plataforma de saneamiento sanitario SanitIA.

---

## Requisitos previos

### 1. Java 21

El proyecto usa Java 21 LTS. Recomendamos instalar con **SDKMAN** (macOS / Linux):

```bash
# Instalar SDKMAN
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"

# Instalar Java 21 (Eclipse Temurin — distribución recomendada)
sdk install java 21.0.7-tem
sdk use java 21.0.7-tem

# Verificar
java -version
# openjdk version "21.0.7" ...
```

**Windows** — Descarga el instalador MSI desde [Adoptium](https://adoptium.net/temurin/releases/?version=21) y sigue el asistente.

### 2. Docker Desktop

Requerido para levantar PostgreSQL localmente y para ejecutar los tests de integración (Testcontainers).

- macOS / Windows: [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Linux: `sudo apt install docker.io docker-compose-plugin`

Verificar:
```bash
docker --version
# Docker version 27.x.x
```

### 3. Gradle Wrapper — paso obligatorio una sola vez

El proyecto incluye el script `gradlew` pero necesita el archivo binario `gradle-wrapper.jar` para funcionar. Debes generarlo una vez tras clonar el repositorio.

**Opción A — Con Gradle instalado localmente** (recomendada):

```bash
# Instalar Gradle con SDKMAN
sdk install gradle 8.13

# Desde la carpeta backend/
gradle wrapper --gradle-version 8.13
```

**Opción B — Con IntelliJ IDEA**:
Al importar el proyecto, IntelliJ detecta que falta el wrapper y ofrece generarlo automáticamente. Acepta y listo.

**Opción C — Descarga manual**:
Descarga `gradle-wrapper.jar` desde [GitHub oficial de Gradle](https://github.com/gradle/gradle/tree/v8.13.0/gradle/wrapper) y colócalo en `backend/gradle/wrapper/gradle-wrapper.jar`.

Tras este paso, ya no necesitas Gradle instalado globalmente — `./gradlew` se encarga de todo.

---

## Configuración local

### 1. Variables de entorno

```bash
cp .env.example .env
```

Edita `.env` si necesitas cambiar puertos o credenciales (los valores por defecto funcionan con Docker Compose).

### 2. Base de datos PostgreSQL

Levanta PostgreSQL con Docker:

```bash
docker run -d \
  --name sanitia-postgres \
  -e POSTGRES_DB=sanitia_dev \
  -e POSTGRES_USER=sanitia \
  -e POSTGRES_PASSWORD=sanitia_pass \
  -p 5432:5432 \
  postgres:16-alpine
```

O si tienes Docker Compose desde la raíz del monorepo:

```bash
docker compose up -d postgres
```

---

## Ejecutar el proyecto

```bash
# Desde la carpeta backend/
./gradlew bootRun
```

El servidor arranca en **http://localhost:8080**

Verifica que está corriendo:
```bash
curl http://localhost:8080/api/v1/ping
# {"status":"UP","service":"SanitIA Backend","timestamp":"..."}

curl http://localhost:8080/actuator/health
# {"status":"UP"}
```

**Windows:**
```batch
gradlew.bat bootRun
```

---

## Ejecutar los tests

> Asegúrate de que **Docker esté corriendo** antes de ejecutar tests. Testcontainers levanta un PostgreSQL en contenedor automáticamente — no necesitas la DB de dev.

```bash
./gradlew test
```

Ver reporte HTML tras correr:
```bash
open build/reports/tests/test/index.html
```

---

## Compilar el JAR

```bash
./gradlew bootJar
# Genera: build/libs/sanitia-backend.jar
```

---

## Estructura de paquetes

```
src/main/java/com/sanitia/
├── SanitIAApplication.java          # Punto de entrada
├── shared/
│   ├── config/                      # SecurityConfig, JpaConfig, WebConfig
│   ├── exception/                   # GlobalExceptionHandler
│   ├── multitenancy/                # TenantContext (ThreadLocal)
│   └── api/                         # HealthController
├── identity/                        # Usuarios, roles, JWT (Sprint 1)
├── tenancy/                         # Tenants, establecimientos (Sprint 1)
├── establishments/                  # Sedes, pisos, áreas (Sprint 1)
├── sanitation_plans/                # POE, procedimientos (Sprint 2)
├── scheduling/                      # Reglas de frecuencia (Sprint 3)
├── task_execution/                  # Checklists, ejecución (Sprint 3)
├── evidence/                        # Fotos, S3 (Sprint 4)
├── notifications/                   # Email via SES (Sprint 4)
├── reports/                         # PDF mensual (Sprint 4)
└── audit/                           # Log inmutable (Sprint 1)

src/main/resources/
├── application.yml                  # Configuración base
├── application-dev.yml              # Override para desarrollo local
├── application-test.yml             # Override para tests
└── db/migration/                    # Migraciones Flyway (V001__*.sql, ...)
```

Cada módulo sigue la misma estructura interna:
```
{modulo}/
├── api/           → Controller + DTOs (Request / Response)
├── application/   → Service + interfaces UseCase
├── domain/        → Entidades de dominio + interfaces Repository
└── infrastructure/
    └── persistence/ → JPA entities + implementaciones Repository
```

---

## IDE recomendado

**IntelliJ IDEA** (Community o Ultimate).

Pasos de importación:
1. `File → Open` → seleccionar la carpeta `backend/`
2. IntelliJ detecta Gradle automáticamente
3. Esperar a que sincronice las dependencias (~2 min primera vez)
4. Verificar que el SDK del proyecto es Java 21: `File → Project Structure → SDK`

---

## Convenciones del proyecto

Ver [CLAUDE.md](../CLAUDE.md) en la raíz del monorepo para las reglas de nombrado, clean code, multi-tenancy y seguridad que aplican a todo el backend.
