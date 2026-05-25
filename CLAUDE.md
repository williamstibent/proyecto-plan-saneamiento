# SanitIA — Guía de desarrollo

Plataforma SaaS B2B multi-tenant para digitalizar planes de saneamiento sanitario en Colombia, según Resolución 2674 de 2013 (INVIMA/ICA). Convierte documentos POE en operación digital diaria con checklists, evidencias fotográficas, trazabilidad y reportes.

---

## Arquitectura general

### MVP — Monolito modular + eventos (Fase 1)

```
React PWA (TypeScript + Vite)
        │
CloudFront + S3 (hosting estático)
        │
API Gateway HTTP (sin ALB para reducir costos)
        │
ECS Fargate (Spring Boot 3.x — contenedor único)
        │
RDS PostgreSQL db.t4g.micro (Single-AZ en dev)
        │
S3 (evidencias fotográficas)
        │
SQS + EventBridge (notificaciones y reportes async)
        │
SES (email) + Cognito (auth)
```

### Principio de diseño central

**Monolito modular primero, microservicios solo si hay evidencia de necesidad.** Los módulos internos tienen fronteras claras pero se despliegan juntos. Partir en microservicios antes de escalar es deuda técnica prematura.

### Módulos del backend

```
identity/          → usuarios, roles, permisos, JWT
tenancy/           → tenants, establecimientos, configuración
establishments/    → sedes, pisos, áreas, activos, plano
sanitation-plans/  → programas, procedimientos, versiones, POE
scheduling/        → reglas de frecuencia, generación de tareas
task-execution/    → ejecución de checklist, estado, firma
evidence/          → fotos, metadata, validación básica
notifications/     → alertas por tarea, email via SES
reports/           → cumplimiento, PDF mensual
audit/             → log inmutable de acciones
```

**No crear módulos**: `ai-assistant/` en MVP Fase 1. Se agrega en Fase 2.

---

## Stack tecnológico

### Backend
| Necesidad | Elección |
|---|---|
| Framework | Spring Boot 3.x (Java 21 LTS) |
| Seguridad | Spring Security + OAuth2 Resource Server |
| Persistencia | Spring Data JPA + Hibernate |
| Migraciones | Flyway |
| Validación | Jakarta Validation (Bean Validation 3) |
| Jobs | Spring Scheduler (MVP) → EventBridge Scheduler (producción) |
| Eventos | Spring Cloud AWS + AWS SDK v2 |
| PDF | OpenPDF |
| Mapeo DTO | MapStruct |
| Tests | JUnit 5 + Testcontainers + AssertJ |
| Auditoría | Tablas propias (no Envers — más control) |

### Frontend
| Necesidad | Elección |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| State server | TanStack Query v5 |
| State cliente | Zustand |
| Formularios | React Hook Form + Zod |
| UI | shadcn/ui + Tailwind CSS v4 |
| Mapa plano | react-konva (SVG/Canvas sobre imagen) |
| PWA | Vite PWA plugin + Workbox |
| Testing | Vitest + Testing Library |

### AWS (infraestructura)
| Servicio | Uso |
|---|---|
| ECS Fargate | Contenedor Spring Boot |
| RDS PostgreSQL | Base de datos principal (db.t4g.micro) |
| S3 | Evidencias fotográficas y hosting frontend |
| CloudFront | CDN para frontend y URLs firmadas S3 |
| API Gateway HTTP | Entry point del backend (sin ALB) |
| Cognito | Autenticación y tokens JWT |
| SQS | Cola para reportes y notificaciones async |
| EventBridge | Scheduler para tareas recurrentes |
| SES | Email transaccional |
| CloudWatch | Logs y métricas |
| Secrets Manager | Credenciales DB y API keys |
| ECR | Registro de imágenes Docker |

### IaC
Terraform con módulos reutilizables. Un workspace por ambiente (`dev`, `staging`, `prod`).

---

## Clean code — reglas no negociables

### Nombrado

- Nombres que revelan intención: `findPendingTasksByTenantAndDate` no `getTasks2`.
- Sin abreviaciones: `tenant` no `tnt`, `procedure` no `proc`, `execution` no `exec`.
- Clases: sustantivos (`TaskExecution`, `ProcedureVersion`).
- Métodos: verbos (`execute`, `publish`, `generateReport`).
- Booleanos: `isCompleted`, `hasEvidence`, `isExpired`.

