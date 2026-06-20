## 1. Entendimiento del problema

El producto no debería ser simplemente una app de “checklists”. Debe ser una **plataforma de cumplimiento sanitario operativo**, multi-cliente, orientada a evidencias, trazabilidad y mejora continua.

En Colombia, la Resolución 2674 de 2013 exige que los establecimientos que fabriquen, procesen, envasen, almacenen o expendan alimentos implementen un **Plan de Saneamiento** escrito, disponible para la autoridad sanitaria, con objetivos, procedimientos, cronogramas, registros, listas de chequeo y responsables. El plan debe incluir como mínimo programas de **limpieza y desinfección, residuos sólidos, control de plagas y abastecimiento de agua potable**. 

Tu ejemplo de ArtesaPan confirma este patrón: el documento se centra en el programa de **Limpieza y Desinfección**, tiene codificación POE-LYD/RPOE-LYD, áreas físicas, superficies, equipos, responsables, frecuencia, productos químicos, dosificaciones, tiempos de contacto, acciones preliminares, pasos de limpieza/desinfección, observaciones y registros diarios. 

Para carnes y derivados cárnicos, INVIMA también habla de programas sanitarios como calidad del agua, operaciones sanitarias, POES, control integrado de plagas, manejo de residuos sólidos/líquidos y capacitación del personal manipulador; además, los programas deben ajustarse a las particularidades del establecimiento. 

---

## 2. Producto propuesto

### Nombre conceptual

**SanitIA** o **Saneamiento360**

### Objetivo

Digitalizar, operar y auditar planes de saneamiento por cliente, establecimiento, área, equipo y procedimiento, generando trazabilidad diaria y reportes para administradores, consultores sanitarios y autoridades internas.

### Usuarios principales

**Administrador de plataforma**
Gestiona clientes, usuarios, roles, plantillas base, parámetros regulatorios y configuración global.

**Administrador del cliente / consultor sanitario**
Construye o ajusta el plan de saneamiento del establecimiento, define áreas, superficies, equipos, productos químicos, frecuencias, responsables, alertas, formatos y reportes.

**Operario / manipulador**
Consulta qué debe hacer, ejecuta checklist, toma fotos, registra novedades, firma o confirma la actividad.

**Supervisor / responsable de turno**
Verifica cumplimiento, aprueba evidencias, gestiona incumplimientos y acciones correctivas.

**Auditor / solo lectura**
Consulta historial, reportes, evidencias y cumplimiento por periodo.

---

## 3. Módulos funcionales

### 3.1 Gestión multi-cliente y establecimientos

Cada cliente debe tener separación lógica estricta de información:

Cliente → Establecimiento → Sedes → Áreas → Superficies / Equipos → Procedimientos → Tareas programadas → Evidencias.

Ejemplo inspirado en ArtesaPan:

| Nivel             | Ejemplo                                                                |
| ----------------- | ---------------------------------------------------------------------- |
| Cliente           | ArtesaPan                                                              |
| Establecimiento   | Panadería Popayán                                                      |
| Planta            | Primer piso / Segundo piso                                             |
| Área              | Cocina, proceso panificación, empacado, cárnicos, baño, almacenamiento |
| Superficie/equipo | Mesas, pisos, horno, batidora, refrigerador, campana                   |
| Procedimiento     | POE-LYD 02, POE-LYD 05, POE-LYD 014                                    |
| Registro          | Checklist diario con foto, responsable, hora, observación              |

---

### 3.2 Constructor de planes de saneamiento

Debe permitir crear los 4 programas mínimos:

1. **Abastecimiento de agua potable**
2. **Manejo de residuos sólidos y líquidos**
3. **Control integrado de plagas**
4. **Limpieza y desinfección**

La Resolución 2674 exige que el abastecimiento de agua documente fuente o suministro, tratamientos, tanque de almacenamiento, distribución, mantenimiento, limpieza/desinfección de redes y controles realizados. 

