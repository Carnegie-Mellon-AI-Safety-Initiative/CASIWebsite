# CLAUDE.md

This file gives guidance to Claude Code (claude.ai/code) for work in this repository.

## Project Overview

This is the static website for the Carnegie Mellon AI Safety Initiative (CASI).
It is one page with six screens: Home, About, Programs, Calendar, Blog, and Team.
JavaScript switches the screens. There is no build step and no package manager.

The page comes from a design prototype. A design tool produced it, and an unpack
step turned the single-file bundle into real files.

## Architecture

- `index.html` — the whole site. It holds the markup, the CSS, and the page data.
- `support.js` — the prototype template runtime. It reads the custom markup.
- `image-slot.js` — an image component that the runtime uses.
- `vendor/` — React 18.3.1 and React DOM, served locally, not from a CDN.
- `assets/` — photos, logos, team portraits, and the Aileron fonts.
- `assets/brand/` — the CASI logo files and the favicon.
- `.nojekyll` — stops GitHub Pages from running Jekyll on the files.

### The template runtime

`index.html` uses custom markup that `support.js` interprets:

- `<sc-for list={{ items }} as="item">` — repeat for each item.
- `<sc-if value={{ cond }}>` — render only when the condition is true.
- `{{ expression }}` — insert a value.
- `data-bg="path"` — set a CSS `background-image`.
- `<x-dc>` — the root of the template.
- A `<script type="text/x-dc">` block at the end of the file holds the page data
  and the state class. Edit content there, not in the markup.

To change text or content, edit `index.html` by hand. The design tool is no
longer in the loop.

### Fonts

- Aileron — self-hosted in `assets/fonts/`. Headings, labels, and buttons.
- DM Sans — loaded from Google Fonts. Body copy.

## Local Development

Serve the repository root. Do not open `index.html` as a file, because the
runtime needs HTTP.

```bash
python3 -m http.server 4399
# then open http://localhost:4399/
```

## Deployment

- GitHub Pages serves the site at the custom domain cmuaisafety.com.
- The `CNAME` file holds the domain.
- The default branch is `main`. A push to `main` publishes the site.
- There is no build step and no CI.

## External Services

- Blog posts live on Substack: https://carnegieaisafety.substack.com/
  The Blog screen reads the feed at https://carnegieaisafety.substack.com/feed
  This repository holds no blog post pages.
- The Calendar screen reads a public Google Calendar iCal feed.
  Calendar ID: `c_30fd9569f750ccfb1d8fcacd354e814213f016626f94a1848b8dee1a07e06513@group.calendar.google.com`
  The template also accepts a `gcalApiKey` prop for the Google Calendar API.
- Contact email: casi@andrew.cmu.edu

## Notes

- `design_handoff_casi_website/` holds the original design bundle and the
  handoff README. `.gitignore` excludes it. Keep it out of the repository.
- `blogs/` holds draft Markdown for Substack posts. It is not published.