### Funciones y métodos

- Una responsabilidad por función. Si hay "y" en el nombre, dividir.
- Máximo 3 parámetros. Más → crear un objeto de comando o request.
- No pasar `boolean` como parámetro de control de flujo — señal de que debe ser dos métodos.
- Profundidad de anidamiento máxima: 2 niveles. Usar *early return* para reducir.

```java
// MAL
public void processTask(Task task, boolean isForce) {
    if (!isForce) {
        if (task.isExpired()) {
            throw new TaskExpiredException();
        }
    }
    // ...
}

// BIEN
public void processTask(Task task) {
    validateNotExpired(task);
    // ...
}

public void forceProcessTask(Task task) {
    // ...
}
```

### Clases

- Principio de responsabilidad única (SRP).
- Favorecer composición sobre herencia.
- Cada clase <= 200 líneas como señal de alerta (no ley rígida).
- No `static` utility classes — preferir servicios inyectables y testeables.

### Comentarios

- Código bueno no necesita comentarios que expliquen *qué* hace.
- Solo comentar *por qué*: restricciones no obvias, workarounds, invariantes de negocio.
- Nunca comentar código muerto — eliminarlo. Git guarda el historial.

### Errores y excepciones

- Nunca retornar `null` — usar `Optional<T>` en Java.
- Excepciones de dominio con nombres claros: `TenantIsolationViolationException`, `TaskAlreadyCompletedException`.
- No capturar excepciones genéricas (`catch (Exception e)`) salvo en el handler global.
- Un `GlobalExceptionHandler` centralizado que mapea excepciones a respuestas HTTP consistentes.

---

## Convenciones backend (Spring Boot)

### Estructura de paquetes por módulo

```
com.sanitia.{module}/
  api/
    {Module}Controller.java
    dto/
      {Entity}Request.java
      {Entity}Response.java
  application/
    {Module}Service.java
    {Module}UseCase.java        ← interfaces de casos de uso
  domain/
    {Entity}.java
    {Entity}Repository.java     ← interfaz (puerto)
    {Entity}DomainService.java  ← lógica de dominio pura
  infrastructure/
    persistence/
      Jpa{Entity}Repository.java
      {Entity}JpaEntity.java    ← entidad JPA separada del dominio
    aws/
      S3EvidenceStorage.java
      SqsNotificationPublisher.java
```

### Multi-tenancy — reglas obligatorias

Toda entidad de negocio debe tener `tenantId`. Sin excepción.

```java
// Filtro global de Hibernate — activar en TODOS los repositorios
@FilterDef(name = "tenantFilter", parameters = @ParamDef(name = "tenantId", type = UUID.class))
@Filter(name = "tenantFilter", condition = "tenant_id = :tenantId")
```

- Validar `tenantId` en cada service antes de cualquier operación. No confiar solo en el filtro.
- Tests de aislamiento de tenants son obligatorios — un usuario de tenant A no puede ver datos de tenant B.
- Índices compuestos `(tenant_id, id)` en todas las tablas principales.

### API REST

- Versionado en path: `/api/v1/...`
- Recursos en plural y minúsculas: `/api/v1/task-executions`
- Sin verbos en paths — los HTTP methods expresan la acción.
- Respuestas paginadas con estructura consistente:

```json
{
  "data": [...],
  "pagination": {
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8
  }
}
```

- Errores con estructura consistente:

```json
{
  "code": "TASK_ALREADY_COMPLETED",
  "message": "La tarea ya fue completada",
  "timestamp": "2025-05-16T10:30:00Z"
}
```

### Seguridad

- JWT con claims: `tenantId`, `userId`, `roles`, `permissions`.
- Validar `tenantId` del token contra `tenantId` del recurso en *cada* operación.
- URLs S3 firmadas con expiración corta (15 min) — nunca URLs públicas permanentes.
- Nunca logear tokens, passwords, ni contenido de fotos.
- Secrets solo via Secrets Manager o Variables de entorno — jamás en código o repositorio.

### Auditoría

Tabla `audit_log` inmutable (solo INSERT, nunca UPDATE/DELETE):

