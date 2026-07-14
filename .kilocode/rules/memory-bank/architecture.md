# System Patterns: NECROM (Next.js App)

## Architecture Overview

```
src/
├── app/
│   ├── layout.tsx          # Root layout: <I18nProvider><AuthProvider>
│   ├── page.tsx            # Root redirect (-> /dashboard or /login)
│   ├── globals.css         # Tailwind + mascot keyframes
│   ├── login/page.tsx      # Login screen
│   ├── register/page.tsx   # Register screen
│   └── dashboard/
│       ├── layout.tsx      # Auth guard + <AppShell>
│       ├── page.tsx        # Overview
│       ├── backup/         # (Phase 2) backup engine + schedule
│       ├── files/          # (Phase 3) media library
│       ├── restore/        # (Phase 2) restore flow
│       └── settings/       # (Phase 5) language + schedule
├── components/
│   ├── ui/                 # Button, Card
│   ├── layout/             # AppShell (sidebar + topbar)
│   ├── mascot/             # GhostMascot (SVG + animation states)
│   ├── auth/               # (future) auth forms
│   └── media/              # (Phase 3) viewers/players
└── lib/
    ├── i18n/               # config, I18nProvider, messages, locales/*
    ├── auth/               # AuthProvider (session persistence)
    ├── backup/             # (Phase 2) scheduler + store
    └── notifications/      # (Phase 2) web notifications
```

## Key Patterns

- **Providers**: `I18nProvider` and `AuthProvider` wrap the app in root layout.
  Both read persisted state from `localStorage` via `useState` initializers
  (guarded by `typeof window`) to stay SSR-safe and lint-clean (no setState in
  effects).
- **i18n**: `useI18n().t(key, vars?)` resolves nested keys from
  `src/lib/i18n/locales/<lang>.ts`; falls back to English for missing keys.
  ALL UI text goes through `t()` — no hardcoded strings.
- **Server Components by default**; `"use client"` only for interactive parts.
- **Mascot**: presentational SVG with CSS-driven states (idle/press/scroll) in
  `globals.css`; respects `prefers-reduced-motion`.

## State Management

- `useContext` for auth + i18n (client).
- `localStorage` for session + locale persistence.
- (Phase 2) IndexedDB/localStorage for backup file metadata.
