# Substack RSS feed shape for the build-time blog listing

Resolves issue #13 (part of #8). Fetched and inspected on 2026-09-16 (UTC).

Feed: `https://carnegieaisafety.substack.com/feed`
Publication title in the feed: "Carnegie AI Safety Review".

Every empirical claim below states the command that produced it. All commands
were run from a scratch directory; `feed.xml` is the saved feed body.

```bash
curl -sS -D headers.txt -o feed.xml "https://carnegieaisafety.substack.com/feed"
```

## Summary

- The feed is RSS 2.0 with `dc`, `content`, `atom`, `itunes`, and `googleplay`
  namespaces declared. No `media:` namespace, no `<category>` on any item.
- Each item carries: `title`, `description`, `link`, `guid`, `pubDate`,
  `enclosure` (the cover image), `content:encoded` (full post HTML), and
  `dc:creator` only when the post has a byline (5 of 8 items).
- The feed exposes the cover image and a one-line description machine-readably.
  It does not expose tags/categories, co-authors, or a reliable subtitle.
- The feed returns at most 20 items (all 8 for CASI today). No pagination and
  no full-archive feed. The undocumented JSON endpoint `/api/v1/archive` pages
  the whole archive and also exposes tags and multiple bylines.
- No CORS headers at all; that is why a browser `fetch` fails. Server-side
  (GitHub Actions) fetch is fine. ETag is honoured (304 on `If-None-Match`).
- `rss-parser` (npm) parses it correctly with zero configuration.
- All six hand-listed URLs are in the feed. Two of the three URL-less local
  posts are also in the feed. One local post ("AI and Technofeudalism") is not
  on Substack at all.
- Categories cannot come from the RSS feed. They can come from Substack tags
  via `/api/v1/archive` (with one mismatch), or from the overrides file.

## 1. What each `<item>` carries

Command:

```bash
python3 - <<'EOF'
import xml.etree.ElementTree as ET
ch = ET.parse('feed.xml').getroot().find('channel')
for it in ch.findall('item'):
    print([c.tag for c in it])
EOF
```

The 8 items carry these children, in this order (`dc:creator` is the only
one that is sometimes missing):

| Element | Present | Content observed |
|---|---|---|
| `title` | 8/8 | CDATA. Full Substack title, e.g. `Three Federal Liability Frameworks for Combating AI-Enabled Consumer Fraud`. |
| `description` | 8/8 | CDATA. One line of plain text. See section 2 for what it actually is. |
| `link` | 8/8 | `https://carnegieaisafety.substack.com/p/<slug>` |
| `guid` | 8/8 | Same string as `link`, with `isPermaLink="false"`. |
| `dc:creator` | 5/8 | CDATA. Exactly one name, even when the post has two bylines. Absent when the post has no byline. |
| `pubDate` | 8/8 | RFC 822, GMT, e.g. `Sun, 19 Apr 2026 21:29:00 GMT`. |
| `enclosure` | 8/8 | `url="<cover image>" length="0" type="image/jpeg"`. `type` is always `image/jpeg`, even for the one `.png` cover. `length` is always `0`. |
| `content:encoded` | 8/8 | CDATA. Full post HTML, 8k to 23k characters per post. |
| `category` | 0/8 | Never present. `grep -o "<category" feed.xml | wc -l` returns 0. |
| `media:*` | 0/8 | Never present. `grep -o "<media:" feed.xml | wc -l` returns 0. |

Root element (`grep -o '<rss[^>]*>' feed.xml`):

```xml
<rss xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom" version="2.0"
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
     xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0">
```

Channel-level children: `title`, `description`, `link`, `image`, `generator`
(`Substack`), `lastBuildDate`, `atom:link rel="self"`, `copyright`, `language`,
`webMaster`, `itunes:owner`, `itunes:author`, `googleplay:*`, `itunes:block`.
Nothing at channel level is useful for the listing.

One real item, trimmed (the feed is a single line; line breaks added and
`content:encoded` cut):

