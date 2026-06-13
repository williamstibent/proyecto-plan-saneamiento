# Frontend — SanitIA (React 19 / TypeScript / Vite 6)

> Este archivo complementa el `CLAUDE.md` raíz. No repite convenciones generales ya definidas allí.
> Foco: estado actual del código, comandos, patrones concretos de implementación.

---

## Comandos esenciales

```bash
# Servidor de desarrollo (proxy /api → localhost:8080)
npm run dev

# Verificación de tipos (sin emitir archivos)
npm run type-check

# Linting — cero warnings tolerados
npm run lint

# Tests unitarios en modo watch
npm run test

# Tests con cobertura
npm run test:coverage

# Build de producción
npm run build
```

> El alias `@/` apunta a `src/`. Usar siempre en imports, no rutas relativas entre features.

---

## Estado actual del código (junio 2026)

### Implementado en `shared/`
| Archivo | Estado | Notas |
|---|---|---|
| `shared/lib/api.ts` | ✅ | Axios con interceptores base; JWT pendiente Sprint 1 |
| `shared/types/index.ts` | ✅ | `PaginatedResponse`, `ApiError`, `UserRole`, `TaskStatus`, `TaskFrequency` |
| `shared/lib/utils.ts` | ✅ | `cn()` helper de Tailwind (clsx + tailwind-merge) |

### Implementado en `app/`
| Archivo | Estado | Notas |
|---|---|---|
| `app/providers/index.tsx` | ✅ | `QueryClient` configurado, retry=1, staleTime=30s |
| `app/routes/index.tsx` | ✅ | Estructura base |
| `app/layout/index.tsx` | ✅ | Layout shell |

### Features — solo `types.ts` creado, sin implementación
```
features/auth/         features/dashboard/    features/evidence/
features/procedures/   features/reports/      features/tasks/
```

### Pendiente crítico Sprint 1
- `shared/stores/authStore.ts` — Zustand store para JWT / user session
- Completar interceptor JWT en `api.ts` (ver TODO en el archivo)
- Conectar `mutations.onError` con sistema de toast (Radix `@radix-ui/react-toast` ya instalado)

---

## Estructura de una feature — patrón completo

Cada feature sigue esta estructura. No crear archivos fuera de ella:

```
features/tasks/
  api/
    taskKeys.ts          ← query keys factory (obligatorio)
    getTasks.ts          ← función fetcher
    executeTask.ts       ← función mutación
  components/
    TaskList.tsx         ← componente de presentación
    TaskCard.tsx
    TaskExecutionForm.tsx
  hooks/
    useTaskList.ts       ← useQuery wrappereado
    useExecuteTask.ts    ← useMutation wrappereado
  types.ts               ← ya existe — tipos de dominio de esta feature
```

### Query Keys Factory (patrón obligatorio)
```typescript
// features/tasks/api/taskKeys.ts
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TaskFilters) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
}
```

### Fetcher (separado del hook)
```typescript
// features/tasks/api/getTasks.ts
import { apiClient } from '@/shared/lib/api'
import type { PaginatedResponse } from '@/shared/types'
import type { Task, TaskFilters } from '../types'

export async function getTasks(filters: TaskFilters): Promise<PaginatedResponse<Task>> {
  const { data } = await apiClient.get<PaginatedResponse<Task>>('/tasks', { params: filters })
  return data
}
```

### Hook de query (wrappear siempre useQuery)
```typescript
// features/tasks/hooks/useTaskList.ts
import { useQuery } from '@tanstack/react-query'
import { taskKeys } from '../api/taskKeys'
import { getTasks } from '../api/getTasks'
import type { TaskFilters } from '../types'

export function useTaskList(filters: TaskFilters) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => getTasks(filters),
    // No añadir staleTime aquí si el default del QueryClient es suficiente
  })
}
```

### Hook de mutación
```typescript
// features/tasks/hooks/useExecuteTask.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { taskKeys } from '../api/taskKeys'
import { executeTask } from '../api/executeTask'

export function useExecuteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: executeTask,
    onSuccess: () => {
      // Invalidar la lista de tareas del día actual
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
    // No definir onError aquí — el QueryClient global lo maneja
  })
}
```

---

## Zustand — patrón de stores

Un archivo por dominio en `shared/stores/`. No usar `persist` de Zustand para el JWT — el token viene del JWT header, no de localStorage.

```typescript
// shared/stores/authStore.ts
import { create } from 'zustand'
import type { UserRole } from '@/shared/types'

interface AuthState {
  token: string | null
  userId: string | null
  tenantId: string | null
  role: UserRole | null
  isAuthenticated: boolean
  setAuth: (payload: { token: string; userId: string; tenantId: string; role: UserRole }) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  tenantId: null,
  role: null,
  isAuthenticated: false,
  setAuth: (payload) => set({ ...payload, isAuthenticated: true }),
  clearAuth: () => set({ token: null, userId: null, tenantId: null, role: null, isAuthenticated: false }),
}))
```