Para limpieza y desinfección, la norma pide procedimientos escritos con agentes/sustancias, concentraciones o formas de uso, tiempos de contacto, equipos e implementos requeridos y periodicidad. 

El constructor debería soportar:

| Elemento            | Descripción                                         |
| ------------------- | --------------------------------------------------- |
| Código              | POE-LYD 01, POE-PLG 01, POE-AGUA 01                 |
| Nombre              | Limpieza y desinfección de mesas                    |
| Objetivo            | Qué riesgo mitiga                                   |
| Alcance             | Área, superficie, equipo o proceso                  |
| Responsable         | Operario, supervisor, proveedor externo             |
| Frecuencia          | Diaria, semanal, mensual, después de uso            |
| Insumos             | Detergente, hipoclorito, amonio cuaternario         |
| Dosificación        | ml/litro, ppm, tiempo de contacto                   |
| Pasos               | Limpieza, desinfección, secado                      |
| Evidencia requerida | Foto antes/después, firma, temperatura, observación |
| Checklist           | Ítems marcables                                     |
| Acción correctiva   | Qué hacer si no cumple                              |

---

### 3.3 Mapa interactivo del establecimiento

Este es un diferenciador importante.

El administrador sube o dibuja el plano del lugar. Sobre el mapa se crean zonas clicables:

* Cocina
* Baños
* Almacenamiento
* Empacado
* Proceso de panificación
* Cárnicos
* Cuarto de aseo
* Vestier

Al hacer clic en un área:

1. Se muestran los procedimientos aplicables.
2. Se resaltan tareas pendientes, vencidas y completadas.
3. Se muestra una guía paso a paso.
4. Se permite registrar evidencia.
5. Se muestran productos químicos y dosificaciones.
6. Se muestra historial de cumplimiento del área.

Técnicamente se puede implementar inicialmente con **React + SVG overlay** sobre una imagen/plano. Más adelante se puede evolucionar a editor de planos con drag & drop.

---

### 3.4 Checklists operativos diarios

El sistema debe generar tareas automáticamente según frecuencia:

* “Antes de iniciar jornada”
* “Después de cada uso”
* “Al finalizar jornada”
* “Semanal”
* “Quincenal”
* “Mensual”
* “Trimestral”

Ejemplo basado en ArtesaPan:

| Procedimiento                  | Frecuencia digitalizable                             |
| ------------------------------ | ---------------------------------------------------- |
| Lavado y desinfección de manos | Tantas veces como sea necesario / eventos críticos   |
| Mesas de trabajo               | Antes y después de uso / diario                      |
| Utensilios                     | Antes y después de producción / entre manipulaciones |
| Equipos de frío                | Exterior diario, completo quincenal                  |
| Pisos                          | Diario                                               |
| Paredes                        | Semanal o mensual según área                         |
| Techos                         | Trimestral o mensual según área                      |
| Baños                          | Diario, con reacción inmediata ante riesgo           |

Cada checklist debería registrar:

* Fecha y hora real.
* Usuario ejecutor.
* Área.
* Procedimiento.
* Versión del procedimiento.
* Ítems completados.
* Fotos obligatorias/opcionales.
* Observaciones.
* Geolocalización opcional.
* Firma digital simple.
* Estado: completado, incompleto, rechazado, vencido.
* Supervisor que valida, si aplica.

---

### 3.5 Evidencias fotográficas

Las fotos son clave para demostrar ejecución, detectar patrones y generar confianza.

Recomendaciones:

* Foto antes/después configurable por procedimiento.
* Compresión automática.
* Metadata: usuario, timestamp, área, tarea, cliente.
* Almacenamiento en **Amazon S3**.
* URLs firmadas temporales para consulta.
* Políticas de retención por cliente.
* Versionamiento opcional.
* Detección básica con AI: foto borrosa, foto repetida, falta de superficie esperada, posible evidencia inválida.

---

### 3.6 Alarmas y notificaciones

Tipos de alerta:

