# Varcha

E-commerce platform for an artificial jewelry brand — Yarn Workspace monorepo.

## Prerequisites

- Node.js 20+
- Yarn 1.x (classic)
- MongoDB (local or Atlas)

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your values:
   ```
   cp .env.example .env
   ```
3. Install all dependencies from the repo root:
   ```
   yarn install
   ```

## Development

Open two terminals from the repo root:

```bash
# Terminal 1 — backend (http://localhost:4000)
yarn dev:backend

# Terminal 2 — frontend (http://localhost:3000)
yarn dev:frontend
```

Health check: `GET http://localhost:4000/api/health`

## Project structure

```
varcha/
├── frontend/      # Next.js App Router (port 3000)
├── backend/       # Express + Mongoose (port 4000)
└── shared/        # TypeScript types shared between frontend and backend
```

## Useful commands

```bash
yarn lint            # lint all workspaces
yarn format          # prettier across the whole repo
yarn build:backend   # compile backend to dist/
yarn build:frontend  # next build
```
