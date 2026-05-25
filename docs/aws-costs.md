# SanitIA — Estimación de costos AWS

Referencia de costos por ambiente y fase de crecimiento. Actualizar cuando cambie la configuración de infraestructura o los umbrales de escala.

> **Última revisión**: mayo 2026 — alineado con Plan de Implementación v2.
> **Región de referencia**: `us-east-1` (Virginia). Los precios en `sa-east-1` (São Paulo) son ~15–20 % más altos; usar esa región si latencia colombiana es crítica.

---

## Arquitectura MVP (Fase 1 — 0 a 100 tenants)

```
Internet
    │
CloudFront                          ← CDN + URLs firmadas S3
    ├── S3 (frontend React PWA)     ← hosting estático
    └── API Gateway HTTP API        ← sin ALB, ahorra ~$20/mes
              │
          ECS Fargate
          Spring Boot 3.x
          0.5 vCPU / 1 GB RAM      ← sizing suficiente para < 100 tenants
          @Scheduled (jobs)         ← sin EventBridge en Fase 1
              │
          RDS PostgreSQL
          db.t4g.micro, Single-AZ   ← ~87 conexiones, 500+ QPS
              │
          S3 evidencias             ← upload directo cliente→S3 (URL prefirmada)
          Intelligent-Tiering       ← sin carga en el servidor
              │
          SQS → SES                 ← reportes PDF y notificaciones async
              │
          Cognito                   ← auth JWT (gratuito hasta 50k MAU)
              │
          Secrets Manager           ← credenciales DB y claves
          CloudWatch                ← logs y métricas
```

**Lo que no está en Fase 1:**
- ~~EventBridge Scheduler~~ → `@Scheduled` de Spring es suficiente para < 100 tenants
- ~~ALB~~ → API Gateway HTTP ahorra ~$20/mes
- ~~NAT Gateway~~ → ECS en subnet pública + VPC Endpoint S3 gratuito
- ~~ElastiCache Redis~~ → sin evidencia de necesidad con < 100 tenants
- ~~Aurora~~ → RDS PostgreSQL db.t4g.micro hasta que haya > 100 tenants activos

---

## Desarrollo / Staging

Ambiente del desarrollador. Sin tráfico real, sin SLA.

| Servicio | Configuración | Costo/mes |
|---|---|---|
| ECS Fargate **Spot** | 0.25 vCPU / 0.5 GB, 730 h | ~$2 |
| RDS PostgreSQL | db.t4g.micro, Single-AZ, 20 GB gp3 | ~$15 |
| S3 evidencias | < 5 GB (datos de prueba) | ~$0 |
| S3 frontend | Hosting estático | ~$0 |
| CloudFront | Free Tier (1 TB) | ~$0 |
| API Gateway HTTP | Free Tier (1 M req/mes) | ~$0 |
| Cognito | < 50 k MAU — Free Tier | ~$0 |
| SES | Free Tier (< 1 k emails/mes) | ~$0 |
| SQS | Free Tier (< 1 M mensajes/mes) | ~$0 |
| ECR | < 500 MB imagen — Free Tier | ~$0 |
| Secrets Manager | 3 secrets × $0.40 | ~$1 |
| CloudWatch | Logs básicos (5 GB Free Tier) | ~$1 |
| **TOTAL** | | **~$19/mes** |

> Fargate Spot puede ser interrumpido. Aceptable en desarrollo; nunca en producción sin fallback.

---

## MVP productivo — Fase 1 (1–20 tenants)

Primer despliegue con clientes reales. La misma arquitectura de dev pero correctamente dimensionada y con mayor disponibilidad.

### Con Fargate Spot + fallback On-Demand (recomendado al inicio)

| Servicio | Configuración | Costo/mes |
|---|---|---|
| ECS Fargate | 0.5 vCPU / 1 GB — Spot con fallback On-Demand | ~$8 |
| RDS PostgreSQL | db.t4g.micro, Single-AZ, 20 GB gp3 | ~$15 |
| S3 evidencias | ~5 GB/mes nuevos · Intelligent-Tiering | ~$1 |
| S3 frontend | Hosting estático | ~$0 |
| CloudFront | ~100 GB transferencia | ~$1 |
| API Gateway HTTP | ~300 k req/mes | ~$1 |
| Cognito | < 50 k MAU — Free Tier | ~$0 |
| SES | ~2 k emails/mes | ~$0 |
| SQS | ~200 k mensajes/mes | ~$0 |
| Secrets Manager | 4–5 secrets | ~$2 |
| CloudWatch | Logs + 3 alarmas críticas | ~$2 |
| **TOTAL** | | **~$30/mes** |