| Alerta               | Ejemplo                                              |
| -------------------- | ---------------------------------------------------- |
| Tarea próxima        | “Limpieza de baños vence en 30 minutos”              |
| Tarea vencida        | “POE-LYD016 no ejecutado hoy”                        |
| Evidencia faltante   | “Falta foto después de desinfección”                 |
| Validación pendiente | “Supervisor debe aprobar checklist”                  |
| No conformidad       | “Producto químico usado no corresponde”              |
| Recurrente           | “Área de cocina lleva 3 incumplimientos esta semana” |

Canales:

* Push notification móvil.
* Email.
* WhatsApp vía proveedor externo, si el cliente lo requiere.
* Dashboard interno.

---

### 3.7 Reportes mensuales/trimestrales

El informe debe responder:

1. ¿Se está usando la app?
2. ¿Qué porcentaje de cumplimiento tiene cada área?
3. ¿Qué procesos se vencen más?
4. ¿Qué usuarios ejecutan o incumplen?
5. ¿Qué no conformidades se repiten?
6. ¿Qué evidencias existen?
7. ¿Hubo mejora frente al periodo anterior?

Métricas recomendadas:

| Métrica                       | Descripción                                   |
| ----------------------------- | --------------------------------------------- |
| Cumplimiento global           | Tareas completadas / tareas programadas       |
| Cumplimiento por área         | Cocina, baños, cárnicos, almacenamiento       |
| Cumplimiento por programa     | Agua, residuos, plagas, L&D                   |
| Tareas vencidas               | Cantidad y porcentaje                         |
| Tiempo promedio de ejecución  | Diferencia entre hora programada y completada |
| Evidencias rechazadas         | Fotos inválidas o incompletas                 |
| No conformidades              | Por severidad                                 |
| Acciones correctivas cerradas | Cerradas / abiertas                           |
| Tendencia                     | Comparativo mensual/trimestral                |

El reporte puede generarse como PDF y enviarse automáticamente. También puede tener resumen AI en lenguaje natural: “El área de baños mejoró 12%, pero el procedimiento de residuos sólidos presenta incumplimiento recurrente los viernes”.

---

## 4. Uso de AI recomendado

La AI no debería reemplazar al profesional sanitario, sino acelerar configuración, operación y análisis.

### 4.1 Generación asistida del plan

Entrada:

* Tipo de empresa: panadería, restaurante, lácteos, carnes, colegio, cocina industrial.
* Áreas.
* Equipos.
* Productos manipulados.
* Riesgo del alimento.
* Documento base del cliente, como el POE-LYD de ArtesaPan.

Salida:

* Propuesta de programas.
* Procedimientos POE.
* Checklists.
* Frecuencias.
* Responsables.
* Evidencias requeridas.
* Acciones correctivas sugeridas.

Importante: la AI debe marcar el contenido como **borrador sujeto a revisión del profesional sanitario**.

---

### 4.2 Extracción desde documentos existentes

El caso de ArtesaPan muestra una gran oportunidad: convertir documentos Word/PDF en estructura digital.

Pipeline:

1. Subir DOCX/PDF.
2. Extraer secciones.
3. Identificar códigos POE.
4. Detectar áreas, superficies, equipos, productos, dosificación y frecuencia.
5. Convertir procedimientos en checklist.
6. Pedir revisión humana.
7. Publicar versión digital.

Ejemplo de estructura extraída:

```json
{
  "code": "POE-LYD02",
  "name": "Limpieza y desinfección de mesas de trabajo, consumo, sillas y estantería",
  "frequency": ["diaria", "antes y después de uso", "semanal dosis de choque"],
  "responsible_role": "Manipulador de alimentos",
  "chemicals": [
    {
      "name": "Detergente industrial",
      "dosage": "30 a 50 ml por litro de agua"
    },
    {
      "name": "Amonio cuaternario 5ª generación",
      "dosage": "5 ml por litro de agua",
      "contact_time": "10 minutos"
    }
  ],
  "evidence_required": ["checklist", "foto después", "observación opcional"]
}
```

---

### 4.3 Asistente operativo

En la app, el operario podría preguntar:

