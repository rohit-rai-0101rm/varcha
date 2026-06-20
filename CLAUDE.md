# Varcha — Project Memory

@docs/SRS.md
@docs/DESIGN_SYSTEM.md

## Stack
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: Node.js + Express, TypeScript
- Database: MongoDB via Mongoose
- Repo: single monorepo — `frontend/`, `backend/`, optional `shared/` for
  TS types used by both halves. Not two separate repos.

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

(Run `/init` after checkpoint 0 to fill this in from the actual codebase
— build commands, test commands, lint commands. Don't hand-write these
before there's code to scan.)

## Conventions

(Same — let `/init` discover indentation, file structure, and naming
from the real code, then refine here if it gets something wrong.)