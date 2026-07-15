# pablogomezromero.com

Sitio web personal de Pablo Gómez Romero ([pablogomezromero.com](https://pablogomezromero.com)).

Construido con [Astro](https://astro.build) como sitio estático, con contenido en MDX, estilos con Tailwind CSS, sitemap y RSS.

## Despliegue

El sitio se publica automáticamente en [GitHub Pages](https://docs.github.com/es/pages) cada vez que hay un push a la rama `master`, mediante GitHub Actions.

- **Workflow**: `.github/workflows/deploy.yml`
- **Build**: `npm run build` → artefacto en `dist/`
- **Dominio custom**: `pablogomezromero.com` (CNAME en repo + registros DNS en IONOS apuntando a GitHub Pages)
- **HTTPS**: emitido automáticamente por Let's Encrypt

Si necesitas forzar un deploy manual, ve a Actions → *Deploy to GitHub Pages* → *Run workflow*.

## Stack

- [Astro 5](https://astro.build) — generador de sitios estáticos
- [Tailwind CSS 4](https://tailwindcss.com) (vía `@tailwindcss/vite`)
- `@astrojs/mdx`, `@astrojs/rss`, `@astrojs/sitemap` — integraciones oficiales
- `sharp` — optimización de imágenes
- `astro-embed` — embeds para redes sociales

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto:

| Comando                   | Acción                                               |
| :------------------------ | :--------------------------------------------------- |
| `npm install`             | Instala dependencias                                 |
| `npm run dev`             | Inicia el servidor local en `http://localhost:4321`  |
| `npm run build`           | Genera el sitio de producción en `./dist/`            |
| `npm run preview`         | Previsualiza localmente el build antes de publicar   |
| `npm run astro ...`       | Ejecuta comandos CLI (`astro add`, `astro check`, …) |
| `npm run astro -- --help` | Muestra la ayuda del CLI de Astro                    |

## Estructura

```text
├── public/              # assets estáticos servidos tal cual
├── src/
│   ├── components/      # componentes Astro
│   ├── content/         # colecciones (blog, etc.)
│   ├── layouts/         # plantillas de página
│   └── pages/           # rutas: cada archivo = una ruta
├── .github/workflows/   # CI/CD (deploy a GitHub Pages)
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

Los `.astro`/`.md` en `src/pages/` se convierten en rutas según el nombre del archivo.