```sql
CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL,
  user_id     UUID NOT NULL,
  action      VARCHAR(100) NOT NULL,  -- TASK_EXECUTED, PROCEDURE_PUBLISHED
  entity_type VARCHAR(100) NOT NULL,
  entity_id   UUID NOT NULL,
  payload     JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Versionamiento de procedimientos

Cada ejecución de checklist referencia la versión exacta del procedimiento vigente al momento de ejecución. La versión nunca se modifica — solo se crea una nueva y se desactiva la anterior.

---

## Convenciones frontend (React/TypeScript)

### Estructura de carpetas

```
src/
  features/
    tasks/
      components/
      hooks/
      api/
      types.ts
    procedures/
    evidence/
    reports/
  shared/
    components/
    hooks/
    lib/
    types/
  app/
    routes/
    providers/
    layout/
```

### Reglas TypeScript

- `strict: true` siempre. Sin `any` — usar `unknown` y hacer narrowing.
- Tipos de dominio en `types.ts` por feature, no mezclados con componentes.
- Zod para validación de formularios y parsing de respuestas API.

### Componentes

- Componentes de presentación (UI pura) separados de componentes de lógica.
- Custom hooks para lógica reutilizable — no duplicar `useQuery` con los mismos params.
- Props con tipos explícitos — sin `React.FC` (innecesario en React 19).
- Formularios siempre via React Hook Form — no estado manual con `useState`.

### Acceso a API

- Todo via TanStack Query. Sin `useEffect` + `fetch` manual.
- Invalidación de caché explícita tras mutaciones (`queryClient.invalidateQueries`).
- Manejo de errores centralizado en el `QueryClient` global.

### Multi-tenant en frontend

- El `tenantId` viaja en el JWT — nunca almacenado por separado en localStorage.
- Interceptor Axios/fetch que adjunta el token en cada request.

---

## Base de datos

### Convenciones

- Nombres de tablas en `snake_case`, plural: `task_executions`, `procedure_versions`.
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()` en todas las tablas.
- `created_at TIMESTAMPTZ DEFAULT now()` y `updated_at TIMESTAMPTZ` en todas las tablas.
- `tenant_id UUID NOT NULL` en todas las tablas de negocio.
- Flyway para migraciones: `V001__init_schema.sql`, `V002__add_audit_log.sql`.
- Sin lógica de negocio en stored procedures — solo en la aplicación.

### Índices obligatorios

```sql
-- Por tenant (en todas las tablas de negocio)
CREATE INDEX idx_{table}_tenant_id ON {table}(tenant_id);

-- Búsquedas frecuentes
CREATE INDEX idx_task_instances_tenant_date ON task_instances(tenant_id, scheduled_date);
CREATE INDEX idx_task_executions_tenant_status ON task_executions(tenant_id, status);
CREATE INDEX idx_evidence_task_id ON evidence(task_execution_id);
```

### Multi-tenant: Row Level Security (opcional en producción)

```sql
ALTER TABLE task_executions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON task_executions
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

---

## Testing

### Pirámide de tests

1. **Unit tests** — lógica de dominio pura (`*DomainService`, validaciones, cálculos).
2. **Integration tests** — repositorios con Testcontainers PostgreSQL real. Sin mocks de DB.
3. **API tests** — endpoints con Spring Boot Test + TestRestTemplate/MockMvc.
4. **E2E** — flujos críticos con Playwright (MVP: solo smoke tests).

### Cobertura mínima

- Aislamiento multi-tenant: test obligatorio que verifica que tenant A no accede a datos de tenant B.
- Checklist execution: test del flujo completo (crear tarea → ejecutar → adjuntar evidencia → validar supervisor).
- Generación de tareas por frecuencia: tests para cada tipo (diaria, semanal, mensual).

### Regla: Testcontainers, no mocks de DB

```java
// BIEN — base de datos real
@SpringBootTest
@Testcontainers
class TaskExecutionRepositoryTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");
}

