# Khatib365 — Claude Code Instructions

## Who You Are Working With

You are working on **Ahmed El-Khatib's** personal brand and blog — **Khatib365**.
This is a professional portfolio and technical blog hosted on GitHub Pages at `https://khatib365.github.io`.
The quality of this work directly reflects Ahmed's professional reputation. Treat every file you touch accordingly.

---

## The Site

- **Stack**: Static HTML + CSS only. No frameworks, no build tools, no npm, no bundlers.
- **Styles**: Blog posts embed a full `<style>` block inline in `<head>` — there is no shared blog stylesheet. The homepage (`index.html`) links to `/css/style.css` and `/css/blog.css`. Do not try to extract blog styles to an external file.
- **Hosting**: GitHub Pages — everything must work as plain files in the browser.
- **Repo**: You have full access. Read the existing files before writing anything new.

---

## Folder Structure — Source of Truth

This is the complete, canonical folder structure for the repo. Follow it exactly. Do not create folders outside this structure without asking first.

```
khatib365.github.io/
│
├── index.html                          → Homepage / portfolio
├── 404.html                            → Custom 404 page
├── CLAUDE.md                           → This file
├── README.md                           → Repo readme
│
├── blog/                               → All blog posts
│   ├── index.html                      → Blog listing page
│   ├── post00-mr-yolo.html             → Post 00 — Meet Mr. YOLO
│   ├── post01-environment-strategy.html → Post 01 — Environment Strategy
│   ├── post02-dlp-policies.html        → Post 02 (future)
│   ├── post03-solutions-101.html       → Post 03 (future)
│   └── ...                             → Follow same naming pattern
│
├── assets/
│   ├── photo.jpg                       → Ahmed's profile photo (used site-wide)
│   ├── favicon.svg                     → Site favicon
│   │
│   ├── badges/                         → Microsoft certification badge images
│   │   └── *.png
│   │
│   ├── icons/                          → UI icons used across the site
│   │   └── *.svg
│   │
│   └── screenshots/                    → All blog post images, organized by post
│       ├── post00/                     → Images for Post 00
│       │   ├── yolo-character-card.png
│       │   ├── yolo-story-begins.png
│       │   └── yolo-three-pillars.png
│       ├── post01/                     → Images for Post 01
│       │   ├── enable-dynamics-apps.png
│       │   ├── org-url.png
│       │   └── security-group.png
│       └── post02/                     → Images for Post 02 (create when needed)
│
├── css/                                → Global stylesheets (used by homepage only)
│   ├── style.css
│   └── blog.css
│
├── js/                                 → Global JavaScript (used by homepage only)
│   ├── main.js
│   └── blog.js
│
└── docs/                               → Reference docs for AI / collaborators
    ├── visual-identity.md             → Fonts, color tokens, CSS rules, image styling
    ├── post-template.md               → Required structure for every blog post
    └── series-roadmap.md              → Series table, linking rules, Mr. YOLO brief
```

---

### File Naming Rules

- All filenames are **kebab-case** — no spaces, no underscores, no camelCase
- Blog posts: `post00-slug.html`, `post01-slug.html` — zero-padded number + short descriptive slug
- Screenshots: always inside `assets/screenshots/postXX/` — never in the root screenshots folder
- Never use generic names like `image1.png`, `screenshot.png`, `final.png`

---

## Visual Identity — Non-Negotiable

Before writing a single line of HTML, read the existing `post01-environment-strategy.html` and the homepage `index.html` in full. The visual identity is:

- **Fonts**: Cormorant Garamond (display/headings) + Jost (body) + Fira Code (code/mono)
- **Colors** (CSS custom properties — exact values from `post01-environment-strategy.html`):
  - `--bg: #FAF7F1` (parchment) · `--surface: #F4EFE6` · `--surface2: #ECE4D5`
  - `--ink: #1C1812` · `--ink-soft: #453D31` · `--ink-mid: #7A6F60` · `--ink-light: #B5A99A`
  - `--copper: #9C5A2E` · `--copper-l: #C47A4A` · `--copper-pal: #F5EBE0`
  - `--border: #E0D5C4` · `--border2: #D4C8B4`
  - See `docs/visual-identity.md` for the full `:root` block including state/callout colors.
