# Backend — SanitIA (Spring Boot 3.5 / Java 21)

> Este archivo complementa el `CLAUDE.md` raíz. No repite convenciones generales ya definidas allí.
> Foco: estado actual del código, comandos, patrones concretos de implementación.

---

## Comandos esenciales

```bash
# Compilar (falla rápido si hay errores de tipos)
./gradlew compileJava

# Ejecutar todos los tests (requiere Docker para Testcontainers)
./gradlew test

# Ejecutar la aplicación en modo dev
./gradlew bootRun --args='--spring.profiles.active=dev'

# Build del JAR de producción
./gradlew bootJar

# Limpiar y compilar desde cero
./gradlew clean build

# Ejecutar un test específico
./gradlew test --tests "com.sanitia.task_execution.*"
```

> `application-dev.yml` desactiva JWT para desarrollo local. No modificar `SecurityConfig.java` directamente para pruebas — usar el perfil.

---

## Estado actual del código (junio 2026)

### Implementado en `shared/`
| Clase | Ubicación | Estado |
|---|---|---|
| `TenantContext` | `shared/multitenancy/` | ✅ ThreadLocal con validación |
| `SecurityConfig` | `shared/config/` | ⚠️ Dev-mode: todas las rutas permitidas |
| `JpaConfig` | `shared/config/` | ✅ |
| `WebConfig` | `shared/config/` | ✅ CORS configurado |
| `GlobalExceptionHandler` | `shared/exception/` | ✅ Record `ErrorResponse` |
| `HealthController` | `shared/api/` | ✅ `/actuator/health` |

### Módulos — scaffolding creado, sin implementación
Todos los módulos tienen la estructura de paquetes vacía (`api/dto/`, `application/`, `domain/`, `infrastructure/persistence/`):

```
identity/    tenancy/    establishments/    sanitation_plans/
scheduling/  task_execution/    evidence/    notifications/
reports/     audit/
```

### Migraciones Flyway
`src/main/resources/db/migration/` — **vacío**. La primera migración que se cree debe ser `V001__init_schema.sql`.

---

## Java 21 — features a usar activamente

**Records** para DTOs y value objects (ya en uso: `GlobalExceptionHandler.ErrorResponse`):
```java
// Request DTO — inmutable, sin boilerplate
public record CreateTaskRequest(
    @NotNull UUID procedureVersionId,
    @NotNull LocalDate scheduledDate,
    @NotNull TaskFrequency frequency
) {}

// Response DTO
public record TaskSummaryResponse(UUID id, String title, TaskStatus status, LocalDate scheduledDate) {}
```

**Sealed classes** para resultados de dominio y eventos (evita `instanceof` sin exhaustividad):
```java
public sealed interface TaskExecutionResult
    permits TaskExecutionResult.Success, TaskExecutionResult.AlreadyCompleted, TaskExecutionResult.Expired {

    record Success(UUID executionId, Instant completedAt) implements TaskExecutionResult {}
    record AlreadyCompleted(UUID executionId) implements TaskExecutionResult {}
    record Expired(LocalDate scheduledDate) implements TaskExecutionResult {}
}

// En el service — el compilador obliga a cubrir todos los casos:
TaskExecutionResult result = service.execute(command);
return switch (result) {
    case TaskExecutionResult.Success s -> ResponseEntity.ok(toResponse(s));
    case TaskExecutionResult.AlreadyCompleted a -> ResponseEntity.conflict().build();
    case TaskExecutionResult.Expired e -> ResponseEntity.unprocessableEntity().build();
};
```

**Pattern matching** con `instanceof` y switch expressions — preferir sobre casting explícito.

**Text blocks** para queries JPQL o SQL en tests:
```java
String query = """
    SELECT t FROM TaskInstance t
    WHERE t.tenantId = :tenantId
    AND t.scheduledDate = :date
    ORDER BY t.area.name
    """;
```

---

## ⚠️ ThreadLocal y Virtual Threads

`TenantContext` usa `ThreadLocal`. **Virtual Threads están desactivados** (no hay `spring.threads.virtual.enabled=true` en `application.yml`).

**Si se activan Virtual Threads en el futuro:**
- `ThreadLocal` sigue funcionando pero con riesgo de memory leak bajo alta concurrencia (millones de VTs).
- Migrar a `ScopedValue` (Java 21, `--preview` en 21, estable en 23+) o mantener ThreadLocal con cuidado explícito en `clear()`.
- **No activar Virtual Threads sin revisar este punto primero.**

Hikari con Virtual Threads: reducir `maximum-pool-size` a ~20 (VTs no bloquean el OS thread, el cuello de botella pasa a ser la DB).

---

## Implementar un módulo nuevo — pasos concretos

El scaffolding de paquetes ya existe. Para implementar (ej. `task_execution`):

### 1. Entidad JPA (`infrastructure/persistence/`)
```java
@Entity
@Table(name = "task_executions")
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = UUIDJavaType.class))
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
public class TaskExecutionJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    // ... resto de campos

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt;
}
```