* “¿Qué debo hacer para limpiar el horno?”
* “¿Cuánta cantidad de hipoclorito uso para pisos?”
* “¿Qué tareas tengo pendientes hoy?”
* “¿Qué hago si mezclé mal un producto?”
* “¿Cuál es el paso siguiente?”

El asistente debe responder solo con el procedimiento aprobado del cliente y la versión vigente.

---

### 4.4 Análisis de evidencias

AI puede ayudar a detectar:

* Fotos repetidas.
* Fotos oscuras/borrosas.
* Evidencia tomada fuera de horario.
* Evidencia que no corresponde al área.
* Ausencia de foto “antes/después”.
* Posibles incumplimientos recurrentes.

No lo usaría inicialmente como decisión automática sancionatoria, sino como **señal de revisión**.

---

### 4.5 Reportes inteligentes

Generación de resumen ejecutivo:

* Cumplimiento.
* Riesgos.
* Áreas críticas.
* Comparativo con periodo anterior.
* Recomendaciones.
* Priorización de acciones correctivas.

---

## 5. Arquitectura recomendada en AWS

Dado tu perfil Java/Spring/React y despliegue esperado en AWS, propondría una arquitectura modular, no excesivamente distribuida al inicio.

### 5.1 Opción recomendada para MVP: modular monolith + eventos

```text
React / PWA / Mobile
        |
Amazon CloudFront + S3 / Amplify Hosting
        |
Amazon API Gateway / ALB
        |
Spring Boot API modular
        |
PostgreSQL / Aurora PostgreSQL
        |
S3 evidencias
        |
SQS + EventBridge
        |
Workers: reportes, notificaciones, AI extraction
```

### 5.2 Componentes

| Componente     | Recomendación                                                              |
| -------------- | -------------------------------------------------------------------------- |
| Frontend web   | React + TypeScript                                                         |
| Mobile/PWA     | React PWA inicialmente; luego React Native si hay necesidad offline fuerte |
| Backend        | Spring Boot 3.x                                                            |
| Base de datos  | Aurora PostgreSQL o RDS PostgreSQL                                         |
| Archivos/fotos | Amazon S3                                                                  |
| Autenticación  | Amazon Cognito o Keycloak gestionado                                       |
| Multi-tenant   | Tenant ID + Row Level Security o schema-per-tenant según madurez           |
| Jobs           | EventBridge Scheduler + SQS                                                |
| Notificaciones | SNS, SES, Pinpoint o proveedor WhatsApp                                    |
| Reportes PDF   | Worker Java/Kotlin o Lambda                                                |
| AI             | Amazon Bedrock o integración OpenAI/Azure OpenAI                           |
| Búsqueda       | OpenSearch opcional, no necesario en MVP                                   |
| Observabilidad | CloudWatch + OpenTelemetry                                                 |
| IaC            | Terraform o AWS CDK                                                        |

---

## 6. Multi-tenancy y seguridad

Como cada cliente debe ver solo su información, esta parte es crítica.

### Estrategia recomendada para MVP

**Single database, shared schema, tenant_id en todas las tablas**, con controles fuertes:

* `tenant_id` obligatorio en entidades.
* Filtro global en Hibernate.
* Validación en capa de servicio.
* Tests automáticos de aislamiento.
* Índices compuestos por `tenant_id`.
* Opcional: PostgreSQL Row Level Security para defensa adicional.

### Estrategia avanzada

Para clientes grandes o regulados:

* Schema por tenant.
* Base de datos por tenant.
* Bucket/prefix S3 por tenant.
* Llaves KMS separadas.

### Seguridad mínima

* JWT con `tenant_id`, roles y permisos.
* RBAC por rol.
* Auditoría de acciones.
* Versionamiento de procedimientos.
* Historial inmutable de registros.
* Cifrado en tránsito y reposo.
* URLs firmadas para fotos.
* Separación de ambientes dev/staging/prod.

---

## 7. Modelo de dominio inicial

Entidades principales:

