English | [**Русский README** ➡️](README.md)

**mmpy.chat** 💌 — chat + notes app in TypeScript from scratch, no React/Vue

*Custom component system, reactive store, router, WebSocket, i18n — all hand-written.*

**[Demo (with a guest mode! 👻)](https://mmpy-chat.netlify.app/)** &nbsp;·&nbsp; **[Homemade Figma](https://www.figma.com/design/SaTdkvEMsWoRl2dZn7S9Ab/mmpy-chat?node-id=0-1&t=PrP08m0m5Cfj2EMi-1)** &nbsp;·&nbsp; **[API Swagger](https://ya-praktikum.tech/api/v2/swagger)**

---

<img width="1360" height="890" alt="combo-1" src="https://github.com/user-attachments/assets/6dc144b7-e88e-41fb-af6d-5bf830a9d3c5" />

---

### What's so good about MMPY-chat? 💌

- Everything from scratch — components with lifecycle, DI, EventBus, no frameworks
- Feature-Sliced Design — layers, boundaries, unidirectional dependencies
- WebSocket chat with token auth and message history
- Figma → pixel-perfect implementation
- Lighthouse: 94-100 on all pages

---

### Tech-Stack 🧩

- **Language** – TypeScript (strict, generics, enums, guards)
- **Templating & styles** – Handlebars; PostCSS + CSS Modules
- **Build & testing** – Vite; Vitest, jsdom
- **Linting** – ESLint, Stylelint
- **API & deploy** – REST (XHR) + WebSocket; Netlify

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

- 🚪 Authentication (sign-in / sign-up) with form validation
- 🗨️ Chats + 📝 Notes list, real-time messaging 🔄 WebSocket
- ⚙️ Profile editing (avatar, credentials, password)
- 🗺️ Client-side routing with auth guards
- 🌐 i18n — 7 languages, runtime switching 🔄 Store
- 📱 Mobile-first – responsive layout

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
| `npm test` · `npm test:ui` · `npm test:coverage` | Tests (+ in browser & coverage) |

**Routes:** `/` `/sign-up` `/messenger` `/settings` `/404` `/500`

---

### Design 📐

UI was designed before code — **[open in Figma →](https://www.figma.com/design/SaTdkvEMsWoRl2dZn7S9Ab/mmpy-chat?node-id=0-1&t=PrP08m0m5Cfj2EMi-1)**
