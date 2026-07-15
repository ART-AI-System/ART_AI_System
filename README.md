# ART_AI_System

## Project Layout

```text
ART_AI_System/
  backend/   Node.js + Express + TypeScript API
  frontend/  React + Vite web application
  docs/      System specifications and architecture notes
  mockups/   Static UI mockups
  public/    Shared static assets and mockup images
  tools/     Local utility scripts and scratch files
```

## Run

From the repository root:

```powershell
npm install
npm run dev:backend
```

Run the frontend in another terminal:

```powershell
npm run dev:frontend
```

Backend defaults to `http://localhost:4000`.
Frontend defaults to the Vite dev server URL printed in the terminal.
