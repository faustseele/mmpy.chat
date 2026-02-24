**mmpy.messenger** 💌 — portfolio pet-project

*Built & [Designed](https://www.figma.com/design/SaTdkvEMsWoRl2dZn7S9Ab/middle.messenger.praktikum.yandex?node-id=0-1&p=f) for 'Middle Web-Developer' [course](https://github.com/yandex-praktikum/middle.messenger.praktikum.yandex) by [Y.Praktikum](practicum.yandex.ru/profile/middle-frontend)*

---

### Tech-Stack
- Runs on: TypeScript + Handlebars
- API: https://ya-praktikum.tech/api/v2/swagger + XHR
- Styles: PostCSS + CSS-Modules
- Code Style: ESLint (Standard), Stylelint
- Build + Preview: Vite

---

### Architecture
**Feature-based** structure (lightweight Feature‑Sliced Design): `src/app`, `src/pages`, `src/features`, `src/entities`, `src/shared`.

Component dependencies (**DI**) are explicit and minimal:
- DOMService (DOM dependency) creates/updates elements & manages listeners: `src/shared/lib/DOM/DOMService.ts`
- FragmentService (fragment dependency) compiles Handlebars markup to DocumentFragment & stitches children: `src/shared/lib/Fragment/FragmentService.ts`

**Factory** + **DI**: components are created via factories that inject the services and wire child nodes, enabling *decoupling* and testability:
- Factory helpers: `src/shared/lib/helpers/factory/functions.ts`
- Usage with page blueprints and lazy instantiation: `src/app/providers/store/connect.ts`

---

### Deployed at Netlify
**The link**: 

---

### How to run
```bash 
npm install
```
```bash
npm run dev
```
```bash
npm run build
```
**Available links**:
- authentication: `/sign-up` `/`
- app: `/messenger` `/settings`
- error-pages: `/404` `/500`

---

#### Design
The design is available to everyone – [link to Figma](https://www.figma.com/design/SaTdkvEMsWoRl2dZn7S9Ab/middle.messenger.praktikum.yandex?node-id=0-1&p=f).