```xml
<item>
  <title><![CDATA[AAAI-26 Recap]]></title>
  <description><![CDATA[What I learned from presenting my CASI Research Fellowship project at AAAI '26.]]></description>
  <link>https://carnegieaisafety.substack.com/p/aaai-26-recap</link>
  <guid isPermaLink="false">https://carnegieaisafety.substack.com/p/aaai-26-recap</guid>
  <dc:creator><![CDATA[Xuning Ying]]></dc:creator>
  <pubDate>Fri, 24 Apr 2026 21:30:00 GMT</pubDate>
  <enclosure url="https://substack-post-media.s3.amazonaws.com/public/images/3a76df65-eac6-4c17-865e-f0b2a0ebe3b7_945x1800.jpeg" length="0" type="image/jpeg"/>
  <content:encoded><![CDATA[<p>This semester, my coauthor Tate and I presented our CASI project at AAAI-26. It&#8217;s funny to think about how it started, because when …[7,971 chars of post HTML]… ]]></content:encoded>
</item>
```

Enclosure URLs come in two forms. Six are direct S3 URLs
(`https://substack-post-media.s3.amazonaws.com/public/images/<uuid>_<w>x<h>.<ext>`);
two are wrapped in the Substack CDN transform prefix
(`https://substackcdn.com/image/fetch/$s_!…!,f_auto,q_auto:good,fl_progressive:steep/<url-encoded S3 url>`).
The five hackathon covers are `945x1800` portrait images; the op-ed covers are
landscape (`2000x1333`, `1200x630`). Any consumer that shows covers must cope
with both aspect ratios or crop.

## 2. Cover image, subtitle/dek, and author(s)

### Cover image: yes, from `enclosure url`

Every item has exactly one `enclosure` and its `url` matches the post's
`cover_image` in Substack's own archive JSON (compared by eye for all 8;
see the `/api/v1/archive` output in section 3). It is the same image Substack
puts in `og:image` on the post page, before the `w_1200,h_675,c_fill` crop:

```bash
curl -sS -L "https://carnegieaisafety.substack.com/p/the-ai-creator-compensation-and-licensing" | grep -o '<meta[^>]*og:image[^>]*>'
# og:image = https://substackcdn.com/image/fetch/$s_!3OsR!,w_1200,h_675,c_fill,f_jpg,q_auto:good,fl_progressive:steep,g_auto/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc5e0080c-…_945x1800.jpeg
```

The build can hot-link the enclosure URL or download it into `assets/`.
Substack's CDN transform prefix (`w_1200,h_675,c_fill,…`) can be prepended to
the S3 URL to get a uniformly cropped 16:9 image, as the post page itself does.

### Subtitle/dek: partly. `description` is not reliably a subtitle

The archive JSON reports `subtitle: ""` for all 8 posts, while its
`description` field equals the RSS `description` for all 8 (section 3
command). So RSS `description` is Substack's post `description`, which is
whatever preview text the post has, and is derived from the body when nothing
was written. The observed values:

