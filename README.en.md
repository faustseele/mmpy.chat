English | [**Русский README** ➡️](README.md)

**mmpy.chat** 💌 — chat + notes app in TypeScript from scratch, no React/Vue

*Custom component system, reactive store, router, WebSocket, i18n — all hand-written.*

**[Live Demo (with a guest mode! 👻)](https://mmpy-chat.netlify.app/)** &nbsp;·&nbsp; **[Figma](https://www.figma.com/design/SaTdkvEMsWoRl2dZn7S9Ab/middle.messenger.praktikum.yandex?node-id=0-1&p=f)** &nbsp;·&nbsp; **[API Swagger](https://ya-praktikum.tech/api/v2/swagger)**

---

### What's so good about MMPY-chat? 💌

- Everything from scratch — components with lifecycle, DI, EventBus, no frameworks
- Feature-Sliced Design — layers, boundaries, unidirectional dependencies
- WebSocket chat with token auth and message history
- Figma → pixel-perfect implementation
- Lighthouse: 94-100 on all pages

---

### Tech-Stack 🧩

- **Language:** TypeScript (strict, generics, enums, guards)
- **Templating:** Handlebars
- **Styles:** PostCSS + CSS Modules
- **Build:** Vite
- **Testing:** Vitest, jsdom
- **Linting:** ESLint, Stylelint
- **API:** REST (XHR) + WebSocket
- **Deploy:** Netlify

---

### Architecture 🕸️

**Feature-Sliced Design:** `src/app` → `src/pages` → `src/features` → `src/entities` → `src/shared`

Components are created via **Factory + DI** — dependencies are injected, not imported directly:

- [`shared/lib/Component/`](src/shared/lib/Component/) — decomposed base class with EventBus-driven lifecycle
- [`shared/lib/DOM/DOMService.ts`](src/shared/lib/DOM/DOMService.ts) — element creation/updates, listener management
- [`shared/lib/Fragment/FragmentService.ts`](src/shared/lib/Fragment/FragmentService.ts) — Handlebars → DocumentFragment
- [`app/providers/store/`](src/app/providers/store/) — reactive store + connect with Page-component
- [`app/providers/router/`](src/app/providers/router/) — History API router with guards

---

### Features ⚡

- Authentication (sign-in / sign-up) with form validation
- Chat & Notes list, real-time messaging via WebSocket
- Profile editing (avatar, credentials, password)
- Client-side routing with auth guards
- i18n — 7 languages, runtime switching
- Mobile-first 📱 – responsive layout

---

### Getting started 🔑

```bash
npm install && npm run dev
```

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm run lint` | ESLint + TS + Stylelint |
| `npm test` · `npm test:ui` or `npm test:coverage` | Tests (+ in browser & coverage) |

**Routes:** `/` `/sign-up` `/messenger` `/settings` `/404` `/500`

---

### Design 📐

UI was designed before code — **[open in Figma →](https://www.figma.com/design/SaTdkvEMsWoRl2dZn7S9Ab/middle.messenger.praktikum.yandex?node-id=0-1&p=f)**

---

*Built for the [Middle Frontend Developer](https://practicum.yandex.ru/profile/middle-frontend) course by Yandex Practicum*
