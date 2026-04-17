# Visual Identity

The authoritative reference is `post01-environment-strategy.html` and `index.html`. This file exists to speed up orientation — when there's any conflict between this file and those pages, the pages win.

## Typography

- **Display / headings:** Cormorant Garamond
- **Body:** Jost
- **Code:** JetBrains Mono

All three are loaded via Google Fonts in the page `<head>`. Check an existing page for the exact link tags.

## Color Tokens

Defined as CSS custom properties in `/css/`. Do not hardcode hex values in new rules.

| Token | Hex | Use |
|---|---|---|
| `--parchment` | `#FAF6EF` | Page background |
| `--ink` | `#1C1814` | Primary text |
| `--ink-soft` | `#3D3530` | Secondary text |
| `--ink-faint` | — | Captions, meta (see existing CSS) |
| `--terracotta` | `#A0522D` | Primary accent |
| `--copper` | `#B87333` | Secondary accent |
| `--gold` | `#C9A84C` | Highlight accent |
| `--border` | `#DDD0BC` | Dividers, frames |

## Tone

Craftsman. Warm but authoritative. Editorial, not academic. Every new page must be visually indistinguishable from the existing ones — match spacing, nav, breadcrumb, footer exactly.

## CSS Rules

- Use custom properties for all colors and fonts. Never hardcode.
- Mobile-first. Test mentally at 375px, 768px, 1280px.
- Kebab-case class names. Descriptive, not positional (`.post-meta`, not `.div1`).
- No `!important` unless overriding a third-party style.
- No inline styles except genuine one-offs.

## Images

- Wrap in `<figure>` with `<figcaption>` underneath.
- Captions: `font-size: 0.82rem`, `color: var(--ink-faint)`, italic, centered.
- Images: `width: 100%`, `border-radius: 4px`, `display: block`, `loading="lazy"`.
- Images with dark backgrounds get `1px solid var(--border)` so they don't bleed into parchment.