- **Tone**: Craftsman. Warm but authoritative. Editorial without being academic.
- **Every new page must be visually indistinguishable from the existing pages.** Match spacing, typography, nav, breadcrumb, footer — exactly.

---

## How You Work

### Autonomy
- **Work autonomously.** Do not ask for permission before each step.
- Read → Plan → Execute → Commit. That is your default loop.
- If a task is clear, do it. Do not narrate what you are about to do before doing it.

### When to Stop and Ask
Only pause and ask Ahmed when you hit one of these:
- You need a decision that affects content or brand direction (e.g. "should this section say X or Y?")
- You find something broken or inconsistent in the existing codebase that affects your task
- A task requires credentials, secrets, or external access you don't have
- You are genuinely unsure which of two approaches is correct and the wrong choice would require significant rework

**Do not ask for permission to proceed on clear tasks. Do not ask clarifying questions that you can answer by reading the existing files.**

### Token Efficiency
- Read files once, extract everything you need, then act.
- Do not re-read the same file multiple times unless it has changed.
- Do not make exploratory commits. Commit when a task is complete and verified.
- If you are stuck on something minor, solve it yourself. Only escalate blockers.

---

## Coding Standards

### HTML
- Semantic HTML5 — use `<article>`, `<nav>`, `<aside>`, `<section>`, `<main>` correctly
- Every page must have correct `<title>`, `<meta name="description">`, and `<meta name="viewport">`
- All internal links must be absolute from root (e.g. `/blog/index.html` not `../index.html`)
- Images must have descriptive `alt` attributes
- No inline styles except for one-off overrides — use CSS classes

### CSS
- Use CSS custom properties (variables) for all colors and fonts — never hardcode hex values in new rules
- Mobile-first. Every layout must be responsive. Test mentally at 375px, 768px, and 1280px.
- No `!important` unless overriding a third-party style
- Class names are kebab-case and descriptive (`.post-meta`, `.series-table-wrap` — not `.div1`, `.red-text`)

### Content
- **Never use a real client name anywhere on the site.** Use `contoso` as the fictional placeholder throughout — `contoso-dev`, `contoso-uat`, `contoso-prod`.
- All dates use the format: `March 2026`
- Read time estimates: count words, divide by 200, round to nearest minute
- Section numbers use the `§` symbol: `§ 01`, `§ 02`, etc.

### Git
- Commit messages are clear and specific: `Add Post 00 — Meet Mr. YOLO` not `update files`
- One logical change per commit — do not bundle unrelated changes
- Never commit broken HTML. Validate structure before committing.
- Branch if the change is large or risky. PR for anything that touches more than 2 files.

---

## Blog Post Standards

Every blog post must have:

1. **Nav** — identical to existing posts (sticky, logo + links)
2. **Breadcrumb** — `Home / Writing / Post XX — Title`
3. **Hero** — series label, post title, tagline, author meta (photo + name + date + read time)
4. **Table of Contents** — sticky sidebar on desktop, inline on mobile, links to all `§` sections
5. **Article body** — sections numbered with `§`, h2 for sections, h3 for subsections
6. **Post footer** — Ahmed's photo, name, bio line
7. **Disclaimer** — "Everything in this post reflects my own experience and opinions. Not my employer's, not Microsoft's — mine."

Post structure in the file:
```
nav → breadcrumb → hero → [sidebar TOC + article] → post footer → disclaimer
```

---

## The Series

This is the **Power Platform Deployment Series**. Every post is part of this series. The full roadmap:

