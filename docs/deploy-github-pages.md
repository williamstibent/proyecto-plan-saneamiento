# Deploy SanitIA a GitHub Pages (modo demo con mocks)

El build de Vite con `VITE_MOCK=true` produce archivos estáticos donde MSW corre como
Service Worker en el navegador. No se necesita backend — GitHub Pages sirve exactamente eso.

---

## Requisitos previos

- Cuenta en [github.com](https://github.com)
- Git instalado y configurado localmente
- Node.js 20 LTS o superior
- El repositorio ya creado en GitHub (puede ser privado o público)

---

## Paso 1 — Verificar que el Service Worker de MSW está en `public/`

MSW necesita que su archivo `mockServiceWorker.js` esté en la carpeta `public/` del proyecto.
Si aún no existe, ejecuta dentro de `frontend/`:

```bash
npx msw init public/ --save
```

Confirma que el archivo existe:

```
frontend/public/mockServiceWorker.js   ← debe estar aquí
```

Asegúrate de que esté **commiteado** en el repositorio (no en `.gitignore`).

---

## Paso 2 — Crear el archivo `404.html` para manejar rutas SPA

GitHub Pages devuelve un 404 real cuando alguien accede directamente a una ruta como
`/dashboard` o `/poe`. La solución estándar es servir el mismo `index.html` como `404.html`.

Crea el archivo `frontend/public/404.html` con este contenido:

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <script>
      // Redirige rutas SPA a index.html preservando el path.
      // Técnica estándar para React Router + GitHub Pages.
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.host + l.pathname.split('/').slice(0, 1).join('/') +
        '/?p=' + encodeURIComponent(l.pathname + l.search) + l.hash
      );
    </script>
  </head>
</html>
```

Y agrega este script al `<head>` de `frontend/index.html`, justo antes del cierre `</head>`:

```html
<script>
  // Restaura la ruta real desde el parámetro ?p= que dejó 404.html
  (function () {
    var p = window.location.search.match(/\?p=([^&]*)/);
    if (p) {
      window.history.replaceState(
        null, null,
        decodeURIComponent(p[1]) + window.location.hash
      );
    }
  })();
</script>
```

---

## Paso 3 — Saber el nombre del repositorio

GitHub Pages para un repositorio de proyecto (el más común) publica en:

```
https://<usuario>.github.io/<nombre-repo>/
```

Necesitarás `<nombre-repo>` en el siguiente paso. Si el repositorio se llama
`saneamiento_app`, el sitio queda en `https://possos.github.io/saneamiento_app/`.

> **Repositorio de organización/usuario** (`usuario.github.io`): el sitio está en la raíz `/`.
> En ese caso `BASE_PATH` debe ser `/` y puedes omitir esa variable en el workflow.

---

## Paso 4 — Crear el workflow de GitHub Actions

Crea el archivo `.github/workflows/deploy.yml` en la **raíz del repositorio** (no dentro de
`frontend/`):

```yaml
name: Deploy a GitHub Pages

on:
  push:
    branches: [main]          # Cambia a 'develop' si prefieres ese branch
  workflow_dispatch:           # Permite ejecutarlo manualmente desde GitHub

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Instalar Node 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      - name: Instalar dependencias
        working-directory: frontend
        run: npm ci

      - name: Build con mocks
        working-directory: frontend
        env:
          VITE_MOCK: "true"
          # Reemplaza saneamiento_app con el nombre exacto de tu repositorio
          BASE_PATH: "/saneamiento_app/"
        run: npm run build

      - name: Subir artefacto de Pages
        uses: actions/upload-pages-artifact@v3
        with:
          path: frontend/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy a GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

> **Importante:** en la línea `BASE_PATH: "/saneamiento_app/"` reemplaza `saneamiento_app`
> con el nombre exacto de tu repositorio en GitHub, incluyendo las barras `/` al inicio y al final.

---

## Paso 5 — Habilitar GitHub Pages en el repositorio

1. Ve a tu repositorio en GitHub.
2. Abre **Settings → Pages** (en el menú lateral izquierdo).
3. En **Source**, selecciona **GitHub Actions**.
4. Guarda.

No selecciones un branch — el workflow se encarga del deploy directamente.

---

## Paso 6 — Primer deploy

Haz commit y push de todos los cambios:

```bash
git add .
git commit -m "chore: configurar deploy a GitHub Pages con mocks"
git push origin main
```

Luego:

1. Ve a la pestaña **Actions** de tu repositorio.
2. Verás el workflow "Deploy a GitHub Pages" ejecutándose.
3. Cuando el job `deploy` muestre ✅, haz clic en él y encontrarás la URL del sitio.

La URL seguirá el formato: `https://<usuario>.github.io/<nombre-repo>/`

---

## Paso 7 — Verificar que funciona

Comprueba estos puntos en el sitio desplegado:

| Verificación | Cómo |
|---|---|
| Login funciona | Ingresa con cualquier email y contraseña |
| Rutas directas | Escribe `/dashboard` en la barra de dirección — no debe dar 404 |
| MSW activo | Abre DevTools → Application → Service Workers — debe aparecer `mockServiceWorker.js` |
| POE se crea | Crea un nuevo POE desde el wizard y confirma que aparece en la lista |
| Sesión persiste | Recarga la página — debes seguir autenticado |

---

## Actualizaciones futuras

Cada `push` a `main` dispara el workflow automáticamente. El sitio se actualiza en ~1 minuto.

Para ejecutarlo manualmente sin hacer push: **Actions → Deploy a GitHub Pages → Run workflow**.

---

## Cuándo dejar de usar mocks

Cuando el backend Spring Boot esté disponible:

1. Cambia `VITE_MOCK: "true"` a `VITE_MOCK: "false"` en el workflow.
2. Agrega la URL del backend como variable: `VITE_API_URL: "https://api.tudominio.com"`.
3. Actualiza `baseURL` en `src/shared/lib/api.ts` para leer esa variable.

El resto del código no cambia — MSW simplemente deja de interceptar las peticiones.
