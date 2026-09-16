# Astro + React + Tailwind v4 + GitHub Pages toolchain facts

Resolves issue #11 (part of #8). Researched 2026-09-15 against primary sources
only: docs.astro.build, tailwindcss.com/docs, headlessui.com, the
withastro/action and actions/upload-pages-artifact repositories, docs.github.com,
and the npm registry (`npm view`). Where a claim comes from running the actual
packages rather than reading docs, it is marked **[verified locally]** and the
exact setup is described. Where the docs are silent, that is said explicitly.

Sections follow the seven questions in the ticket, then "Implications for the
CASI rebuild".

---

## 1. Versions and wiring Tailwind v4 into Astro

### Current stable versions (`npm view <pkg> version`, 2026-09-15)

| Package | Version | Notes |
|---|---|---|
| `astro` | 7.3.2 | dist-tag `latest`; `engines.node >=22.12.0`, `npm >=9.6.5`; `sharp ^0.35.4` is an `optionalDependencies` entry |
| `@astrojs/react` | 6.0.5 | peers: `react`/`react-dom` `^17.0.2 \|\| ^18.0.0 \|\| ^19.0.0` |
| `tailwindcss` | 4.3.3 | |
| `@tailwindcss/vite` | 4.3.3 | peer `vite ^5.2.0 \|\| ^6 \|\| ^7 \|\| ^8` (Astro 7 ships Vite 8, see below) |
| `@headlessui/react` | 2.2.10 | peers: `react`/`react-dom` `^18 \|\| ^19 \|\| ^19.0.0-rc`; last published 2026-04-13 |
| `react` / `react-dom` | 19.3.0 | |
| `@astrojs/tailwind` | 6.0.2 | **legacy**: peers `astro ^3 \|\| ^4 \|\| ^5` and `tailwindcss ^3.0.24`; last published 2025-09-18; does not support Astro 7 or Tailwind 4 |
| `sharp` | 0.35.4 | `engines.node >=20.9.0` |

Source: npm registry via `npm view astro version engines optionalDependencies dist-tags`,
`npm view @astrojs/react peerDependencies`, `npm view @tailwindcss/vite peerDependencies`,
`npm view @headlessui/react peerDependencies time.modified`,
`npm view @astrojs/tailwind peerDependencies time.modified`.

No version incompatibility was found in this matrix: Astro 7.3.2 + @astrojs/react 6.0.5
+ React 19.3 + Headless UI 2.2.10 + Tailwind 4.3.3 + @tailwindcss/vite 4.3.3 all
satisfy each other's peer ranges.

### Astro 7 notes that matter for a fresh project

From https://docs.astro.build/en/guides/upgrade-to/v7/ :

- "Astro v7.0 upgrades to Vite 8 as the development server and production bundler."
  (`@tailwindcss/vite` 4.3.3 declares `^8` in its peer range, so this is fine.)
- Rust compiler is now the default and "is stricter about invalid HTML syntax";
  unclosed tags are build errors.
- New default Markdown processor is Sätteri, not remark/rehype. Unified plugins
  need `@astrojs/markdown-remark` configured explicitly.
- `compressHTML` default changed from `true` to `'jsx'`: "Now, Astro strips
  whitespace from your HTML using JSX rules by default ... The following example
  would render as helloworld in Astro v7.0, instead of hello world in Astro
  v6.x: `<span>hello</span> <em>world</em>`". Fix with `{" "}` or set
  `compressHTML: true`.
- `src/fetch.ts` is now a reserved file name.
- `@astrojs/db` was removed.

### Supported way to wire Tailwind v4 into Astro: the Vite plugin

Astro's styling guide (https://docs.astro.build/en/guides/styling/): "In Astro
`>=5.2.0`, use the `astro add tailwind` command for your package manager to
install the official Vite Tailwind plugin." Then `@import "tailwindcss";` in a
CSS file and import that file in a layout. The same page describes
`@astrojs/tailwind` as "Legacy Tailwind 3 support" and says "Installing these
dependencies manually is only used for legacy Tailwind 3 compatibility, and is
not required for Tailwind 4."