### Con Fargate On-Demand puro (cuando haya SLA con clientes)

| Servicio | Configuración | Costo/mes |
|---|---|---|
| ECS Fargate | 0.5 vCPU / 1 GB — On-Demand, 730 h | ~$18 |
| RDS PostgreSQL | db.t4g.micro, Single-AZ, 20 GB gp3 | ~$15 |
| S3 + CloudFront + API GW | igual que arriba | ~$3 |
| SES + SQS + Cognito | igual que arriba | ~$0 |
| Secrets Manager + CloudWatch | igual que arriba | ~$4 |
| **TOTAL** | | **~$40/mes** |

> **Recomendación**: empezar con Spot + fallback. Migrar a On-Demand puro cuando el primer cliente pague mes completo y exija disponibilidad garantizada.

### Estimación de crecimiento de almacenamiento S3 (MVP)

```
20 tenants × 5 áreas × 3 tareas/día × 50 % con foto × 500 KB = 75 MB/día
→ 2.25 GB/mes de evidencias nuevas
→ Acumulado al año: ~27 GB

Con Intelligent-Tiering:
  Mes actual (activo):    2.25 GB × $0.023  = $0.05/mes
  Meses anteriores (IA):  resto × $0.0125   = despreciable
→ Costo S3 primer año: < $1/mes
```

---

## Crecimiento — Fase 1 (20–100 tenants)

La misma arquitectura monolítica, solo se incrementa el sizing de los servicios existentes. **Sin cambios de arquitectura.**

| Servicio | Configuración | Costo/mes |
|---|---|---|
| ECS Fargate | 0.5 vCPU / 1 GB — On-Demand | ~$18 |
| RDS PostgreSQL | db.t4g.small, Single-AZ, 50 GB gp3 | ~$30 |
| S3 evidencias | ~10 GB/mes nuevos · Intelligent-Tiering | ~$3 |
| S3 frontend | Hosting estático | ~$0 |
| CloudFront | ~500 GB transferencia | ~$5 |
| API Gateway HTTP | ~2 M req/mes | ~$2 |
| Cognito | < 50 k MAU — Free Tier | ~$0 |
| SES | ~10 k emails/mes | ~$1 |
| SQS | ~1 M mensajes/mes | ~$0 |
| Secrets Manager | 6 secrets | ~$2 |
| CloudWatch | Logs + alarmas + dashboard | ~$5 |
| **TOTAL** | | **~$66/mes** |

> En este rango el stack no necesita Redis, réplicas de lectura ni Lambdas. La señal de alerta es: p95 de "tareas del día" > 200 ms de forma sostenida en CloudWatch.

### Estimación de almacenamiento S3 (100 tenants)

```
100 tenants × 5 áreas × 3 tareas/día × 50 % con foto × 500 KB = 375 MB/día
→ 11 GB/mes de evidencias nuevas
→ Acumulado al año: ~132 GB (con retención 2 años regulatoria)

Con Intelligent-Tiering:
  Meses recientes (activo): 11 GB × $0.023  = $0.25/mes
  Meses anteriores (IA):    121 GB × $0.0125 = $1.51/mes
→ Costo S3 al final del primer año: ~$1.76/mes
→ Costo S3 al final del segundo año: ~$3.50/mes
```

---

## Fase 2 — Workers extraídos (100–300 tenants)

Se extrae la generación de PDFs y el processing pesado a Lambdas. Se agrega réplica de lectura para reportes. Amazon Bedrock para AI de extracción de documentos.

| Servicio | Configuración | Costo/mes |
|---|---|---|
| ECS Fargate | 1 vCPU / 2 GB — On-Demand | ~$36 |
| RDS PostgreSQL | db.t4g.small, + réplica lectura | ~$60 |
| Lambda (PDF, evidencias) | ~1 M invocaciones/mes | ~$5 |
| Amazon Bedrock | Extracción AI de documentos POE | ~$20–50 |
| S3 evidencias | ~30 GB/mes · Intelligent-Tiering | ~$8 |
| CloudFront | 2 TB transferencia | ~$10 |
| API Gateway + SQS + SES | tráfico incrementado | ~$8 |
| Secrets Manager + CloudWatch | más secrets + dashboards | ~$10 |
| **TOTAL** | | **~$160–200/mes** |

> No avanzar a esta fase sin métricas que lo justifiquen. Condición de avance: p95 API > 200 ms sostenido **O** job `@Scheduled` compite con tráfico de API bajo carga medida.

---

## Fase 3 — Servicios especializados (> 300 tenants)

