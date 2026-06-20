# Varcha — Design System Reference

Final direction: **Craft journal.** An archive of technique, not just a catalog. Light and dark modes share the same structure — only the token values change.

## Fonts

```
Fraunces — display headings (weights 400/500/600/700)
Inter — body text and UI (weights 400/500/600/700)
Special Elite — small annotation labels only (style/origin tags), never body text
```

Load via Google Fonts:
```
https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=Special+Elite&display=swap
```

## Color tokens

Implement as CSS variables (or Tailwind theme extension) with a `data-theme="dark"` attribute switch on `<html>` — don't hardcode either mode's values into components.

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--bg` | `#F7F1E4` | `#1E1812` | Page background |
| `--surface` | `#FFFCF5` | `#2A2219` | Cards, panels, nav |
| `--ink` | `#2A2118` | `#F3EAD9` | Primary text |
| `--ink-soft` | `#6b5f53` | `#B8A98F` | Secondary/muted text |
| `--wine` | `#6E2A39` | `#D98FA0` | Primary brand accent, primary buttons, logo |
| `--gold` | `#B8902E` | `#D4AF4E` | Secondary accent, ghost buttons, CTAs |
| `--sketch` | `#8B6F47` | `#B8956B` | Hand-drawn technique marks, annotation text |
| `--line` | `#E0D4BC` | `#3D3324` | Borders, dividers |
| `--rose-bg` | `#F6E7E9` | `#3A2228` | "Exclusive edit" badge background |
| `--rose-ink` | `#6E2A39` | `#E8B9C2` | "Exclusive edit" badge text |

Dark mode is not an inverted light mode — note `--wine` and `--gold` are *lightened* in dark mode for contrast, not just swapped. Don't auto-generate dark mode from light values; use the table above exactly.

## Signature motif system — tied to `Styles.family`

This is the part that scales. Every Style record already has a `family` field (`indian-craft` / `global-tradition` / `aesthetic` — see SRS Section 6.3). Render one of three small inline SVG marks next to a product's origin label, chosen automatically by that family — never hand-assign a unique icon per style, there are 30+ and growing.

| Family | Motif | SVG pattern |
|---|---|---|
| `indian-craft` | Flowing wire-scroll (filigree-inspired) | A single wavy `<path>`, `stroke="var(--sketch)"`, no fill |
| `global-tradition` | Row of small dots (beadwork-inspired) | 4-5 small `<circle>` elements, evenly spaced, `fill="var(--sketch)"` |
| `aesthetic` | Plain horizontal bracket/line | A single thin `<rect>`, `fill="var(--sketch)"` |

If a product has multiple styles spanning different families, use the first style's family for the motif — don't try to render multiple motifs per product, it clutters the card.

## Components

- **Buttons**: `border-radius: 8px`, primary = wine background + surface text, ghost = gold border + gold text, no fill
- **Cards**: `border: 1px solid var(--line)`, `border-radius: 8px` (product cards) or `10-14px` (panels), no drop shadows except a single soft shadow on top-level page sections (`0 18px 36px -20px rgba(0,0,0,.18)` light / `rgba(0,0,0,.5)` dark)
- **Badges**: `border-radius: 5px`, background/text pulled from the matching color pair (e.g. rose-bg/rose-ink) — never plain black text on a colored background
- **Origin/annotation labels**: always Special Elite, always paired with the family motif SVG, always `var(--sketch)` color
- **Nav/logo**: logo in Fraunces 700, wine-colored; nav links in Inter, ink-soft color

## What NOT to do

- Don't introduce a second display font "just for variety" — Fraunces carries the whole personality, adding another serif dilutes it
- Don't use Special Elite for anything longer than a short tag/label — it's illegible at body-text length
- Don't let the motif system grow past three variants — the whole point is that 30+ styles stay manageable through three rules, not three dozen
- Don't reuse `--wine` for error/danger states — keep semantic states (success/error/warning) on their own separate tokens, not borrowed from brand colors