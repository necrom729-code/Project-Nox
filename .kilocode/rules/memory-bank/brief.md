# Project Brief: NECROM

## Purpose

NECROM is a cross-platform cloud backup app with a cute chibi ghost mascot —
the "resurrection" theme: the app's job is making sure your documents, photos,
videos, and audio can always be brought back (hardware failure, ransomware,
accidental deletion, human error).

## Target Users

- Everyday users who want automatic, scheduled cloud backups
- Users who need one-tap restore/recovery of lost files
- Multilingual users (10 languages supported)

## Implemented As

A **responsive Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4**
web app (built with `bun`). The original product brief specified Flutter for
Android/iOS/Windows/macOS, but the dev environment is a web sandbox with no
Flutter toolchain, so the same feature set is delivered as a web app that works
on desktop and mobile browsers.

## Core Requirements

1. **Authentication** — email/password login/logout; session persisted across
   restarts until explicit logout.
2. **Automatic Cloud Backup** — scheduled (daily/weekly, user-configurable) +
   manual "back up now"; notifications on start/success/failure; one-tap restore.
3. **Media Preview & Playback** — in-app viewers for documents (PDF), photos
   (pinch/zoom), videos (play/pause/seek), audio (play/pause/seek).
4. **NECROM Mascot & Animation** — chibi ghost with idle / scroll-reactive /
   press states; smooth 60fps on desktop and mobile.
5. **Localization** — language switcher (EN, TH, FR, IT, DE, JA, KO, MS, ID, RU);
   every UI string pulled from translation files, no hardcoded text.

## Constraints

- Framework: Next.js 16 + React 19 + Tailwind CSS 4
- Package manager: bun
- Verify with `bun typecheck`, `bun lint`, `bun run build`
- Auth/backend currently mocked locally (swap for Firebase if infrastructure
  is later decided)
