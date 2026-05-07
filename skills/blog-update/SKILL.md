# Blog Update Skill

Use this skill to add new CASI blog drafts from the `blogs/` folder into the website.

## Goal

Create a new blog post page and add a corresponding card on `blog.html` using the existing CASI style and structure.

## Inputs

- One or more markdown files in `blogs/`
- Desired publish date (if not in file metadata)
- Optional final title override

## Workflow

1. Read `blog.html` and one recent post page (for template consistency).
2. Read the new markdown draft from `blogs/`.
3. Create a new file named `blog-<slug>.html` in the repo root.
4. Preserve the site navbar/footer and use classes:
   - `blog-post-main`
   - `blog-post-article`
   - `blog-post-title`
   - `blog-post-meta`
   - `blog-post-author`
   - `blog-post-published blog-post-published--footer`
5. Convert markdown sections to clean HTML:
   - headings -> `h3.blog-section-heading`
   - lists -> `ul.blog-bullet-list` or `ol.blog-ref-list`
   - links -> `<a class="text-link" ...>`
6. Add a new card near the top of `blog.html`:
   - title link to the new page
   - one-sentence summary
   - `<time datetime="YYYY-MM-DD">M/D/YYYY</time>`
7. Ensure post page has:
   - footer published line above back link
   - back link to `blog.html`
8. Run lints/check diagnostics for edited files.

## Quality checks

- Navigation and footer match existing pages.
- No broken local links.
- Card order in `blog.html` is newest-first unless requested otherwise.
- Author names and published date are consistent between post page and listing card.

## Output

- New `blog-*.html` post page(s)
- Updated `blog.html` with new card(s)
