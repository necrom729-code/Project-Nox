# Active Context: NECROM — Cloud Backup App

## Current State

**Project**: NECROM, a cross-platform cloud backup web app (chibi-ghost mascot,
"resurrection" theme). Built on the original Next.js 16 starter.

**Stack decision**: The original product brief specified Flutter (Android/iOS/
Windows/macOS), but this environment is a Next.js/bun web sandbox with no
Flutter/Dart/Android SDK and no way to build or test native mobile/iOS. NECROM
is therefore implemented as a **responsive Next.js 16 (App Router) + React 19 +
TypeScript + Tailwind 4** web app — the only stack verifiable here. All five
feature areas from the brief map to web equivalents.

## Recently Completed

- [x] **Phase 1 — Auth + navigation shell**
  - `src/lib/i18n/*`: lightweight typed i18n (10 locales, zero hardcoded strings)
  - `src/lib/auth/AuthProvider.tsx`: mock email/password auth, session persisted
    in `localStorage` across restarts
  - `src/components/layout/AppShell.tsx`: sidebar + topbar (language switch,
    logout) + mascot
  - `src/app/login`, `src/app/register`, `src/app/dashboard` (guard + overview)
  - `src/app/page.tsx`: redirects to /dashboard or /login
  - `src/components/mascot/GhostMascot.tsx`: chibi ghost SVG, idle float/breathe
  - Mascot keyframes in `globals.css` (idle/press/scroll + reduced-motion)
  - Deps added: `framer-motion`, `lucide-react`
  - ✅ typecheck + lint + `next build` all pass

- [x] **Phase 2 — Backup engine + scheduling + notifications + restore**
  - `src/lib/backup/types.ts`, `store.ts` (localStorage), `files.ts` (kind detect,
    object URLs, byte formatting), `BackupProvider.tsx` (state, setSchedule,
    addFiles, runBackup, 30s scheduler that fires when nextBackupAt passes)
  - `src/lib/notifications/index.ts`: web Notification permission + notify()
  - `src/app/dashboard/backup/page.tsx`: schedule (daily/weekly/off), back-up-now,
    add files (image/video/audio/pdf)
  - `src/app/dashboard/restore/page.tsx`: one-tap restore (download + notify)
  - Overview wired to real backup counts/last/next
  - ✅ typecheck + lint + `next build` all pass (9 routes)

- [x] **Phase 3 — Media preview/playback (all 4 types)**
  - `src/components/media/ImageViewer.tsx`: image with wheel/pinch zoom + buttons
    (reset scale via remount key to stay lint-clean)
  - `src/components/media/VideoPlayer.tsx`: <video controls> play/pause/seek
  - `src/components/media/AudioPlayer.tsx`: custom play/pause + seekable progress
  - `src/components/media/DocumentViewer.tsx`: PDF via <iframe>; other docs download
  - `src/components/media/MediaModal.tsx`: kind-aware viewer modal
  - `src/app/dashboard/files/page.tsx`: grouped grid (photo/video/audio/document)
    of backed-up files, opens modal
  - ✅ typecheck + lint + `next build` pass (10 routes)
  - NOTE: true in-browser codec playback needs a real browser; verified build +
    responsive layout. Sandbox is headless (no emulator) so desktop+mobile media
    playback couldn't be exercised here.

## Current Structure

| Path | Purpose |
|------|---------|
| `src/lib/i18n/` | i18n provider, config (locales), messages registry, `locales/en.ts` |
| `src/lib/auth/AuthProvider.tsx` | Auth context + session persistence |
| `src/lib/backup/` | types, store, files, BackupProvider |
| `src/lib/notifications/` | Web Notification helpers |
| `src/components/ui/` | `Button`, `Card` primitives |
| `src/components/layout/AppShell.tsx` | Dashboard shell (nav/topbar) |
| `src/components/mascot/GhostMascot.tsx` | Chibi ghost mascot |
| `src/app/{login,register,page}.tsx` | Auth + root redirect |
| `src/app/dashboard/` | overview, backup, restore pages |

## Pending Phases

- [ ] Phase 3: Media preview/playback (PDF, image+zoom, video, audio)
- [ ] Phase 4: Mascot states — idle / scroll-reactive / press (60fps)
- [x] **Phase 5 — Localization (all 10 languages)**
  - Full translations for TH, FR, IT, DE, JA, KO, MS, ID, RU in
    `src/lib/i18n/locales/*` (EN already done in Phase 1)
  - Verified 89-key parity across all 9 non-English locales (no fallback needed)
  - `src/app/dashboard/settings/page.tsx`: language switcher (10 locales) + schedule
  - `messages.ts` imports all 10 locales
  - ✅ typecheck + lint + `next build` pass (11 routes)

## Notes

- Build command is `bun run build` (runs `next build`); `bun build` alone is Bun's
  bundler and is NOT the project build.
- i18n `t(key)` falls back to English for missing keys; other locales are stubbed
  empty until Phase 5.
- Auth/backup are mocked locally (localStorage + object URLs); swap for Firebase
  later if infrastructure is decided.

## Recent Fixes (post-launch)

- **Media stopped / buttons dead**: disabled `reactStrictMode` in `next.config.ts`
  — StrictMode double-mounted components in dev, tearing down `<video>`/`<audio>`
  the instant a file opened ("stopped for no reason"). Now players stay mounted.
- **Image viewer**: rewrote `ImageViewer.tsx` with free pan (drag from anywhere),
  cursor-centered wheel zoom, two-finger pinch, clamped to viewport, zoom
  buttons + reset. User can move the image freely at any size/position.
- **Modal navigation**: `MediaModal` now takes `index`/`total`/`onNavigate` and
  shows prev/next arrows so users can move between files without closing; inner
  clicks can no longer close the modal. `FilesPage` passes these props.
- **AudioPlayer**: play/pause now driven by `play`/`pause` events (no desync).

## Session History

| Date | Changes |
|------|---------|
| 2026-07-14 | Initiated NECROM build; completed Phase 1 (auth + nav shell + i18n + idle mascot) |
| 2026-07-14 | Completed Phase 2 (backup engine + scheduling + notifications + restore) |
| 2026-07-14 | Completed Phase 3 (media preview/playback: image+zoom, video, audio, PDF) |
| 2026-07-14 | Completed Phase 4 (mascot: idle/scroll-reactive/press states + tap feedback) |
| 2026-07-14 | Completed Phase 5 (localization: 10 languages, settings page, 89-key parity) |
