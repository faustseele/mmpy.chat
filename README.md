[**English README** ➡️️](README.en.md) | Русский

**mmpy.chat** 💌 — чат с заметками на TypeScript с нуля, без React/Vue

_Компонентная система, реактивный стор, роутер, WebSocket, i18n — всё написано руками._

**[Демо (с гостевым модом! 👻)](https://mmpy-chat.netlify.app/)** &nbsp;·&nbsp; **[Figma](https://www.figma.com/design/SaTdkvEMsWoRl2dZn7S9Ab/middle.messenger.praktikum.yandex?node-id=0-1&p=f)** &nbsp;·&nbsp; **[API Swagger](https://ya-praktikum.tech/api/v2/swagger)**

---

### Чем хорош MMPY-Чат? 💌

- Всё с нуля — Компоненты с lifecycle, DI, EventBus, без фреймворков
- Feature-Sliced Design — слои, границы, однонаправленные зависимости
- WebSocket-чат с токен-авторизацией и историей сообщений
- Figma с собственным дизайном → pixel-perfect вёрстка
- Lighthouse: 94-100 на всех страницах

---

### Стек технологий 🧩

- **Язык** – TypeScript (strict, generics, enums, guards)
- **Шаблоны и стили** – Handlebars; PostCSS + CSS Modules
- **Сборка и тесты** – Vite; Vitest, jsdom
- **Линтинг** – ESLint, Stylelint
- **API и деплой** – REST (XHR) + WebSocket; Netlify

---

### Архитектура 🕸️

**Feature-Sliced Design:** `src/app` → `src/pages` → `src/features` → `src/entities` → `src/shared`

Компоненты создаются через **Factory + DI** — зависимости инжектятся, не импортируются напрямую:

- [`shared/lib/Component/`](src/shared/lib/Component/) — декомпозированный базовый класс с lifecycle на EventBus
- [`shared/lib/DOM/DOMService.ts`](src/shared/lib/DOM/DOMService.ts) — создание/обновление элементов, управление слушателями
- [`shared/lib/Fragment/FragmentService.ts`](src/shared/lib/Fragment/FragmentService.ts) — Handlebars → DocumentFragment
- [`app/providers/store/`](src/app/providers/store/) — реактивный стор + connect с Page-компонентом
- [`app/providers/router/`](src/app/providers/router/) — History API роутер с гардами

---

### Что умеет? ⚡

- 🚪 Авторизация (вход / регистрация) с валидацией форм
- 🗨️ Список чатов + 📝 Заметок в реальном времени 🔄 WebSocket
- ⚙️ Редактирование профиля (аватар, данные, пароль)
- 🗺️ Роутинг с гардами авторизации
- 🌐 i18n — 7 языков, переключение на лету 🔄 Store
- 📱 Адаптивная вёрстка — мобильный UX

---

### Запуск 🔑

```bash
npm install && npm run dev
```

| Команда                                           | Что делает                       |
| ------------------------------------------------- | -------------------------------- |
| `npm run dev`                                     | Дев-сервер с HMR                 |
| `npm run build`                                   | Продакшн-сборка                  |
| `npm run lint`                                    | ESLint + TS + Stylelint          |
| `npm test` · `npm test:ui` or `npm test:coverage` | Тесты (+ в браузере и по охвату) |

**Маршруты:** `/` `/sign-up` `/messenger` `/settings` `/404` `/500`

---

### Дизайн 📐

UI спроектирован до кода — **[открыть в Figma →](https://www.figma.com/design/SaTdkvEMsWoRl2dZn7S9Ab/middle.messenger.praktikum.yandex?node-id=0-1&p=f)**

---

_Сделан по лекалам 'Middle Web-Developer' [course](https://github.com/yandex-praktikum/middle.messenger.praktikum.yandex) by [Y.Praktikum](practicum.yandex.ru/profile/middle-frontend)_