### 2. Migración Flyway
Archivo: `V00N__descripcion_snake_case.sql`
```sql
CREATE TABLE task_executions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL,
  -- campos específicos
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ
);

CREATE INDEX idx_task_executions_tenant_id ON task_executions(tenant_id);
CREATE INDEX idx_task_executions_tenant_status ON task_executions(tenant_id, status);
```

### 3. Repositorio JPA (`infrastructure/persistence/`)
```java
public interface JpaTaskExecutionRepository extends JpaRepository<TaskExecutionJpaEntity, UUID> {
    List<TaskExecutionJpaEntity> findByTenantIdAndScheduledDate(UUID tenantId, LocalDate date);
}
```

### 4. Interfaz de repositorio de dominio (`domain/`)
```java
public interface TaskExecutionRepository {
    TaskExecution save(TaskExecution execution);
    Optional<TaskExecution> findById(UUID tenantId, UUID id);
    List<TaskExecution> findByDate(UUID tenantId, LocalDate date);
}
```

### 5. Implementación (`infrastructure/persistence/`)
```java
@Repository
public class TaskExecutionRepositoryImpl implements TaskExecutionRepository {
    private final JpaTaskExecutionRepository jpaRepository;
    private final TaskExecutionMapper mapper;

    // Siempre validar tenantId explícitamente además del filtro Hibernate
    @Override
    public Optional<TaskExecution> findById(UUID tenantId, UUID id) {
        return jpaRepository.findById(id)
            .filter(e -> e.getTenantId().equals(tenantId))
            .map(mapper::toDomain);
    }
}
```

### 6. Servicio de aplicación (`application/`)
```java
@Service
@Transactional
public class TaskExecutionService {
    // Obtener tenantId siempre del contexto — nunca del parámetro del controller
    private UUID currentTenantId() {
        return TenantContext.getTenantId();
    }
}
```

### 7. Controller (`api/`)
```java
@RestController
@RequestMapping("/api/v1/task-executions")
@Validated
public class TaskExecutionController {
    // Los controllers son delgados: validar, delegar al service, mapear response
    // Sin lógica de negocio aquí
}
```

---

## Excepciones de dominio — patrón a seguir

Agregar en `shared/exception/` o en el paquete del módulo:
```java
// Excepción base de dominio (no checked)
public abstract class SanitIADomainException extends RuntimeException {
    private final String code;
    public SanitIADomainException(String code, String message) {
        super(message);
        this.code = code;
    }
    public String getCode() { return code; }
}

// Excepción específica
public class TaskAlreadyCompletedException extends SanitIADomainException {
    public TaskAlreadyCompletedException(UUID taskId) {
        super("TASK_ALREADY_COMPLETED", "La tarea %s ya fue completada".formatted(taskId));
    }
}
```

Registrar en `GlobalExceptionHandler`:
```java
@ExceptionHandler(SanitIADomainException.class)
public ResponseEntity<ErrorResponse> handleDomain(SanitIADomainException ex) {
    return ResponseEntity.unprocessableEntity()
        .body(new ErrorResponse(ex.getCode(), ex.getMessage(), Instant.now()));
}
```

---

## Tests — patrones de este proyecto

### Test de integración con Testcontainers (patrón base)
```java
@SpringBootTest
@Testcontainers
@ActiveProfiles("test")
class TaskExecutionRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16")
        .withDatabaseName("sanitia_test")
        .withUsername("sanitia")
        .withPassword("sanitia_test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    void tenantIsolation_tenantACannotAccessTenantBData() {
        UUID tenantA = UUID.randomUUID();
        UUID tenantB = UUID.randomUUID();
        // Crear datos para tenantB
        // Consultar con contexto de tenantA
        // Verificar que el resultado es vacío
    }
}
```

### Test de controller con MockMvc
```java
@WebMvcTest(TaskExecutionController.class)
class TaskExecutionControllerTest {
    @Autowired MockMvc mockMvc;
    @MockBean TaskExecutionService service;

    @Test
    void execute_returnsCreated_whenValidRequest() throws Exception {
        mockMvc.perform(post("/api/v1/task-executions")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"taskId": "...", "checklistItems": [...]}
                    """))
            .andExpect(status().isCreated());
    }
}
```

---

## Configuración AWS local (dev)

Para desarrollo local **sin** credenciales AWS reales, usar el perfil `dev` que configura LocalStack o deshabilita los clientes AWS. Ver `application-dev.yml`.

URLs S3 firmadas: siempre con expiración de 15 minutos (`sanitia.aws.s3.presigned-url-expiration-minutes=15`). No cambiar este valor sin revisar la política de seguridad.

---

## MapStruct — convenciones

```java
@Mapper(componentModel = "spring")
public interface TaskExecutionMapper {
    TaskExecution toDomain(TaskExecutionJpaEntity entity);
    TaskExecutionJpaEntity toJpaEntity(TaskExecution domain);
    TaskSummaryResponse toResponse(TaskExecution domain);
}
```

Lombok + MapStruct: el orden de annotation processors en `build.gradle.kts` importa. Ya configurado correctamente con `lombok-mapstruct-binding`.
