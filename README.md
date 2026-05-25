# SanitIA — Monorepo

Plataforma SaaS B2B multi-tenant para digitalizar planes de saneamiento sanitario en Colombia, según Resolución 2674 de 2013.

---

## Estructura del repositorio

```
saneamiento_app/
├── backend/          → API REST (Spring Boot 3.5 / Java 21)
├── frontend/         → PWA (React 19 / TypeScript / Vite)
├── docs/             → Documentación técnica y de negocio
├── docker-compose.yml → PostgreSQL local para desarrollo
├── CLAUDE.md         → Convenciones y arquitectura del proyecto
└── README.md         → Este archivo
```

---

## Levantar el entorno completo en desarrollo

### Paso 1 — Base de datos

```bash
docker compose up -d postgres
```

Verifica que está corriendo:
```bash
docker compose ps
# sanitia-postgres   Up   0.0.0.0:5432->5432/tcp
```

### Paso 2 — Backend

```bash
cd backend
./gradlew bootRun
```

Servidor disponible en: **http://localhost:8080**

```bash
curl http://localhost:8080/api/v1/ping
# {"status":"UP","service":"SanitIA Backend","timestamp":"..."}
```

### Paso 3 — Frontend

En otra terminal:

```bash
cd frontend
npm install       # solo la primera vez
npm run dev
```

App disponible en: **http://localhost:5173**

---

## Documentación por subproyecto

- [backend/README.md](backend/README.md) — Instalación de Java 21, cómo correr y testear el backend
- [frontend/README.md](frontend/README.md) — Instalación de Node.js, comandos de desarrollo y stack de librerías
- [CLAUDE.md](CLAUDE.md) — Arquitectura, convenciones de código, multi-tenancy y seguridad

---

## Ramas de desarrollo

| Rama | Propósito |
|---|---|
| `main` | Producción — solo merges desde `develop` con PR aprobado |
| `develop` | Integración — todos los sprints se mergean aquí |
| `feature/{nombre}` | Desarrollo de cada feature individual |
| `hotfix/{nombre}` | Fixes urgentes sobre `main` |

---

## Plan de implementación

Ver [Plan de implementacion v2.md](Plan%20de%20implementacion%20v2.md) para el roadmap completo por fases y sprints.

**Fase 0 (actual):** Infraestructura base — ✅ completada  
**Fase 1 (sprints 1-4):** MVP operativo  
**Fase 2 (sprints 5-10):** Mapa interactivo + AI  
**Fase 3 (sprints 11+):** Auditoría y analítica  
