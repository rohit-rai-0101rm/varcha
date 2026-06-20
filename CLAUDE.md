# Varcha — Project Memory

@docs/SRS.md
@docs/DESIGN_SYSTEM.md

## Stack
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: Node.js + Express, TypeScript
- Database: MongoDB via Mongoose
- Repo: single monorepo, set up as a **Yarn Workspace** — one root
  package.json with `"workspaces": ["frontend", "backend", "shared"]`,
  one yarn.lock at the root, one `yarn install` run from the root rather
  than three separate installs. This is what makes `shared/` actually
  usable — both halves import shared TS types as a real workspace
  reference, not a relative-path hack. Not two separate repos, and not
  three independent unrelated folders either.

## Package manager
- Yarn only, not npm. Every install/add/remove command uses `yarn`, not
  `npm install` / `npm i`. When scaffolding anything (Next.js, etc.),
  pass whatever flag selects Yarn rather than letting it default to npm.
- Commit `yarn.lock` to the repo — lockfiles are not gitignored, they're
  meant to be tracked.
- If a `package-lock.json` ever appears anywhere in the repo, that's a
  sign npm got used by mistake — delete it and reinstall with `yarn`,
  don't keep both lockfiles side by side.

## UI library rule
- No heavy component library (no MUI, Chakra, Ant Design). Tailwind
  handles layout/responsiveness directly — that's the whole point of
  using it.
- For components that need real accessible behavior — dropdowns,
  modals, tabs, toasts — use shadcn/ui. These are copied into the
  codebase as unstyled Radix primitives and restyled with our own
  Tailwind classes from docs/DESIGN_SYSTEM.md. Never leave a shadcn
  component in its default look — it must use our tokens.
- Everything else (cards, nav, hero sections) is plain JSX + Tailwind,
  no library needed.

## Rules a code scan won't discover — hold these every session

- Category and style fields are dropdown/multi-select only, sourced from
  the real Categories/Styles collections. Never free-text, even if it
  seems faster to add a quick text input. (FR-30 — this is fixing a real
  bug found on a previous vendor's site, not a style preference.)
- The premium/exclusive line is prepaid-only. Do not add a COD option
  anywhere in that checkout without being explicitly told to — this was
  a deliberate margin/RTO decision, not an oversight.
- Premium-line products are never listed on Amazon or Flipkart, and
  marketplace-line products never get their own checkout. The two
  channels never overlap on the same product.
- Card and payment details are never logged or stored on our servers —
  only the payment gateway's transaction reference. Check this in any
  PR that touches checkout or payments.
- Phone number is a required field on signup, not optional.
- The marketing-consent checkbox (signup and checkout) defaults to
  unchecked. Never default it to checked.
- Use the design tokens in docs/DESIGN_SYSTEM.md — CSS variables, light/
  dark via `data-theme`. Don't invent new colors or fonts ad hoc.
- A Style's `family` field (indian-craft / global-tradition / aesthetic)
  drives which of three SVG motifs shows next to a product's origin
  label. Three motifs only — never design a new one-off icon per style.

## Documentation sync rule

If a change in this session adds, removes, or modifies anything that
matches an existing FR/NFR or schema entry in docs/SRS.md, update
docs/SRS.md in the same session — don't let code and spec drift apart.
Add a one-line entry to its Revision History table describing what
changed and why. Same applies to docs/DESIGN_SYSTEM.md if a visual/
component decision changes, and docs/Claude_Code_Build_Prompts.md if a
checkpoint's actual scope changes from what's written there.

If the change is a genuine pivot (a new business model fork, a brand
direction change, anything that would warrant a real conversation, not
just a doc edit) — stop and flag it instead of quietly updating the SRS
to match. That kind of change goes back to the human for a decision
first, not into a silent doc edit.

## Commands

All commands run from the **repo root** unless noted.

```bash
# Install / add deps
yarn install                        # install everything (run once after clone)
yarn workspace varcha-backend add <pkg>     # add a backend dep
yarn workspace varcha-frontend add <pkg>    # add a frontend dep

# Dev servers
yarn dev:backend                    # Express on http://localhost:4000  (nodemon + ts-node)
yarn dev:frontend                   # Next.js on http://localhost:3000

# Build
yarn build:backend                  # tsc → backend/dist/
yarn build:frontend                 # next build
yarn workspace varcha-shared build  # tsc → shared/dist/  (needed before backend build)

# Lint / format
yarn lint                           # eslint across all workspaces
yarn format                         # prettier --write .
yarn workspace varcha-backend lint  # backend only
```

No test suite yet — add the command here when tests are introduced.

**Health check:** `GET http://localhost:4000/api/health` → `{ status: "ok", db: "connected" }`

## Architecture

```
varcha/
├── shared/src/index.ts   # All domain TS types — User, Product, Order, Style, etc.
│                         # Both backend and frontend import from "varcha-shared"
├── backend/src/
│   ├── index.ts          # Express entry: loads .env from repo root, mounts routers
│   ├── db.ts             # Mongoose connect + getDbStatus(); .env must be at repo root
│   └── routes/           # One file per resource group (health.ts is the only one now)
└── frontend/
    ├── app/              # Next.js App Router — layouts and pages go here
    │   ├── layout.tsx    # Root layout: loads fonts, sets data-theme="light" on <html>
    │   └── globals.css   # CSS variables for all design tokens (light + dark)
    ├── components/       # Shared UI components — client components marked 'use client'
    └── tailwind.config.ts  # Token aliases: bg-wine, text-ink-soft, font-display, etc.
```

**Dotenv quirk:** `backend/src/index.ts` loads `.env` via `path.resolve(__dirname, '../../.env')` because nodemon runs from `backend/` but the `.env` lives at the repo root. Don't move `.env` into `backend/`.

**Theme system:** `data-theme="light|dark"` on `<html>` drives all color switches via CSS variables in `globals.css`. Tailwind color utilities (`bg-wine`, `text-ink-soft`, etc.) are aliases to those CSS variables — components stay theme-neutral automatically.

**Adding a new API route:** create `backend/src/routes/<resource>.ts`, export a Router, mount it in `backend/src/index.ts` under `/api`.

**Adding a new page:** create `frontend/app/<route>/page.tsx`. Server component by default; add `'use client'` only when the component needs browser APIs or React state.

## Conventions

- 2-space indent, single quotes, trailing commas — enforced by `.prettierrc`
- Backend: CommonJS (`module: "CommonJS"` in tsconfig), so `require`-style interop works
- Frontend: `moduleResolution: "bundler"` — use `@/` alias for imports within `frontend/`
- Shared types use plain `string` for ObjectId refs (not `mongoose.Types.ObjectId`) so they're usable in the frontend without pulling in Mongoose
- The shared TS interface is named `EngagementEvent` (not `Event`) to avoid colliding with the DOM `Event` type. The Mongoose model will still be named `Event` → `events` collection, matching SRS §6.7