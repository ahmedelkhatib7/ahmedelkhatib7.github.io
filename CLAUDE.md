# Khatib365

Ahmed El-Khatib's personal brand and blog. Static HTML/CSS/JS on GitHub Pages at `https://khatib365.github.io`. The quality of this site reflects Ahmed's professional reputation — treat every file accordingly.

## Stack

- Pure HTML + CSS + JS. No frameworks, no build step, no npm.
- Hosted on GitHub Pages from the repo root. Works as plain files in a browser.

## Repo Map

```
/index.html              homepage & portfolio
/404.html                custom 404
/blog/                   all posts — postNN-slug.html
/blog/index.html         blog listing
/assets/photo.jpg        Ahmed's profile photo (sitewide)
/assets/favicon.svg
/assets/badges/          cert badges (.png)
/assets/icons/           UI icons (.svg)
/assets/screenshots/postNN/   all post images, scoped per post
/css/                    global stylesheets
/js/                     global scripts
/docs/                   agent reference files (read on demand — see below)
```

## How to Work

**Default loop:** read → plan → execute → commit. Work autonomously on clear tasks. Do not narrate intent before doing it.

**Only stop and ask when:**
- A decision affects brand or content direction
- The existing codebase is broken in a way that blocks the task
- Two approaches diverge significantly and the wrong choice forces rework

Do **not** ask permission to proceed on clear tasks. Do not ask what you can answer by reading files.

## Rules That Apply to Every Session

- **No real client names anywhere on the site.** Use `contoso` as the placeholder (`contoso-dev`, `contoso-uat`, `contoso-prod`).
- All internal links are **absolute from root** (`/blog/index.html`, not `../index.html`). This repo is the apex site, not a project page.
- Filenames are **kebab-case**. Blog posts: `postNN-slug.html` with zero-padded numbers.
- Screenshots go in `/assets/screenshots/postNN/` — never in the screenshots root.
- Dates use the format `March 2026`. Section headings use `§ 01`, `§ 02`, etc.
- Commit messages are specific: `Add Post 02 — DLP Policies`, not `update files`. One logical change per commit.
- Never commit broken HTML. Open the file and verify structure before committing.

## Progressive Disclosure — Read These On Demand

Before working on a task, decide which of these you need and read only those:

- **`/docs/visual-identity.md`** — fonts, color tokens, spacing, tone. Read before creating or restyling a page. Otherwise inferable from any existing page.
- **`/docs/post-template.md`** — required structure every blog post must follow (nav, breadcrumb, hero, TOC, sections, post footer, disclaimer). Read before creating a new post.
- **`/docs/series-roadmap.md`** — full list of posts in the Power Platform Deployment Series, linking rules, and the Mr. YOLO character brief. Read when writing a post or adding cross-links.
- **`/blog/post01-environment-strategy.html`** — the reference implementation. When in doubt about layout, structure, or voice, match this file.

**Prefer pointers to copies.** If you need a pattern, read the reference file directly — don't reproduce it from memory.

## Definition of Done

- HTML is valid and renders correctly
- Page is visually consistent with `post01-environment-strategy.html`
- All internal and external links resolve
- No real client names anywhere
- Blog index updated if a new post was added
- Committed with a clear, specific message
- Pushed to `main` (GitHub Pages deploys automatically)

## Escalation Format

When you do need to ask, be specific and include your proposed answer:

> "The blog index uses a card layout but I can't find a consistent date format in the existing posts — should I use 'March 2026' or 'Mar 2026'? Proposing 'March 2026' to match post01."

Not: "Should I proceed?" / "Is this the right approach?"