```text
Tenant
User
Role
Establishment
Floor
Area
Asset
Procedure
ProcedureVersion
ProcedureStep
ChecklistTemplate
ChecklistItem
ScheduleRule
TaskInstance
TaskExecution
Evidence
ChemicalProduct
DosageRule
NonConformity
CorrectiveAction
Report
Notification
AuditLog
```

### Relación clave

```text
Tenant
 └── Establishment
      └── Area
           └── Asset / Surface / Equipment
                └── ProcedureAssignment
                     └── ScheduleRule
                          └── TaskInstance
                               └── TaskExecution
                                    └── Evidence
```

### Concepto importante: versión del procedimiento

Cuando un operario ejecuta un checklist, el sistema debe guardar contra qué **versión** del procedimiento se ejecutó.

Ejemplo:

* POE-LYD02 v1 vigente hasta agosto.
* POE-LYD02 v2 desde septiembre.
* Los registros antiguos siguen apuntando a v1.

Esto es importante para auditoría.

---

## 8. Stack frontend recomendado

### Web / PWA

* React
* TypeScript
* Vite o Next.js
* TanStack Query
* React Hook Form
* Zod
* Zustand o Redux Toolkit
* Tailwind CSS
* shadcn/ui
* React Flow o SVG.js para mapa/plano
* PWA con Workbox para modo offline básico

### Mapa de áreas

Primera versión:

* Subir imagen del plano.
* Dibujar polígonos sobre la imagen.
* Guardar coordenadas relativas.
* Asociar cada polígono a un área.

Librerías posibles:

* `react-konva`
* `svg.js`
* `react-svg-pan-zoom`
* `fabric.js`

---

## 9. Backend recomendado

### Spring Boot modular

Módulos internos:

```text
identity
tenancy
establishments
sanitation-plans
procedures
scheduling
task-execution
evidence
notifications
reports
ai-assistant
audit
```

### Librerías Java

| Necesidad             | Librería                               |
| --------------------- | -------------------------------------- |
| API REST              | Spring Web                             |
| Seguridad             | Spring Security OAuth2 Resource Server |
| Persistencia          | Spring Data JPA                        |
| Migraciones           | Flyway                                 |
| Validación            | Jakarta Validation                     |
| Jobs internos simples | Spring Scheduler                       |
| Eventos               | Spring Cloud AWS / AWS SDK             |
| PDF                   | OpenPDF, PDFBox o JasperReports        |
| Excel                 | Apache POI                             |
| Documentos DOCX       | Apache POI                             |
| MapStruct             | DTO mapping                            |
| Tests                 | Testcontainers                         |
| Auditoría             | Hibernate Envers o tablas propias      |

---

## 10. Arquitectura AI

### 10.1 Ingesta de documentos

```text
Upload DOCX/PDF
   → S3
   → Document Processing Worker
   → Text extraction
   → Section detection
   → LLM extraction to JSON
   → Human review
   → ProcedureVersion draft
   → Publish
```

### 10.2 Guardrails

* El modelo no publica directamente.
* Todo procedimiento generado queda en estado `DRAFT`.
* Un usuario con rol sanitario/admin debe aprobar.
* Guardar prompt, modelo, fecha y versión generada.
* Comparar cambios entre versiones.

### 10.3 RAG por cliente

Para el asistente operativo:

```text
Pregunta del usuario
   → identificar tenant
   → buscar procedimientos vigentes del tenant
   → recuperar fragmentos relevantes
   → responder con base solo en esos documentos
```

Esto evita que un cliente reciba instrucciones de otro cliente o de una plantilla genérica.

---

## 11. MVP recomendado

### Fase 1 — MVP operativo

Objetivo: digitalizar ejecución diaria.

Incluye:

* Login y roles.
* Multi-tenant básico.
* Clientes, sedes, áreas.
* Carga manual de procedimientos.
* Constructor de checklist.
* Programación de tareas.
* Vista diaria de tareas.
* Evidencias fotográficas.
* Dashboard de cumplimiento.
* Reporte PDF mensual básico.
* Notificaciones por email.

