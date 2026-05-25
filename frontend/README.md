# SanitIA — Frontend

PWA construida con **React 19 + TypeScript + Vite**. Interfaz mobile-first para operarios, administradores y consultores sanitarios.

---

## Requisitos previos

### 1. Node.js 22 LTS

```bash
# Verificar versión instalada
node --version
# v22.x.x
```

**Si no tienes Node.js 22**, instala con [nvm](https://github.com/nvm-sh/nvm) (macOS / Linux):

```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc  # o ~/.zshrc

# Instalar y usar Node 22 LTS
nvm install 22
nvm use 22
node --version
```

**Windows** — Descarga el instalador desde [nodejs.org](https://nodejs.org/en/download) (elige la versión LTS 22).

### 2. npm (incluido con Node.js)

```bash
npm --version
# 10.x.x
```

> Si prefieres **pnpm** (más rápido): `npm install -g pnpm` y reemplaza `npm` por `pnpm` en los comandos siguientes.

---

## Instalación de dependencias

```bash
# Desde la carpeta frontend/
npm install
```

La primera instalación descarga todas las dependencias (~2-3 min). Las siguientes son instantáneas desde caché.

---

## Ejecutar en desarrollo

```bash
npm run dev
```

La app arranca en **http://localhost:5173**

El frontend hace proxy automático de `/api/*` al backend en `http://localhost:8080`. Para que funcionen las llamadas a la API, el backend debe estar corriendo también.

---

## Otros comandos útiles

```bash
# Verificar tipos TypeScript (sin compilar)
npm run type-check

# Lint
npm run lint

# Tests unitarios (modo watch)
npm test

# Tests con interfaz visual
npm run test:ui

# Tests con reporte de cobertura
npm run test:coverage

# Build de producción
npm run build

# Preview del build de producción localmente
npm run preview
```

---

## Estructura de carpetas

```
src/
├── main.tsx                         # Punto de entrada
├── index.css                        # Tailwind CSS v4 + variables CSS
│
├── app/
│   ├── providers/                   # QueryClient, providers globales
│   ├── routes/                      # Definición de rutas (react-router-dom v7)
│   └── layout/                      # Layout raíz (header, sidebar)
│
├── features/                        # Un directorio por dominio de negocio
│   ├── auth/                        # Login, sesión (Sprint 1)
│   ├── tasks/                       # Vista diaria del operario (Sprint 3)
│   ├── procedures/                  # Constructor de POE (Sprint 2)
│   ├── evidence/                    # Captura fotográfica (Sprint 4)
│   ├── reports/                     # Dashboard y PDF (Sprint 4)
│   └── dashboard/                   # Panel admin-cliente (Sprint 4)
│
│   Cada feature sigue esta estructura interna:
│   ├── components/    → Componentes React de ese dominio
│   ├── hooks/         → Custom hooks (useQuery, useMutation, lógica)
│   ├── api/           → Funciones de llamada al backend
│   └── types.ts       → Tipos TypeScript del dominio
│
└── shared/
    ├── components/ui/ → Componentes UI reutilizables (shadcn/ui)
    ├── hooks/         → Hooks genéricos (useDebounce, etc.)
    ├── lib/
    │   ├── api.ts     → Cliente Axios centralizado
    │   └── utils.ts   → cn() y otras utilidades
    └── types/         → Tipos compartidos entre features
```

---

## Variables de entorno

```bash
cp .env.example .env.local
```

Vite carga `.env.local` automáticamente. Las variables deben empezar con `VITE_` para estar disponibles en el código.

En desarrollo local no es necesario configurar nada — el proxy a `localhost:8080` funciona sin variables adicionales.

---

## Stack tecnológico

| Librería | Versión | Uso |
|---|---|---|
| React | 19.x | Framework UI |
| TypeScript | 5.8.x | Tipado estricto (`strict: true`) |
| Vite | 6.x | Build tool y dev server |
| TanStack Query | 5.x | Estado del servidor, caché, refetch |
| Zustand | 5.x | Estado del cliente (auth, UI) |
| React Hook Form | 7.x | Formularios sin re-renders |
| Zod | 3.x | Validación de formularios y parsing |
| shadcn/ui | latest | Componentes accesibles sobre Radix UI |
| Tailwind CSS | 4.x | Estilos utilitarios |
| react-konva | 19.x | Mapa interactivo del establecimiento |
| Vite PWA | 0.21.x | Service Worker, soporte offline |
| Vitest | 3.x | Tests unitarios |
| Testing Library | 16.x | Tests de componentes React |
| MSW | 2.x | Mock de API en tests |
| Axios | 1.x | Cliente HTTP |

---

## IDE recomendado

**VS Code** con las siguientes extensiones:

```
ESLint                    → dbaeumer.vscode-eslint
Prettier                  → esbenp.prettier-vscode
Tailwind CSS IntelliSense → bradlc.vscode-tailwindcss
TypeScript (built-in)     → ya incluido en VS Code
```

Configuración recomendada en `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

---

## Convenciones del proyecto

Ver [CLAUDE.md](../CLAUDE.md) en la raíz del monorepo para las reglas de componentes, hooks, formularios, acceso a API y tipado TypeScript que aplican a todo el frontend.