**Regla**: el `tenantId` viaja en el JWT y se almacena en este store. Nunca en `localStorage` por separado. El interceptor de `api.ts` lo toma de `useAuthStore.getState().token`.

---

## Formularios — patrón React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const executeTaskSchema = z.object({
  checklistItems: z.array(z.object({
    itemId: z.string().uuid(),
    completed: z.boolean(),
    observation: z.string().max(500).optional(),
  })).min(1, 'Debe completar al menos un ítem'),
  photoEvidence: z.instanceof(File).optional(),
})

type ExecuteTaskFormValues = z.infer<typeof executeTaskSchema>

export function TaskExecutionForm({ taskId }: { taskId: string }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ExecuteTaskFormValues>({
    resolver: zodResolver(executeTaskSchema),
  })
  const executeTask = useExecuteTask()

  const onSubmit = (values: ExecuteTaskFormValues) => {
    executeTask.mutate({ taskId, ...values })
  }

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}
```

---

## Componentes shadcn/ui — uso en este proyecto

shadcn/ui no es una librería instalada con npm — son componentes copiados en `src/shared/components/ui/`. Para agregar uno nuevo:

```bash
# Desde frontend/
npx shadcn@latest add button
npx shadcn@latest add form
npx shadcn@latest add toast
```

Los componentes Radix ya instalados (dialog, dropdown-menu, toast, tabs, label, checkbox, select, separator, avatar) se usan directamente o a través de los wrappers de shadcn.

**No crear componentes UI custom que dupliquen lo que shadcn ofrece.**

---

## Tests — patrones de este proyecto

### Setup disponible
- `vitest` + `@testing-library/react` + `jsdom` — ya configurado en `test/setup.ts`
- `msw` v2 — para mockear la API sin mockear axios directamente

### Patrón de test con MSW
```typescript
// features/tasks/__tests__/TaskList.test.tsx
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TaskList } from '../components/TaskList'

const server = setupServer(
  http.get('/api/v1/tasks', () => {
    return HttpResponse.json({
      data: [{ id: '1', title: 'Limpieza área cocina', status: 'PENDING' }],
      pagination: { page: 0, size: 20, totalElements: 1, totalPages: 1 },
    })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

test('muestra las tareas del día', async () => {
  renderWithQuery(<TaskList date="2026-06-13" />)
  expect(await screen.findByText('Limpieza área cocina')).toBeInTheDocument()
})
```

### Regla: no mockear axios ni el apiClient directamente. Usar MSW — mockea la red, no la implementación.

---

## react-konva — plano del establecimiento

`react-konva` (v19) y `konva` (v9) ya instalados. Se usa en la feature `establishments` para el editor de plano (imagen de fondo + polígonos de áreas clicables).

```typescript
import { Stage, Layer, Image, Polygon } from 'react-konva'
// Patrón: cargar imagen con useImage de 'use-image' (instalar si se necesita)
// Los polígonos representan áreas — sus IDs se mapean a Area entities del backend
```

---

## React Router v7 — convenciones

```typescript
// app/routes/index.tsx — estructura de rutas
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/tasks" replace /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'tasks/:taskId', element: <TaskDetailPage /> },
      { path: 'procedures', element: <ProceduresPage /> },
      { path: 'reports', element: <ReportsPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
])
```

Lazy loading para rutas no críticas:
```typescript
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage'))
```

---

## Tipos TypeScript — dónde vive cada cosa

| Tipo | Ubicación |
|---|---|
| Tipos de dominio compartidos (roles, status, frecuencia) | `shared/types/index.ts` |
| Tipos específicos de una feature (Task, Procedure, Evidence) | `features/{name}/types.ts` |
| Props de componentes | Co-ubicadas en el archivo del componente |
| Tipos de formulario | Inferidos de Zod schema con `z.infer<typeof schema>` |
| Tipos de respuesta API | En `features/{name}/types.ts`, coinciden con los DTOs del backend |

**No crear un archivo `types.ts` global en `src/` — ya existe `shared/types/index.ts` para lo compartido.**

---

## Variables de entorno

```bash
# frontend/.env.local (no commitear)
VITE_API_BASE_URL=/api/v1        # Solo si se cambia del default
VITE_COGNITO_CLIENT_ID=xxx
VITE_COGNITO_USER_POOL_ID=xxx
```

Acceso en código: solo a través de `import.meta.env.VITE_*`. Nunca `process.env`.