No incluiría todavía AI avanzada ni editor complejo de mapas. Usaría imagen del plano + áreas clicables simples.

---

### Fase 2 — Constructor inteligente

Incluye:

* Carga de DOCX/PDF.
* Extracción AI de procedimientos.
* Conversión a checklist.
* Revisión humana.
* Versionamiento.
* Asistente operativo basado en procedimientos aprobados.

---

### Fase 3 — Auditoría, mejora continua y analítica

Incluye:

* No conformidades.
* Acciones correctivas.
* Tendencias.
* Comparativos.
* Detección de evidencia sospechosa.
* Reportes trimestrales inteligentes.
* Recomendaciones por área/proceso.

---

### Fase 4 — Offline-first y mobile robusto

Incluye:

* App React Native o PWA avanzada.
* Sincronización offline.
* Captura de evidencias sin conexión.
* Resolución de conflictos.
* Modo tablet para planta.

---

## 12. Riesgos y decisiones importantes

### Riesgo 1: querer automatizar demasiado pronto

La AI debe ayudar, pero la responsabilidad sanitaria sigue siendo humana. Especialmente porque cada empresa tiene alimentos, áreas, riesgos y productos distintos.

### Riesgo 2: checklist demasiado genérico

El valor está en que cada checklist esté conectado a:

* Área.
* Superficie/equipo.
* Procedimiento.
* Frecuencia.
* Producto químico.
* Dosificación.
* Evidencia.
* Responsable.

### Riesgo 3: mala gestión multi-tenant

Desde el día uno se debe probar que un usuario de cliente A no pueda acceder a fotos, procedimientos, tareas o reportes de cliente B.

### Riesgo 4: fotos sin utilidad

Una foto sin contexto no sirve. Toda evidencia debe estar asociada a tarea, área, usuario, timestamp y procedimiento.

### Riesgo 5: no versionar procedimientos

Sin versionamiento no hay trazabilidad real. Cada ejecución debe quedar amarrada a la versión vigente del POE.

---

## 13. Backlog inicial sugerido

### Épica: Configuración del cliente

* Crear cliente.
* Crear establecimiento.
* Crear pisos.
* Crear áreas.
* Subir plano.
* Asociar áreas a zonas del plano.
* Crear usuarios y roles.

### Épica: Plan de saneamiento

* Crear programa: agua, residuos, plagas, limpieza/desinfección.
* Crear procedimiento.
* Crear pasos.
* Crear productos químicos.
* Crear dosificación.
* Asociar procedimiento a área/equipo.
* Publicar versión.

### Épica: Operación diaria

* Generar tareas por frecuencia.
* Ver tareas del día.
* Ejecutar checklist.
* Adjuntar fotos.
* Guardar observaciones.
* Marcar no conformidad.
* Validar por supervisor.

### Épica: Alertas

* Tarea próxima a vencer.
* Tarea vencida.
* Evidencia faltante.
* Validación pendiente.

### Épica: Reportes

* Cumplimiento mensual.
* Cumplimiento por área.
* Cumplimiento por procedimiento.
* Tareas vencidas.
* Evidencias.
* PDF automático.

---

## 14. Recomendación final de diseño

Yo lo construiría como una plataforma **SaaS B2B multi-tenant**, con backend Spring Boot, PostgreSQL, S3 y frontend React/PWA. Empezaría con un **monolito modular bien diseñado**, no microservicios. Usaría eventos para tareas pesadas como reportes, notificaciones, extracción AI y procesamiento de evidencias.

La propuesta de valor debería expresarse así:

> “Convertimos el plan de saneamiento escrito en una operación digital diaria, trazable, con evidencias, alertas, reportes y mejora continua por establecimiento, área y procedimiento.”

El documento de ArtesaPan es un excelente candidato para el primer piloto porque ya contiene estructura suficiente: áreas, superficies, POE, productos químicos, frecuencias, responsables, pasos y registros. Eso permite demostrar rápidamente la conversión de un plan documental a un sistema operativo digital.
