# LinkSocialDrop

La alternativa gratuita a Linktree. Crea tu página de links personalizada en segundos.

## ¿Qué es LinkSocialDrop?

LinkSocialDrop es una plataforma web que permite a creadores, profesionales y marcas crear una página personalizada con todos sus links importantes en un solo lugar. Diseñada para ser rápida, privada y completamente personalizable.

## Stack Tecnológico

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19 + Tailwind CSS 4
- **Backend:** Supabase (Auth, Database, Storage)
- **Internacionalización:** next-intl (ES/EN)
- **Tipado:** TypeScript 6 (strict)
- **Testing:** Vitest + Testing Library
- **Linting:** ESLint + Prettier + Commitlint

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run test` | Ejecuta tests con Vitest |
| `npm run dead-code` | Detecta código muerto con Knip |
| `npm run agent:sync` | Lint + format + dead-code (uso AI) |

## Estructura del Proyecto

```
src/
├── app/          → Rutas, layouts y páginas (App Router)
├── components/   → Componentes React reutilizables
├── config/       → Configuración central (site.ts)
├── lib/          → Utilidades y clientes (Supabase, utils)
├── hooks/        → Custom hooks tipados
├── context/      → Estado global (Zustand)
├── providers/    → Proveedores de React
├── actions/      → Server Actions (next-safe-action)
├── schemas/      → Esquemas de validación (Zod)
└── types/        → Tipos e interfaces TypeScript
```

## Licencia

Privado — © 2025 LinkSocialDrop