| Slug | RSS `description` |
|---|---|
| `llm-powered-drones-could-reverse` | "The informational context required for autonomous drones might centralize war power…" (a real dek) |
| `how-geopolitics-creates-conscripted` | "AI companies like Anthropic are shaped by the geopolitical reality around them." (a real dek) |
| `aaai-26-recap` | "What I learned from presenting my CASI Research Fellowship project at AAAI '26." (a real dek) |
| `three-federal-liability-frameworks` | "Part of the Pittsburgh AI Policy Hackathon." (the body's first callout) |
| `a-fourth-amendment-and-rawlsian-ethics` | "AI facial recognition at U.S. borders: a policy brief proposing…" (a real dek) |
| `the-ai-creator-compensation-and-licensing` | "By Jong Hyun Son and Soomin Seo" (the body's first paragraph) |
| `addressing-the-epidemic-of-ai-voice` | "A policy framework for holding AI platforms liable…" (a real dek) |
| `regional-ai-hyperspecialization-how` | "By Tomas Felipe Rubio Diaz and Hojun Jin" (the body's first paragraph) |

Three of eight are not usable as a blurb. The blurb needs an override, with
`description` as the fallback. (The current card template does not render a
blurb at all; `grep -n "post.blurb" index.html` finds nothing. So this only
matters if the redesign adds one.)

### Author(s): first byline only, and only when set

`grep -o "<dc:creator>[^<]*<!\[CDATA\[[^]]*\]\]></dc:creator>" feed.xml` gives
five creators: Taeho Lee, Taeho Lee, Xuning Ying, Dorian Clay, Taeho Lee.

- `three-federal-liability-frameworks` has two bylines on Substack
  (`publishedBylines: ["Dorian Clay", "Jessica Wen"]` in the archive JSON) but
  the feed carries only `<dc:creator>Dorian Clay</dc:creator>`. The string
  "Jessica Wen" appears nowhere in the item, body included.
- `the-ai-creator-compensation-and-licensing`, `addressing-the-epidemic-of-ai-voice`,
  and `regional-ai-hyperspecialization-how` have no byline on Substack
  (`publishedBylines: []`) and no `dc:creator`. Their authors appear only as a
  `<p><strong>By …</strong></p>` first paragraph inside `content:encoded`.

So authors must come from the overrides file (or from the archive JSON's
`publishedBylines`, which still misses the three no-byline posts). The feed's
`dc:creator` is a fallback for single-author posts only.

## 3. Item count, pagination, archive, CORS, and caching

### Item count: at most 20

- CASI's feed returns 8 items: `grep -o "<item>" feed.xml | wc -l` gives 8.
- The whole archive is 8 posts:
  `curl -sS "https://carnegieaisafety.substack.com/api/v1/archive?sort=new&limit=50&offset=8"`
  returns `[]`, and `offset=0` returns 8 objects.
- Three large publications each return exactly 20 items, so 20 is the cap:

  ```bash
  for u in https://www.astralcodexten.com/feed https://newsletter.pragmaticengineer.com/feed https://on.substack.com/feed; do
    curl -sS -L -o big.xml "$u"; grep -o "<item>" big.xml | wc -l; done
  # 20, 20, 20
  ```

Substack's only documentation on the publication feed is one sentence:
"You can find the RSS feed for your publication at https://your.substack.com/feed"
([Is there an RSS feed for my publication?](https://support.substack.com/hc/en-us/articles/360038239391-Is-there-an-RSS-feed-for-my-publication),
updated 2026-09-13, read through the Zendesk JSON API at
`https://support.substack.com/api/v2/help_center/en-us/articles/360038239391.json`
because the HTML page sits behind a Cloudflare challenge). A help-center search
(`/api/v2/help_center/articles/search.json?query=RSS%20feed`) finds no article
that documents the item cap, tags, sections, or pagination. The one other
relevant sentence: "RSS feeds and search engine crawlers see the Not subscribed
version of any audience section"
([How do I add audience-specific content to a post](https://support.substack.com/hc/en-us/articles/50558240901268)).
Not relevant today; every CASI post is `audience: everyone`.

### Pagination: none

```bash
for u in "…/feed?page=2" "…/feed?offset=8" "…/feed?limit=50"; do curl -sS -o pg.xml -w "%{http_code} %{size_download} " "$u"; grep -o "<item>" pg.xml | wc -l; done
# each: 200, 128218 bytes, 8 items (identical body)
```

Query parameters are ignored. Per-tag feeds do not exist:
`/t/governance-reading-group-policy-brief/feed` and
`/t/2026-pittsburgh-ai-policy-hackathon/feed` return 404 (the tag pages
without `/feed` return 200 HTML). Per-section feeds (`/s/<slug>/feed`) also
returned 404 on a publication that has sections
(`newsletter.pragmaticengineer.com/s/the-pulse/feed`). CASI has no sections
(`section_id: null` on every post).

### Full archive: the undocumented JSON API

`https://carnegieaisafety.substack.com/api/v1/archive?sort=new&limit=50&offset=0`
returns a JSON array of post objects (200, 31 kB for 8 posts), pageable by
`offset`. Per post it exposes, among ~60 keys: `slug`, `canonical_url`,
`title`, `subtitle`, `description`, `post_date` (ISO 8601), `cover_image`,
`publishedBylines` (array of `{id, name, handle, is_guest, …}`), `postTags`
(array of `{id, name, slug, hidden}`), `section_name`, `audience`, `type`,
`wordcount`, `truncated_body_text`, `search_engine_title`,
`search_engine_description`. It does not include the full body.

This endpoint is not documented by Substack and could change without notice.
It is the only machine-readable source for tags and multiple bylines. The
plan can use it as an optional enrichment step that fails soft, but the
overrides file should not depend on it.

### CORS: none

```bash
curl -sS -o /dev/null -D - -H "Origin: https://cmuaisafety.com" "https://carnegieaisafety.substack.com/feed" | grep -i access-control
# (no output)
curl -sS -o /dev/null -D - -X OPTIONS -H "Origin: https://cmuaisafety.com" -H "Access-Control-Request-Method: GET" "https://carnegieaisafety.substack.com/feed" | grep -i -E "access-control|allow"
# allow: GET,HEAD
```

No `Access-Control-Allow-Origin` on GET; the preflight answers only
`allow: GET,HEAD`. Browser `fetch` from cmuaisafety.com is blocked by the
same-origin policy. Building at fetch time in GitHub Actions (Node 18+ has
`fetch` built in) removes the problem entirely.

### Cache headers

From `headers.txt` and repeat fetches:

```
content-type: application/xml; charset=utf-8
cache-control: no-cache
etag: W/"1f4da-IUGzMiYTACXRjYlHPIjUlKUl9hk"
vary: Accept-Encoding
cf-cache-status: MISS        (first fetch)
cf-cache-status: HIT, age: 242   (subsequent fetches)
x-robots-tag: noindex, noarchive, nofollow
```

- No `Last-Modified`, no `Expires`.
- Despite `cache-control: no-cache`, Cloudflare serves the feed from its edge
  cache (`cf-cache-status: HIT`, `age` observed up to 242 s). A build that
  runs right after publishing may see a copy a few minutes old.
- Conditional requests work:
  `curl -sS -o /dev/null -w "%{http_code}" -H 'If-None-Match: W/"1f4da-IUGzMiYTACXRjYlHPIjUlKUl9hk"' …/feed`
  returns `304`. The build could store the ETag and skip regeneration when
  nothing changed, but at 128 kB that is an optional nicety.
- Responses set three cookies (`ab_experiment_sampled`, `ab_testing_id`,
  `__cf_bm`). Nothing is needed from them; ignore them.

## 4. Node parser choice

Candidates, from the npm registry (`curl https://registry.npmjs.org/<name>`):

| Package | Latest | Published | Runtime deps | Notes |
|---|---|---|---|---|
| `rss-parser` | 3.13.0 | 2023-04-11 | `xml2js`, `entities` | Promise API, `parseString`/`parseURL`, TypeScript types bundled. README: `dc:creator` becomes `creator`, `pubDate` becomes `isoDate`, unknown namespaced fields via `customFields`. |
| `feedsmith` | 2.9.6 | 2026-07-14 | `fast-xml-parser`, `entities` | Newer; typed per-namespace objects (`item.dc.creators`, `item.enclosures[]`). |
| `feedparser` | 2.6.0 | 2026-05-18 | `sax` + 8 others | Stream-based API; more ceremony than a build script needs. |
| `fast-xml-parser` | 5.11.1 | 2026-08-27 | 6 small deps | Generic XML; you write the mapping. `guid` becomes `{'#text', '@_isPermaLink'}`, `enclosure` becomes `{'@_url', …}`. |

All four were installed and run against the saved `feed.xml`
(`npm install rss-parser@3.13.0 feedsmith@2.9.6 fast-xml-parser@5.11.1 feedparser@2.6.0`,
then a small `test.mjs`). rss-parser, feedsmith, and fast-xml-parser all parsed
all 8 items with the namespaced fields intact; none needed configuration for
`dc:` or `content:`.

**Pick: `rss-parser`.** With `new Parser().parseString(xml)` and no options
it produces, per item, exactly the fields the build needs and nothing that
needs unwrapping. It is the least code. Its age (last release 2023) is a
maintenance risk, but the RSS 2.0 + `dc` + `content` surface it covers has not
changed, and `feedsmith` is a drop-in fallback if it ever breaks
(`item.dc.creator`, `item.enclosures[0].url`, `item.content.encoded`).

Field mapping, verified by the run:

| Feed element | `rss-parser` item field | Example (item 0) |
|---|---|---|
| `<title>` | `item.title` | `LLM-Powered Drones Could Reverse the "Democratization of Warfare"` |
| `<link>` | `item.link` | `https://carnegieaisafety.substack.com/p/llm-powered-drones-could-reverse` |
| `<guid>` | `item.guid` (string; the attribute is dropped) | same as link |
| `<dc:creator>` | `item.creator` (also `item['dc:creator']`); `undefined` when absent | `Taeho Lee` |
| `<pubDate>` | `item.pubDate` (raw) and `item.isoDate` | `2026-07-13T23:48:39.000Z` |
| `<description>` | `item.content` and `item.contentSnippet` (note: not `item.description`) | `The informational context required…` |
| `<content:encoded>` | `item['content:encoded']` (HTML) and `item['content:encodedSnippet']` (text) | 13,656 chars |
| `<enclosure>` | `item.enclosure` = `{url, length: '0', type: 'image/jpeg'}` | S3 or substackcdn URL |
| (none) | `item.categories` | `undefined` |

The one trap: rss-parser maps `<description>` to `item.content`, so a naive
"content = body" assumption picks up the one-line description. Use
`item['content:encoded']` for the body.

Sketch of the build step:

```js
import Parser from 'rss-parser';
const xml = await (await fetch('https://carnegieaisafety.substack.com/feed')).text();
const feed = await new Parser().parseString(xml);
const posts = feed.items.map((it) => ({
  slug: new URL(it.link).pathname.replace(/^\/p\//, ''),
  url: it.link,
  title: it.title,
  date: it.isoDate,
  author: it.creator ?? null,
  description: it.contentSnippet ?? '',
  cover: it.enclosure?.url ?? null,
}));
```

The repository currently has no `package.json`. Adding `rss-parser` means
either checking in a minimal `package.json` + lockfile for the build script,
or `npm install rss-parser` inside the workflow. The former is reproducible.

## 5. The hand-listed posts versus the feed

`allPosts` in `index.html` has 9 entries: 6 with a `url` and 3 without.
Matching by `link`/`guid` (they are identical in this feed):

| Local title | Local `url` | Local cat | Local date | In feed | Feed slug | Feed `pubDate` | Feed `dc:creator` | Substack tag |
|---|---|---|---|---|---|---|---|---|
| AI and Technofeudalism | (none) | AI Governance Op-Eds | 7/24/2026 | **No** | – | – | – | – |
| LLM-Powered Drones Could Reverse the Democratization of Warfare | yes | AI Governance Op-Eds | 7/13/2026 | Yes | `llm-powered-drones-could-reverse` | 2026-07-13 | Taeho Lee | AI Governance Op-Eds |
| How Geopolitics Creates Conscripted Corporate Monsters | yes | AI Governance Op-Eds | 7/1/2026 | Yes | `how-geopolitics-creates-conscripted` | 2026-07-02 | Taeho Lee | AI Governance Op-Eds |
| Regional AI Hyperspecialization | (none) | AI Governance Op-Eds | 5/6/2026 | **Yes** | `regional-ai-hyperspecialization-how` | 2026-04-19 | (none) | 2026 Pittsburgh AI Policy Hackathon Finalist |
| Three Federal Liability Frameworks | yes | CASI Policy Hackathon Finalists | 5/4/2026 | Yes | `three-federal-liability-frameworks` | 2026-04-19 | Dorian Clay | 2026 Pittsburgh AI Policy Hackathon Finalist |
| AI-Powered FRT and Civil Liberties | (none) | CASI Policy Hackathon Finalists | 5/6/2026 | **Yes** | `a-fourth-amendment-and-rawlsian-ethics` | 2026-04-19 | Taeho Lee | 2026 Pittsburgh AI Policy Hackathon Finalist |
| AI Voice-Cloning Fraud | yes | CASI Policy Hackathon Finalists | 5/2/2026 | Yes | `addressing-the-epidemic-of-ai-voice` | 2026-04-19 | (none) | 2026 Pittsburgh AI Policy Hackathon Finalist |
| AICCLA | yes | CASI Policy Hackathon Finalists | 5/2/2026 | Yes | `the-ai-creator-compensation-and-licensing` | 2026-04-19 | (none) | 2026 Pittsburgh AI Policy Hackathon Finalist |
| AAAI-26 Recap | yes | Member Reflections | 4/24/2026 | Yes | `aaai-26-recap` | 2026-04-24 | Xuning Ying | AI Governance Op-Eds |

Findings:

- All six URL-bearing local posts are in the feed, and the URLs match
  `link`/`guid` exactly.
- Two URL-less local posts are in the feed and can get real links:
  "Regional AI Hyperspecialization" and "AI-Powered FRT and Civil Liberties".
- "AI and Technofeudalism" is not on Substack (not in the feed, not in the
  8-post archive JSON). If it should stay on the site, the overrides file must
  be able to add a post the feed does not have, or the post gets published.
- Local titles are shortened for the card (`AICCLA`,
  `AI Voice-Cloning Fraud`, `Three Federal Liability Frameworks`, …). The card
  clamps to 3 lines at 30ch, so a title override stays useful.
- Local dates disagree with `pubDate` for six posts. The five hackathon posts
  are all dated 2026-04-19 21:24–21:29 GMT on Substack (a back-dated batch)
  but 5/2–5/6/2026 locally; "How Geopolitics…" is 7/2 GMT on Substack, 7/1
  locally. Decide whether the feed date wins (simplest, no override) or the
  overrides file may set `date`.
- "Regional AI Hyperspecialization" is categorised locally as an op-ed but
  tagged on Substack as a hackathon finalist, and its body carries the
  hackathon callout. Either the local category or the Substack tag is wrong.

### Can the categories be derived?

From the RSS feed alone: only partially.

- No `<category>` elements, no section, no tag. Nothing structural.
- Title patterns: none. No local category word appears in any feed title.
- Body pattern: every hackathon post's `content:encoded` contains a callout
  linking to `https://cmuaisafety.com/policy-hackathon-s26.html`, and no
  other post does (checked with a Python loop over the 8 items, matching the
  string `policy-hackathon-s26.html`: 5 hits, exactly the hackathon slugs).
  That is a usable but fragile heuristic for "CASI Policy Hackathon
  Finalists"; it cannot distinguish "AI Governance Op-Eds" from
  "Member Reflections".

From Substack tags via `/api/v1/archive` (`postTags[].name`): almost.

- Two tags exist: `AI Governance Op-Eds` (slug
  `governance-reading-group-policy-brief`) on 3 posts and
  `2026 Pittsburgh AI Policy Hackathon Finalist` (slug
  `2026-pittsburgh-ai-policy-hackathon`) on 5 posts.
- A two-entry map (`AI Governance Op-Eds` -> same; `2026 Pittsburgh AI Policy
  Hackathon Finalist` -> `CASI Policy Hackathon Finalists`) reproduces the
  local categories for 7 of 8 feed posts.
- The exception is `aaai-26-recap`: tagged `AI Governance Op-Eds` on Substack,
  `Member Reflections` locally. There is no `Member Reflections` tag on
  Substack. Fixing this means either adding the tag on Substack or an override.
- The tag *names* are editable on Substack and the endpoint is undocumented, so
  the map should key on tag `slug` (or `id`) and the build must not fail when
  the endpoint is unavailable.

Recommendation: keep `cat` in the overrides file as the source of truth, with
a default derived from Substack tags when the archive endpoint answers, and a
last-resort default (e.g. `AI Governance Op-Eds`) when it does not. Every
post that is in the feed today already needs an overrides entry for something
(title, author, or category), so the marginal cost of also writing `cat` is
one line per post.

## Recommended overrides file shape

Key: the Substack slug (the path after `/p/`). It is stable, human-readable,
identical between `link` and `guid`, and survives title edits. The build
derives it from `item.link`.

Fields the feed cannot supply, or supplies unreliably, per post:

| Field | Why it is needed | Fallback if absent |
|---|---|---|
| `cat` | Not in the feed. Substack tags cover 7/8 via the undocumented API. | Tag map via `/api/v1/archive`, then a default. |
| `author` | `dc:creator` is missing on 3/8 and truncates co-authors on 1/8. | `item.creator`, then `"CASI members"` (current template behaviour). |
| `title` | Feed titles are long; the card wants a short form. | `item.title`. |
| `blurb` | `description` is body text on 3/8. Not rendered by the current card; keep for a redesign. | `item.contentSnippet`. |
| `date` | Only if the site wants to keep its own dates for the back-dated hackathon batch. | `item.isoDate`. |
| `img` | Only if a local, cropped asset is preferred over the enclosure URL. Not rendered by the current card. | `item.enclosure.url`. |
| `hide` | To drop a Substack post from the listing without deleting it. | `false`. |

Posts that are not in the feed ("AI and Technofeudalism") need every
display field, plus a `url` (or none, in which case the card links to the
publication home, as `index.html` does today via `p.url || this.substack`).

Proposed file, `blog-overrides.json` at the repository root (JSON so the build
script needs no extra dependency; keep the current hand-written values as the
initial content):

```json
{
  "categories": {
    "governance-reading-group-policy-brief": "AI Governance Op-Eds",
    "2026-pittsburgh-ai-policy-hackathon": "CASI Policy Hackathon Finalists"
  },
  "posts": {
    "llm-powered-drones-could-reverse": {
      "cat": "AI Governance Op-Eds",
      "title": "LLM-Powered Drones Could Reverse the Democratization of Warfare"
    },
    "three-federal-liability-frameworks": {
      "cat": "CASI Policy Hackathon Finalists",
      "title": "Three Federal Liability Frameworks",
      "author": "Dorian Clay and Jessica Wen",
      "blurb": "Strict liability, negligence-based duty of care, and an industry-funded compensation model for AI-enabled consumer fraud.",
      "img": "assets/post-liability.png"
    },
    "the-ai-creator-compensation-and-licensing": {
      "cat": "CASI Policy Hackathon Finalists",
      "title": "AICCLA",
      "author": "Jong Hyun Son and Soomin Seo"
    },
    "aaai-26-recap": {
      "cat": "Member Reflections"
    }
  },
  "extra": [
    {
      "slug": "ai-and-technofeudalism",
      "title": "AI and Technofeudalism",
      "author": "Christina Li, Taeho Lee, and Anishka Jannu",
      "cat": "AI Governance Op-Eds",
      "date": "2026-07-24",
      "blurb": "AI is a modern technology reinforcing a centuries-old playbook of feudalism, only this time in the digital space."
    }
  ]
}
```

Merge rule: `feed item -> derived defaults -> overrides[slug]`, then append
`extra`, then sort by date descending. Any override key present wins; absent
keys fall back as in the table above. Unknown slugs in `posts` should produce
a build warning (a post was renamed or unpublished), not a failure.

Two decisions this leaves for the plan:

1. Whether `date` is overridable. If not, the hackathon posts move from early
   May to 19 April in the listing.
2. Whether to call `/api/v1/archive` at all. It is the only way to get tags
   and co-authors automatically, but it is undocumented. If the answer is no,
   `cat` and `author` are simply required override fields for every post,
   which is nine lines today.
