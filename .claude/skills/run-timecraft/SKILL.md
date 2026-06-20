---
description: Launch and verify the TimeCraft React/Vite timetable dashboard with Playwright.
---

# Run TimeCraft

Use this skill to launch and drive the TimeCraft timetable web app.

## Launch frontend

```powershell
npm run dev -- --host 127.0.0.1
```

The app should be available at `http://127.0.0.1:5173/`.

## Launch backend API

```powershell
npm run server
```

The API runs at `http://127.0.0.1:4000` and defaults to `DATABASE=memory` unless `.env` selects MongoDB or PostgreSQL.

## Verified UI smoke test

```powershell
npm run test:ui
```

This Playwright test opens Chromium, verifies the dashboard renders, adds a schedule item, edits title/room/notes, and switches to Kanban view.

## Full validation

```powershell
npm run lint
npm run build
npm run test:ui
```
