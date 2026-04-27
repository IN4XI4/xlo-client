# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server (Vite)
npm run build      # production build
npm run lint       # ESLint (0 warnings allowed)
npm run preview    # preview production build
```

No test suite is configured.

## Stack

- **React 18** + **Vite** (ESM, no CJS)
- **Tailwind CSS** + **Flowbite React** for UI components
- **React Router v6** for routing
- **Axios** for all API calls — token auth via `localStorage.getItem("token")`
- **react-icons** for icons
- PWA via `vite-plugin-pwa`

## Environment

`VITE_API_BASE_URL` — base URL for all API calls (e.g. `http://localhost:8000/`). All `*.api.js` files append their own path segment to this base.

## Architecture

### API layer (`src/api/`)

Each file creates its own `axios.create({ baseURL: VITE_API_BASE_URL + "<segment>/" })` instance. Auth headers are always added manually via a local `getAuthHeaders()` helper that reads `localStorage`. There is no global Axios interceptor.

| File | Base segment |
|---|---|
| `base.api.js` | *(root)* |
| `blog.api.js` | `blog/` |
| `users.api.js` | `users/` |
| `spaces.api.js` | `spaces/` |
| `avatar.api.js` | `avatar/` |
| `attempts.api.js` | `attempts/` |
| `assessments.api.js` | `assessments/` |
| `wallet.api.js` | `wallet/` |

### Routing & page layout (`src/App.jsx`)

All routes live in `App.jsx`. Protected routes wrap children in `<ProtectedRoute>` which checks `localStorage` for a token. `ConditionalNavigationBar` and `ConditionalFooter` hide themselves on `/login` and a few other paths.

### Global state (`src/context/`)

Three React contexts, all provided at the root in `Root()`:

- **`UserContext`** — authenticated user object (`user`, `setUser`). Loaded once in `Navigation` on mount and stored in context; consumed everywhere with `useUser()`.
- **`SpaceContext`** — active space, persisted to `localStorage`. Consumed with `useSpace()`.
- **`ScrollContext` (AppStateContext)** — scroll state and story/card titles for the sticky nav bar. Also exposes `navigationKey` / `refreshNavigation()` to force a user reload. Consumed with `useAppState()`.

### User levels & feature flags (`src/globals.js`)

Level constants (`CREATOR_LEVEL_1 = 4`, `PREMIUM = 10`, etc.) gate features throughout the app. Import from `globals.js` — do not hardcode numeric levels inline.

### Component conventions

- All styling is done via Tailwind `className` — **do not use inline `style` props**.
- **Use `<div>` as the default HTML element.** Only switch to a semantic tag (`<button>`, `<input>`, `<form>`, `<span>` for truly inline content, etc.) when it is functionally required. Never reach for `<p>`, `<h1>`–`<h6>`, `<section>`, `<article>`, `<ul>`, `<li>`, etc. for layout or grouping; a `<div>` with the appropriate Tailwind classes is preferred.
- Components are named exports (e.g. `export function MyComponent()`), not default exports — except pages created by tooling that defaulted to default exports (being migrated).
- Modals render inline in the JSX tree and are conditionally mounted (`{isOpen && <MyModal />}`), not portals.
- The brand primary blue is `#3DB1FF`. Use it directly as an arbitrary Tailwind value (`text-[#3DB1FF]`, `border-[#3DB1FF]`, etc.).

### Page layout pattern

Every page wrapper uses:
```jsx
<div className="pt-24 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32">
```
`pt-24` clears the fixed navigation bar. All new pages must follow this pattern.

### New feature checklist

1. Create the page in `src/pages/`, export as a named export.
2. Add a `<Route>` in `src/App.jsx` (wrap with `<ProtectedRoute>` if auth-required).
3. Add any API calls to the appropriate `src/api/*.api.js` (or create a new one following the existing pattern).
4. New component folders go under `src/components/<feature-name>/`.