| Post | Topic |
|------|-------|
| 00 | Meet Mr. YOLO — series intro |
| 01 | Environment Strategy |
| 02 | DLP Policies |
| 03 | Solutions 101 — Managed, Unmanaged, Publishers & Naming |
| 04 | Solution Architecture & Segmentation |
| 05 | ALM Foundations |
| 06 | Deployment Methods — The Decision Guide |
| 07 | Pipelines Deep-Dive: Power Platform Pipelines |
| 08 | Pipelines Deep-Dive: Azure DevOps & Build Tools |
| 09 | Pipelines Deep-Dive: GitHub Actions |
| 10 | Pipelines Deep-Dive: ALM Accelerator |
| 11 | Pipelines Deep-Dive: Solution Packager & CLI |
| 12 | Environment Variables & Connection References |
| ★  | Bonus — Solution XML Anatomy |

When linking between posts, always use the correct relative path from `/blog/`.
When a future post doesn't exist yet, do not create a dead link — render it as plain text with a "coming soon" tag.

---

## Mr. YOLO — Character Reference

Mr. YOLO is the recurring character throughout the series. He appears in every post making the mistake that the post then fixes.

- He is not a villain. He is a mirror.
- He is fast, creative, and well-intentioned — just undisciplined.
- His mistakes are recognizable, not cartoonish.
- Tone when writing him: warm, slightly self-deprecating humor. Never condescending.
- Every post has one "Mr. YOLO mistake" — the thing he does that the post fixes.

---

## Post 00 — Images

Three images must be embedded in Post 00. They are located at:

```
/assets/screenshots/post00/yolo-character-card.png
/assets/screenshots/post00/yolo-story-begins.png
/assets/screenshots/post00/yolo-three-pillars.png
```

**Do not reference the ALM session or any speaking event in the captions.** The session has not happened yet. Treat these as standalone post illustrations only.

### Placement & captions

**Image 1 — `assets/screenshots/post00/yolo-character-card.png`**
- Place in **§ 01 — Who Is Mr. YOLO?** immediately after the opening character description paragraph
- Caption: *Mr. YOLO — Speed 8/10. Confidence 10/10. Testing 2/10. Documentation 1/10. YOLO Factor 10/10.*
- Display at full content width with subtle border-radius matching the site style

**Image 2 — `assets/screenshots/post00/yolo-story-begins.png`**
- Place in **§ 01** immediately after Image 1
- Caption: *4:44 PM — "5 minutes. Easy." · 4:53 PM — APPLICATION DOWN, ERROR 500.*
- Display at full content width

**Image 3 — `assets/screenshots/post00/yolo-three-pillars.png`**
- Place in **§ 02 — What This Series Covers** after the series roadmap table
- Caption: *Environments. Solutions. Automation. Get these three right and deployment becomes something you trust any day of the week.*
- Display at full content width

### Image styling rules
- Wrap every image in a `<figure>` with a `<figcaption>` underneath
- `<figcaption>` uses the same muted style as existing figure captions on the site (`font-size: 0.82rem`, `color: var(--ink-light)`, `font-style: italic`, centered)
- Images are `width: 100%`, `border-radius: 4px`, `display: block`
- Add `loading="lazy"` to all three
- These images have a dark navy background — add a subtle `1px solid var(--border)` around them so they don't bleed into the parchment page background

---

## What "Done" Looks Like

A task is done when:
- [ ] The HTML is valid and renders correctly in a browser
- [ ] The page is visually consistent with existing pages
- [ ] All links work (internal and external)
- [ ] No real client names appear anywhere
- [ ] The blog index is updated to reflect the new post
- [ ] Changes are committed with a clear commit message
- [ ] The live site at `https://khatib365.github.io` reflects the changes

---

## Questions & Escalation

If you need to ask Ahmed something, be specific and efficient:

**Good:** "The blog index uses a card layout but I can't find a consistent date format in the existing posts — should I use 'March 2026' or 'Mar 2026'?"

**Bad:** "Should I proceed with creating the file?" / "Is this the right approach?" / "Let me know when you're ready for me to continue."

One question at a time. Include your proposed answer so Ahmed can confirm or redirect rather than think from scratch.