Tailwind's own Astro guide
(https://tailwindcss.com/docs/installation/framework-guides/astro) gives the
manual equivalent:

```bash
npm install tailwindcss @tailwindcss/vite
```

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

```css
/* src/styles/global.css */
@import "tailwindcss";
```

```astro
---
import "../styles/global.css";
---
```

**Status of `@astrojs/tailwind`:** not deprecated on npm (no `deprecated` field),
but its peer ranges (`astro ^3||^4||^5`, `tailwindcss ^3.0.24`) exclude both
Astro 7 and Tailwind 4, and the Astro docs describe it as legacy/v3-only. Do not
use it.

### React integration wiring

From https://docs.astro.build/en/guides/integrations-guide/react/ : `npx astro add react`
installs `@astrojs/react`, `react`, `react-dom`, `@types/react`, `@types/react-dom`,
and `tsconfig.json` needs:

```json
{ "compilerOptions": { "jsx": "react-jsx", "jsxImportSource": "react" } }
```

The page notes that children passed from Astro components to React components
"are parsed as strings rather than React nodes by default"
(`experimentalReactChildren` flips that). This matters for Headless UI (see 6).

---

## 2. Astro `<Image>` / `<Picture>`

Source unless noted: https://docs.astro.build/en/reference/modules/astro-assets/
(prop reference) and https://docs.astro.build/en/guides/images/ (guide).

### Output formats

- `format` prop: "Default: `.webp` for local images". Any `ImageOutputFormat`
  (`avif`, `webp`, `png`, `jpg`, ...) can be set per image.
- `<Picture formats={['avif', 'webp']}>` produces one `<source>` per format
  plus an `<img>` fallback. Guide example output:

  ```html
  <picture>
    <source srcset="/_astro/my_image.hash.avif" type="image/avif" />
    <source srcset="/_astro/my_image.hash.webp" type="image/webp" />
    <img src="/_astro/my_image.hash.png" width="1600" height="900" decoding="async" loading="lazy" alt="..." />
  </picture>
  ```

- `formats` default: `['webp']`. `fallbackFormat` default: "`.png` for static
  images, `.jpg` for JPG, `.gif` for animated, `.svg` for SVG".

### `widths` / `sizes` / `densities` / `layout`

- `widths` (astro@3.3.0): "Generates `srcset`; requires `sizes` property.
  Ignores widths larger than original image."
- `sizes` (astro@3.3.0): required when `widths` is specified.
- `densities` (astro@3.3.0): "Generates `srcset` for pixel density;
  incompatible with `layout` or `widths`."
- `layout` (astro@5.10.0): `'constrained' | 'full-width' | 'fixed' | 'none'`,
  default `image.layout | 'none'`. "Automatically generates responsive `srcset`
  and `sizes`". With a layout set, Astro picks widths from
  `image.breakpoints` (defaults `[640, 750, 828, 1080, 1280, 1668, 2048, 2560]`
  for local images) capped at the source width, and emits e.g.
  `sizes="(min-width: 800px) 800px, 100vw"` (configuration reference,
  https://docs.astro.build/en/reference/configuration-reference/).
- `image.responsiveStyles: true` (default `false`) adds the small global
  stylesheet that makes `constrained`/`full-width` images resize with their
  container.
- Guide: "Images in your public/ folder are never optimized, and responsive
  images are not supported."

### `loading` / `decoding` defaults and the LCP image

- Guide: the `<img>` produced "includes `alt`, `loading`, and `decoding`
  attributes and infers image dimensions to avoid Cumulative Layout Shift".
  Every prerendered example in the guide shows `loading="lazy"`,
  `decoding="async"`, and (with `layout`) `fetchpriority="auto"`.
- `priority` prop (astro@5.10.0, boolean, default `false`): "Sets
  `loading="eager"`, `decoding="sync"`, `fetchpriority="high"`". This is the
  documented way to mark the LCP hero image. Passing the three attributes by
  hand is equivalent.

### Remote images

- Guide: "Astro's image components and helper function will only process
  (e.g. optimize, transform) images from authorized image sources specified in
  your configuration. Remote images from other sources will be displayed with
  no processing." Authorize with `image.domains: ["example.com"]` or
  `image.remotePatterns` (config reference, both default `[]`).
- Unauthorized remote images still work through `<Image>` but are emitted as a
  plain `<img>`; the docs say this still "prevents Cumulative Layout Shift".
- `width`/`height` are required for remote and `public/` images unless
  `inferSize` (astro@4.4.0, default `false`) is set, which fetches the remote
  image at build to read its dimensions.
- Cache: "Astro stores processed image assets in a cache directory during site
  builds for both local and remote images from authorized sources. ... The
  default cache directory is `./node_modules/.astro`". "Remote images in the
  asset cache are managed based on HTTP Caching, and respect the
  `Cache-Control` header returned by the remote server."

### Does `sharp` run in GitHub Actions without extra setup?

- Guide: "Sharp is the default image service used for astro:assets." and the
  config default is `{entrypoint: 'astro/assets/services/sharp'}`.
- `npm view astro optionalDependencies` -> `sharp ^0.35.4`, i.e. sharp is
  installed automatically by `npm install astro`. The docs' only caveat is for
  strict package managers: "When using a strict package manager like pnpm, you
  may need to manually install Sharp into your project".
- `npm view sharp optionalDependencies` lists prebuilt `@img/sharp-linux-x64`
  and `@img/sharp-libvips-linux-x64` packages, and the README on the registry
  says "Most modern macOS, Windows and Linux systems do not require any
  additional install or runtime dependencies." `engines.node >=20.9.0`.
- The `withastro/action` runs `npm install` on `ubuntu-latest` with Node 24 by
  default (its `action.yml`), which is inside sharp's supported matrix.
- Conclusion: yes, no extra setup on `ubuntu-latest` with npm and a committed
  `package-lock.json`. Escape hatch if a host cannot run sharp:
  `passthroughImageService()` (guide, "no-op image service").
- The docs are silent about Actions specifically; the conclusion above is
  inferred from the package metadata plus the action's runner/Node defaults.

---

## 3. Content collections with `glob` and `file` loaders over JSON/YAML

Source: https://docs.astro.build/en/guides/content-collections/

### Config file and schema

- Collections are defined in `src/content.config.ts` (`.js`/`.mjs` also work)
  and exported as `export const collections = { ... }`.
- Schema uses Zod: `import { z } from "astro/zod"`; `defineCollection({ loader,
  schema: z.object({...}) })`. `reference("otherCollection")` links entries
  across collections; the `image()` schema helper "lets you validate and import
  the image" so a path in a data file becomes `ImageMetadata` usable with
  `<Image>` (images guide).
- Access: `getCollection('name')`, `getEntry('name', 'id')`; each entry has
  `id`, `data`, and `body` (Markdown-family only).

### `glob()` loader (one file per entry)

- "The `glob()` loader fetches entries from directories of Markdown, MDX,
  Markdoc, JSON, YAML, or TOML files from anywhere on the filesystem."
- Signature: `glob({ pattern: "**/*.json", base: "./src/data/authors",
  generateId?: ({ entry }) => string })`.
- IDs: "When using the `glob()` loader with Markdown, MDX, Markdoc, JSON, or
  TOML files, every content entry id is automatically generated in a
  URL-friendly format based on the content filename." (YAML is not named in
  that sentence, although the loader accepts `.yaml`; treat YAML ids as
  filename-derived but verify in a spike.) A `slug` property in frontmatter or
  in the JSON object overrides the generated id.

### `file()` loader (one file, many entries) - yes, a JSON array can back a collection

- "The `file()` loader fetches multiple entries from a single local file
  defined in your collection. The `file()` loader will automatically detect and
  parse (based on the file extension) a single array of objects from JSON and
  YAML files, and will treat each top-level table as an independent entry in
  TOML files."
- Two accepted shapes:

  ```json
  [
    { "id": "poodle", "coat": "curly", "shedding": "low" },
    { "id": "afghan", "coat": "short", "shedding": "low" }
  ]
  ```

  ```json
  { "poodle": { "coat": "curly" }, "afghan": { "coat": "silky" } }
  ```

- The docs' schema for the array form includes `id: z.string()` in the
  `z.object`.
- Nested documents: `file("src/data/pets.json", { parser: (text) =>
  JSON.parse(text).dogs })`. `parser` can be async and also handles formats
  like CSV.

### How that reads for someone editing on GitHub

The docs do not discuss editing ergonomics. Practical reading of the two shapes:

- `file()` over one JSON array (`src/data/team.json`) is one file to find and
  one commit per change, but a missing comma anywhere breaks every entry, and
  GitHub's web editor gives no schema hints. YAML via `file()` removes the
  comma problem and allows comments.
- `glob()` over per-entry YAML (`src/data/programs/seminar.yaml`) is the
  friendliest for non-developers: each entry is a short file with `key: value`
  lines, the file name is the id, and Astro's Zod schema reports which file and
  field failed at build time. Adding an entry is "Add file" in the GitHub UI.
- Either way, a build failure from a bad edit only surfaces in the Actions run,
  not in the editor, so the deploy workflow should be the guard (see 5).

---

## 4. Fetching remote data at build time (.ics and RSS) and loader caching

### In page frontmatter

https://docs.astro.build/en/guides/data-fetching/ : "All Astro components have
access to the global `fetch()` function in their component script ... This fetch
call will be executed at build time, and the data will be available to the
component template". "Your deployed Astro site will fetch data once, at build
time. In dev, you will see data fetches on component refreshes." Top-level
`await` is allowed in frontmatter.

### In a content-collection loader

https://docs.astro.build/en/reference/content-loader-reference/ :

- Inline loader (an async function returning an array/object): "At
  build-time, the loader will automatically clear the data store and reload
  all the entries. No further customization options or helpers for data
  handling are provided."
- Object loader: `{ name, load({ store, meta, logger, config, parseData,
  generateDigest, watcher, refreshContextData, renderMarkdown }), schema? }`.
  The docs' canonical remote example is a feed loader:

  ```ts
  export function feedLoader({ url }: { url: string }) {
    const feedUrl = new URL(url);
    return {
      name: "feed-loader",
      load: async ({ store, logger, parseData, generateDigest }) => {
        logger.info("Loading posts");
        const feed = loadFeed(feedUrl);
        store.clear();
        for (const item of feed.items) {
          const id = item.guid;
          const data = await parseData({ id, data: item });
          const digest = generateDigest(data);
          store.set({ id, data, rendered: { html: data.description ?? "" }, digest });
        }
      },
    } satisfies Loader;
  }
  ```

  Note the example calls `store.clear()` and refetches every build; the digest
  only avoids rewriting unchanged entries.

### Caching behaviour of the data store and meta

- `LoaderContext.meta` (astro@5.0.0): "A key-value store scoped to the
  collection, designed for things like sync tokens and last-modified times.
  This metadata is persisted between builds alongside the collection data but
  is only available inside the loader."
  `const lastModified = meta.get("lastModified"); ... meta.set("lastModified", new Date().toISOString());`
- `generateDigest`: "Generates a non-cryptographic content digest ... When
  setting an entry, the entry will only update if the digest does not match an
  existing entry with the same ID." `store.set` "returns `false` when the
  digest property determines that an entry has not changed."
- `DataStore` API: `get`, `set`, `has`, `delete`, `clear`, `entries`, `keys`,
  `values`; entry fields `id`, `data`, `digest`, `filePath`, `body`,
  `rendered`.
- Where it persists: the loader reference does not name the file. The images
  guide and config reference say build artifacts live in `cacheDir`, default
  `./node_modules/.astro` ("Files in this directory will be used in subsequent
  builds to speed up the build time."). The content collections guide says
  build-time collections "can be cached between builds".
- Live collections (`live: true`) fetch at request time and have "No data
  store persistence"; they are irrelevant for a static Pages site.

### What this means in CI

`node_modules/.astro` only survives between Actions runs if something caches
it. `withastro/action` does (see 5): it restores `node_modules/.astro` with key
`astro-cache-<os>-<sha>` and `restore-keys: astro-cache-<os>-`, and saves it
only when there was no exact-key hit. So on a scheduled run at an unchanged SHA
the cache is restored but the updated store is not saved back. Any
`meta`-based conditional fetching therefore works within a run but does not
accumulate across scheduled runs. For two small feeds the robust pattern is the
one in the docs' example: `store.clear()` and refetch on every build. Neither
`.ics` nor RSS parsing is provided by Astro; the docs' `loadFeed` is a
placeholder for your own parser.

---

## 5. Deploying to GitHub Pages

### The workflow (https://docs.astro.build/en/guides/deploy/github/)

Current versions in the official recipe: `actions/checkout@v7`,
`withastro/action@v6`, `actions/deploy-pages@v5`. Permissions
`contents: read`, `pages: write`, `id-token: write`; `deploy` job uses the
`github-pages` environment and `needs: build`.

Adding the daily schedule uses the standard `schedule` trigger
(https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows):

```yaml
on:
  push:
    branches: [main]
  schedule:
    - cron: "17 9 * * *"   # daily, UTC (pick an off-the-hour minute)
  workflow_dispatch:
```

GitHub's rules for `schedule`:
- "Use POSIX cron syntax ... By default, scheduled workflows run in UTC." An
  IANA `timezone` key is optionally supported. Shortest interval 5 minutes.
- "Scheduled workflows will only run on the default branch." and "Scheduled
  workflows run on the latest commit on the default branch."
- "The schedule event can be delayed during periods of high loads ... High load
  times include the start of every hour. ... schedule your workflow to run at a
  different time of the hour."
- "In a public repository, scheduled workflows are automatically disabled when
  no repository activity has occurred in 60 days." A commit that edits the
  cron line re-enables it.
- "Notifications for scheduled workflows are sent to the user who last modified
  the cron syntax in the workflow file."

### What `withastro/action@v6` does (its `action.yml`)

Inputs: `node-version` (default `"24"`), `package-manager` (auto-detected from
the lockfile; `npm | yarn | pnpm | bun | deno`), `path` (`.`), `build-cmd`
(default `<pm> run build`), `cache` (default `"true"`, "caches optimized images
and other assets"), `cache-dir` (default `node_modules/.astro`), `out-dir`
(`dist`). Steps: detect lockfile (fails if none: "No lockfile found"),
`actions/setup-node` with package-manager cache, install, `actions/cache/restore`
of the Astro cache dir, build, `actions/cache/save` when no exact hit, then
`actions/upload-pages-artifact@v5` with `include-hidden-files: true`.

The Astro guide's caution: "You should commit your package manager's
automatically generated `package-lock.json` ... to your repository."

### `site` / `base` with a custom domain

Astro guide: "In your Astro config, update the value for `site` with your custom
domain. Do not set a value for `base`, and remove one if it exists":

```js
export default defineConfig({ site: "https://cmuaisafety.com" });
```

Config reference: `site` is "Your final, deployed URL. Astro uses this full URL
to generate your sitemap and canonical URLs"; `base` is only needed when the
site is served from a sub-path such as `https://<user>.github.io/<repo>/`.

### CNAME placement, and a conflict between the two docs

- Astro guide: "Add a `./public/CNAME` record to your project ... with a single
  line of text that specifies your custom domain". Files in `public/` are
  copied to `dist/` as-is (images guide), so `dist/CNAME` ends up in the
  artifact.
- GitHub docs
  (https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site):
  "If you are publishing from a custom GitHub Actions workflow, no CNAME file is
  created, and any existing CNAME file is ignored and is not required." And
  (publishing-source page): "A CNAME file in your repository file does not
  automatically add or remove a custom domain. Instead, you must configure the
  custom domain through your repository settings or through the API."
- Net: with the Actions source, the custom domain is whatever is saved under
  Settings > Pages > Custom domain (it is already `cmuaisafety.com` for the live
  site). Keeping `public/CNAME` is harmless and keeps the value visible in the
  repo, but it is not what makes the domain work.

### `.nojekyll`

https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site :
"If you publish your site from a source branch, GitHub Pages will use Jekyll to
build your site by default. If you want to use a static site generator other
than Jekyll, we recommend that you write a GitHub Actions to build and publish
your site instead. Otherwise, disable the Jekyll build process by creating an
empty file called `.nojekyll` in the root of your publishing source". Jekyll
skips files and folders that "Start with `_`, `.`, or `#`"
(https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll),
which would drop Astro's `_astro/` directory.

With the Actions source Jekyll is not run, so `.nojekyll` is not needed. Keep
`public/.nojekyll` anyway as insurance (it costs nothing, and the action's
`include-hidden-files: true` means it is uploaded), so a future switch back to
branch publishing does not silently strip `_astro/`.

### Switching the Pages source from "branch" to "GitHub Actions"

https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site :
Settings > Pages > "Build and deployment" > "Source" > select **GitHub Actions**.
"GitHub Pages does not associate a specific workflow to the GitHub Pages
settings. However, the GitHub Pages settings will link to the workflow run that
most recently deployed your site." Requires admin or maintainer permission on
the repo. GitHub recommends adding a deployment protection rule so only the
default branch can deploy to the `github-pages` environment.

### Limits (https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

- "Published GitHub Pages sites may be no larger than 1 GB."
- "GitHub Pages deployments will timeout if they take longer than 10 minutes."
- "soft bandwidth limit of 100 GB per month."
- "soft limit of 10 builds per hour. This limit does not apply if you build and
  publish your site with a custom GitHub Actions workflow."
- Artifact: a gzip tarball under 10 GB, no symlinks
  (using-custom-workflows page; `upload-pages-artifact` README).
- Actions cache (used by the action for `node_modules/.astro`): entries "not
  accessed in over 7 days" are removed; 10 GB per repository by default
  (https://docs.github.com/en/actions/reference/workflows-and-actions/dependency-caching).
  A daily schedule keeps the cache warm.

---

## 6. React islands and Headless UI

### `client:*` directives (https://docs.astro.build/en/reference/directives-reference/#client-directives)

- No directive: the component's "HTML is rendered onto the page without
  JavaScript."
- `client:load` - "Load and hydrate the component JavaScript immediately on
  page load." For "Immediately-visible UI elements that need to be interactive
  as soon as possible."
- `client:idle` - hydrate "once the page is done with its initial load and the
  `requestIdleCallback` event has fired." Accepts `{ timeout: ms }`.
- `client:visible` - hydrate "once the component has entered the user's
  viewport." Accepts `{ rootMargin }`.
- `client:media={QUERY}` - hydrate when the media query matches; "Sidebar
  toggles, or other elements that might only be visible on certain screen
  sizes."
- `client:only={framework}` - "Skips HTML server rendering, and renders only
  on the client."

Rules from https://docs.astro.build/en/guides/framework-components/ :
- "With all client directives except `client:only`, your component will first
  render on the server to generate static HTML."
- Props to hydrated components "must be serialized ... passing functions to
  hydrated components is not supported".
- Nested framework components inside an `.astro` file each need their own
  `client:*` directive; "Passing React's 'render props' to framework components
  from an Astro component will not work". So a Headless UI island should be one
  `.tsx` file that owns its whole subtree and receives plain data props.
- The React runtime is shipped once per page regardless of island count.

### Hydration cost of Headless UI **[verified locally]**

Headless UI's docs say nothing about bundle size or SSR. Measured with
`esbuild --bundle --minify --format=esm`, `NODE_ENV=production`, React marked
external, `@headlessui/react@2.2.10`, `react@19.3.0`:

| Entry | minified | gzip |
|---|---:|---:|
| `Disclosure` + `DisclosureButton` + `DisclosurePanel` | 27.7 kB | 10.0 kB |
| `Dialog` + `DialogPanel` | 46.3 kB | 16.7 kB |
| `Menu` + `MenuButton` + `MenuItems` + `MenuItem` | 92.1 kB | 32.8 kB |
| all three groups together | 114.1 kB | 39.8 kB |
| whole package (`export *`) | 216.0 kB | 68.8 kB |
| `react` + `react-dom/client` + `react/jsx-runtime` (the island runtime, paid once) | 223.6 kB | 69.3 kB |

Reading: any React island costs about 69 kB gzip of runtime before the first
component. Disclosure is cheap; Menu is the expensive one (`@headlessui/react`
depends on `@floating-ui/react` and `@tanstack/react-virtual` per
`npm view @headlessui/react dependencies`, and Menu is what pulls them in);
Dialog sits between. A mobile nav built on `Dialog`
plus a `Disclosure` FAQ is roughly 69 + 27 = ~96 kB gzip of JS on that page.

### Can a Disclosure render its open state statically? Yes **[verified locally]**

Headless UI docs (https://headlessui.com/react/disclosure): `Disclosure`
`defaultOpen` - "Whether or not the Disclosure component should be open by
default." (default `false`); `DisclosurePanel` `static` - "Whether the element
should ignore the internally managed open/closed state." (default `false`);
`unmount` - "Whether the element should be unmounted or hidden based on the
open/closed state." (default `true`). The docs are silent on SSR.

`renderToString` from `react-dom/server` 19.3.0 with `@headlessui/react` 2.2.10:

- `<Disclosure defaultOpen>` renders the button with `aria-expanded="true"
  data-open=""` **and the panel's HTML** in the server output.
- `<Disclosure>` (closed, default `unmount`) renders only the button; the
  panel is absent from the HTML.
- `<DisclosurePanel unmount={false}>` on a closed disclosure renders the panel
  with `hidden="" style="display:none"`, so the content is in the static HTML
  (indexable, no layout jump) and just hidden.
- `<Menu>` closed renders only the `MenuButton` (`aria-haspopup="menu"`).
- `<Dialog open>` renders **no dialog markup on the server**, only a hidden
  focus-guard `<span>`; Headless UI docs say Dialog is "automatically rendered
  in a portal under-the-hood". A Dialog-based mobile nav therefore contributes
  no crawlable nav links in the static HTML; keep a plain `<nav>` in the page
  for desktop and let the island own only the drawer.

So: an accordion that should start open on the server uses `defaultOpen`;
content that must be in the HTML even when collapsed uses `unmount={false}`;
and a `client:idle` or `client:visible` directive on the island keeps the
static HTML useful before hydration.

Tailwind Plus documentation (https://tailwindcss.com/plus/ui-blocks/documentation)
is behind a login and could not be read; the Headless UI dependency stated in
the ticket is taken as given.

---

## 7. Tailwind v4 dark mode on `data-theme` and `@theme` tokens

### Dark variant on an attribute (https://tailwindcss.com/docs/dark-mode)

Default: "Tailwind's `dark` variant uses the `prefers-color-scheme` CSS media
feature". To drive it from an attribute the docs give exactly:

```css
@import "tailwindcss";
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

```html
<html data-theme="dark"> ... <div class="bg-white dark:bg-black">
```

### Honouring `prefers-color-scheme` when no attribute is set

Tailwind's documented approach is JavaScript in `<head>` ("best to add inline
in `head` to avoid FOUC"), shown for the class strategy:

```js
document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
);
```

The attribute equivalent sets `data-theme` the same way. A pure-CSS alternative
uses the block form of `@custom-variant`, which the docs allow to contain
nested `@media` rules ("When a custom variant has multiple rules, they can be
nested within each other", https://tailwindcss.com/docs/adding-custom-styles):

```css
@custom-variant dark {
  &:where([data-theme=dark], [data-theme=dark] *) {
    @slot;
  }
  @media (prefers-color-scheme: dark) {
    &:where(:not([data-theme=light]):not([data-theme=light] *)) {
      @slot;
    }
  }
}
```

**[verified locally]** with `@tailwindcss/cli` 4.3.3: `dark:bg-casi-ink`
compiles to

```css
.dark\:bg-casi-ink:where([data-theme=dark], [data-theme=dark] *) { background-color: var(--color-casi-ink); }
@media (prefers-color-scheme: dark) {
  .dark\:bg-casi-ink:where(:not([data-theme=light]):not([data-theme=light] *)) { background-color: var(--color-casi-ink); }
}
```

That gives: no attribute -> follow the OS; `data-theme="dark"` -> dark;
`data-theme="light"` -> light even if the OS is dark. The docs do not show this
exact combination; it is a composition of two documented features.

### `@theme` for custom colours and fonts (https://tailwindcss.com/docs/theme, /docs/functions-and-directives)

- Namespaces: `--color-*` drives `bg-*`, `text-*`, ...; `--font-*` drives
  `font-*`; `--text-*` font sizes; `--breakpoint-*`, `--spacing-*`, `--radius-*`,
  `--shadow-*`, etc.
- Extend: `@theme { --font-script: Great Vibes, cursive; }` -> `font-script`.
- Override/remove defaults: `--color-*: initial;` then list your own colours,
  "all of the default utilities that use that namespace (like `bg-red-500`)
  will be removed".
- "Theme variables are emitted as regular CSS custom properties in `:root`", so
  they are usable in plain CSS too. By default only used variables are emitted;
  `@theme static { ... }` emits all of them.
- `@theme inline { --font-sans: var(--font-inter); }` when a token references
  another variable, so the utility inlines the value instead of `var(--font-sans)`
  (avoids the cascade-resolution surprise the docs describe).
- **[verified locally]** with 4.3.3:

  ```css
  @theme {
    --color-casi-red: oklch(0.55 0.2 25);
    --color-casi-ink: #1a1a1a;
    --font-display: "Aileron", ui-sans-serif, system-ui, sans-serif;
    --font-sans: "DM Sans", ui-sans-serif, system-ui, sans-serif;
  }
  ```

  yields `.text-casi-red`, `.font-display`, `.font-sans`, and because
  `--default-font-family: var(--font-sans)` in Tailwind's preflight, overriding
  `--font-sans` also changes the body default font.
- Dark-mode token values: the theme page does not cover per-theme token
  overrides. The variables are ordinary custom properties, so the usual pattern
  is to set the `--color-*` tokens in `:root` and re-declare them under
  `[data-theme=dark]` (and inside `@media (prefers-color-scheme: dark)` for the
  no-attribute case); `@theme inline` is needed if a token's value is
  `var(--something-else)` and should follow the cascade.

---

## Implications for the CASI rebuild

1. **Pin the matrix**: `astro@7.3.2`, `@astrojs/react@6.0.5`, `react@19.3.0`,
   `react-dom@19.3.0`, `tailwindcss@4.3.3`, `@tailwindcss/vite@4.3.3`,
   `@headlessui/react@2.2.10`. Node >= 22.12 locally; the action uses Node 24.
   Do not install `@astrojs/tailwind`. Commit `package-lock.json` or the action
   fails.
2. **Astro 7 gotchas to build in from day one**: strict HTML (close every tag),
   `compressHTML: 'jsx'` (add `{" "}` between inline elements or set
   `compressHTML: true`), no `src/fetch.ts`.
3. **Images**: keep photos in `src/` (not `public/`) so they are optimised;
   use `<Picture formats={['avif','webp']}>` or `<Image>` with
   `layout="constrained"` and `image.responsiveStyles: true`; mark the hero with
   `priority`. Substack/remote images need `image.domains` to be optimised;
   otherwise they pass through as plain `<img>` (still needs `width`/`height`
   or `inferSize`). sharp works on `ubuntu-latest` out of the box.
4. **Content model**: per-entry YAML files with `glob()` for team, programs,
   and events that teammates edit on GitHub; `file()` over one JSON/YAML array
   is fine for small lists. Validate with Zod so a bad edit fails the build
   with a file+field message.
5. **Feeds**: write two small object loaders (`.ics`, RSS) that
   `store.clear()` and refetch each build, parsing with your own code. Do not
   depend on `meta`/digest caching across scheduled runs: the action only saves
   the cache on new SHAs. Alternatively fetch in page frontmatter; the loader
   route gives typed entries and `getCollection()` reuse across pages.
6. **Pages**: switch Settings > Pages > Source to "GitHub Actions" (admin
   needed); `site: "https://cmuaisafety.com"`, no `base`; keep `public/CNAME`
   and `public/.nojekyll` for safety but know the domain actually comes from
   the Pages settings. Add `schedule` at an off-hour minute in UTC; remember it
   only runs on `main` and auto-disables after 60 days without commits, so
   someone must touch the repo at least every two months or the daily rebuild
   stops.
7. **Islands**: budget ~69 kB gzip for React on any page with an island, plus
   ~10 kB for Disclosure, ~17 kB for Dialog, ~33 kB for Menu. Prefer
   `Disclosure` (`defaultOpen`, `unmount={false}`) for accordions and a
   `Dialog` drawer for mobile nav; consider a no-JS `<details>` or plain
   `<nav>` for the desktop header so the site has zero JS on pages without an
   island. Hydrate with `client:idle`/`client:visible`; write each island as one
   `.tsx` file taking serialisable props.
8. **Dark mode**: use the block-form `dark` variant above so the site follows
   the OS until a visitor picks a theme; store the choice in `localStorage` and
   set `data-theme` in an inline `<head>` script to avoid a flash. Declare
   brand colours and the Aileron / DM Sans stacks with `@theme`.
