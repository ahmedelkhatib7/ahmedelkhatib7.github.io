# Post Template

Every blog post must have these sections in this order. Use `/blog/post01-environment-strategy.html` as the reference implementation.

## Structure

```
nav
breadcrumb
hero
[sidebar TOC + article body]
post footer
disclaimer
```

## Required Elements

1. **Nav** — sticky, logo + links. Identical to existing posts.
2. **Breadcrumb** — `Home / Writing / Post NN — Title`
3. **Hero** — series label, post title, tagline, author meta (photo + name + date + read time)
4. **Table of Contents** — sticky sidebar on desktop, inline on mobile. Links to every `§` section.
5. **Article body** — sections numbered `§ 01`, `§ 02`. `<h2>` for sections, `<h3>` for subsections.
6. **Post footer** — Ahmed's photo, name, one-line bio.
7. **Disclaimer** — verbatim: *"Everything in this post reflects my own experience and opinions. Not my employer's, not Microsoft's — mine."*

## Head

- `<title>` — specific to the post
- `<meta name="description">` — one-sentence summary
- `<meta name="viewport">` — standard responsive viewport
- Favicon link
- Google Fonts link (match existing posts)
- Stylesheet link

## Read Time

Count words in the article body. Divide by 200. Round to nearest minute. Display in the hero meta.

## Semantic HTML

Use `<article>`, `<nav>`, `<aside>`, `<section>`, `<main>` correctly. Images need descriptive `alt`.