// MAL — mock de JPA oculta problemas reales
@MockBean
JpaTaskExecutionRepository repository;
```

---

## AWS — Decisiones de infraestructura

Estimaciones detalladas y tablas de costos por ambiente: ver [docs/aws-costs.md](docs/aws-costs.md).

Decisiones que afectan el código y la arquitectura:

- **Sin ALB** → API Gateway HTTP API. No configurar target groups ni listeners de ALB.
- **Sin NAT Gateway en dev/staging** → ECS tasks en subnet pública. VPC Endpoint Gateway para S3 (gratuito, configurar siempre).
- **RDS Single-AZ en dev/staging** → `multi_az = false` en Terraform para dev. Solo `true` en prod.
- **Fargate Spot en dev/staging** → aceptable; configurar `FARGATE_SPOT` en capacity provider strategy.
- **Sin Aurora en MVP** → RDS PostgreSQL puro. Migrar solo cuando haya evidencia de necesidad (> 100 tenants o read replicas reales).
- **S3 Intelligent-Tiering** en bucket de evidencias → activar lifecycle rule desde el inicio.

---

## Seguridad — checklist obligatorio

- [ ] `tenant_id` en todas las entidades de negocio.
- [ ] Filtro global Hibernate por `tenant_id` activado.
- [ ] Validación explícita de `tenant_id` en cada service (doble verificación).
- [ ] JWT con `tenantId`, `userId`, `roles` — firmado por Cognito.
- [ ] URLs S3 firmadas (máximo 15 min) — nunca URLs públicas.
- [ ] Secrets via Secrets Manager — cero hardcoding.
- [ ] HTTPS forzado en todos los endpoints.
- [ ] CORS restrictivo — solo orígenes permitidos.
- [ ] Rate limiting en API Gateway.
- [ ] Sin logging de datos sensibles (fotos, tokens, contraseñas).
- [ ] Bucket S3 de evidencias sin acceso público.
- [ ] Cifrado en reposo: RDS y S3 con KMS.

---

## Workflow de desarrollo

### Ramas
```
main          → producción
develop       → integración
feature/{name} → desarrollo de features
hotfix/{name} → fixes urgentes en producción
```

### Antes de cada PR

1. `./gradlew test` — todos los tests pasan.
2. Testcontainers corre tests de aislamiento multi-tenant.
3. Flyway migrations corren sin error sobre DB limpia.
4. `npm run type-check` — sin errores TypeScript.
5. `npm run lint` — sin errores ESLint.

### Variables de entorno (nunca en código)

```
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
AWS_REGION
S3_EVIDENCE_BUCKET
COGNITO_USER_POOL_ID
COGNITO_CLIENT_ID
```

---

## MVP Fase 1 — Alcance estricto

**Incluye:**
- Autenticación con Cognito (login, roles: admin-plataforma, admin-cliente, operario, supervisor, auditor).
- Multi-tenant básico con `tenant_id` en todas las entidades.
- Gestión de clientes, establecimientos, pisos, áreas.
- Carga manual de procedimientos (sin AI aún).
- Constructor de checklists por procedimiento.
- Programación de tareas por frecuencia (diaria, semanal, mensual, etc.).
- Vista diaria de tareas del operario.
- Ejecución de checklist con foto y observaciones.
- Validación del supervisor.
- Dashboard básico de cumplimiento por área.
- Reporte PDF mensual simple.
- Notificaciones por email (SES) para tareas vencidas.
- Plano del establecimiento con áreas clicables (imagen + polígonos react-konva).

**No incluye en Fase 1:**
- Extracción AI de documentos DOCX/PDF.
- Asistente operativo conversacional.
- No conformidades y acciones correctivas avanzadas.
- WhatsApp.
- Offline-first / React Native.
- Row Level Security de PostgreSQL (se agrega si hay evidencia de necesidad).

---

## Consideraciones de dominio colombiano

- La Resolución 2674 de 2013 exige 4 programas mínimos: agua potable, residuos sólidos, control de plagas, limpieza y desinfección.
- Cada ejecución de checklist debe quedar vinculada a la **versión vigente del POE** al momento de ejecución (trazabilidad de auditoría).
- El sistema NO publica procedimientos — solo el admin-cliente o consultor sanitario puede hacerlo.
- Toda evidencia sin contexto (área, tarea, usuario, timestamp) es evidencia inválida para inspección INVIMA.
- El historial de registros es **inmutable** — nunca se eliminan ejecuciones, solo se anulan con registro.