| Servicio | Configuración aproximada | Costo/mes |
|---|---|---|
| ECS Fargate | 2 vCPU / 4 GB × 2 tareas | ~$144 |
| RDS PostgreSQL | db.t4g.medium, Multi-AZ + 2 réplicas | ~$200 |
| ElastiCache Redis | cache.t4g.micro | ~$14 |
| OpenSearch | índice para RAG de procedimientos | ~$30 |
| Lambda + Bedrock | AI avanzada | ~$60–100 |
| S3 + CloudFront | escala alta | ~$30 |
| Otros (SQS, SES, CloudWatch, WAF) | | ~$40 |
| **TOTAL** | | **~$520–560/mes** |

---

## Comparativo de fases

| Fase | Tenants | Costo infra/mes | Ingreso mínimo recomendado |
|---|---|---|---|
| **Desarrollo** | 0 | ~$19 | — |
| **MVP (Spot)** | 1–20 | ~$30 | > $30/mes = 1 tenant pagando |
| **MVP (On-Demand)** | 1–20 | ~$40 | > $40/mes = 1 tenant pagando |
| **Crecimiento Fase 1** | 20–100 | ~$66 | > $66/mes = 2 tenants pagando |
| **Fase 2** | 100–300 | ~$200 | > $200/mes = 5 tenants pagando |
| **Fase 3** | > 300 | ~$540 | > $540/mes = 13 tenants pagando |

> La infraestructura de SanitIA es rentable desde el **primer tenant**. El costo por tenant cae drásticamente con escala.

---

## Decisiones de ahorro vigentes

### Sin ALB → API Gateway HTTP API
Ahorro: **~$20/mes fijo**. API Gateway HTTP es más barato y suficiente para el monolito. Sin target groups ni listeners que gestionar.

### Sin NAT Gateway en dev/staging
Ahorro: **~$32–45/mes**. ECS tasks en subnet pública. VPC Endpoint Gateway para S3 (gratuito, configurar siempre). En producción, evaluar si los VPC Endpoints de interfaz para SQS y ECR justifican su costo (~$7/mes c/u).

### Sin EventBridge Scheduler en Fase 1
Ahorro: **$0–1/mes** (era casi gratuito) pero **simplificación arquitectural significativa**. Spring `@Scheduled` corre el job de generación de tareas cada hora. Con < 100 tenants y ~20.000 ScheduleRules, tarda < 5 segundos. Agregar EventBridge solo si el job compite mediblemente con el tráfico del API.

### Fargate Spot en desarrollo
Ahorro: **~70 %** sobre On-Demand. Interrupciones aceptables en desarrollo. No usar en producción sin capacity provider con fallback a On-Demand configurado.

### RDS Single-AZ en dev y MVP
Ahorro: **~50 % del costo RDS**. En producción, Multi-AZ cuando el cliente pague y el tiempo de failover (< 2 min) sea inaceptable.

### S3 Intelligent-Tiering desde el inicio
Activar lifecycle rule desde el primer día. Fotos > 30 días pasan a Standard-IA ($0.0125/GB vs $0.023/GB). A largo plazo con retención de 2 años, el ahorro es significativo.

### Sin Aurora en Fase 1
Aurora Serverless v2 mínimo ~$40/mes base. RDS db.t4g.micro a $15/mes es suficiente hasta > 100 tenants activos o necesidad real de read replicas. No migrar por especulación.

### Sin Redis en Fase 1
ElastiCache cache.t4g.micro cuesta ~$14/mes. Con los índices correctos en PostgreSQL, la consulta "tareas del día" corre en < 20 ms para 100 tenants. Agregar Redis cuando p95 > 200 ms, no antes.

---

## Configuración de alertas de costo (CloudWatch Budgets)

Configurar desde el día 1 para evitar sorpresas:

```
Budget 1 — Desarrollo
  Límite: $30/mes
  Alerta al 80 %: email al desarrollador

Budget 2 — Producción MVP
  Límite: $60/mes
  Alerta al 80 %: email al responsable técnico
  Alerta al 100 %: email + Slack

Budget 3 — Anomalía diaria
  Si el gasto diario supera 2× el promedio de los últimos 7 días
  Alerta inmediata: puede indicar loop infinito en generación de tareas
  o tráfico inesperado
```

---

## VPC Endpoints — cuándo activar

| Endpoint | Tipo | Costo | Activar en |
|---|---|---|---|
| S3 Gateway | Gateway | Gratuito | **Siempre** — desde el inicio |
| SQS Interface | Interface | ~$7/mes | Producción con > 50 tenants |
| ECR API Interface | Interface | ~$7/mes | Producción, si costo NAT supera este valor |
| ECR DKR Interface | Interface | ~$7/mes | Ídem |
| Secrets Manager Interface | Interface | ~$7/mes | Producción |
