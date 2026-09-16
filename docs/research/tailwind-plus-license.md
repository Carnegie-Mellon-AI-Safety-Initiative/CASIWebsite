# Tailwind Plus license terms for a public end-product repo

Resolves [#10](https://github.com/Carnegie-Mellon-AI-Safety-Initiative/CASIWebsite/issues/10)
(part of #8). Researched 2026-09-15.

## Sources

Primary sources only. Every claim below quotes the sentence it rests on.

| Tag | Source | How it was read |
|---|---|---|
| **[L]** | Tailwind Plus License — https://tailwindcss.com/plus/license | Live page, read 2026-09-15 while signed in to the CASI account. |
| **[FAQ]** | Tailwind Plus landing page FAQ ("Frequently asked questions") — https://tailwindcss.com/plus | Read from the Internet Archive capture of 2026-09-08 (`web.archive.org/web/20260908041234/https://tailwindcss.com/plus`). The live page shows no FAQ to a signed-in account, and anonymous requests are redirected to `/plus/login` (see "Access note"). |
| **[PRICE]** | Pricing block on the same landing page | Same 2026-09-08 archive capture. |
| **[SUPPORT]** | https://tailwindcss.com/plus/support | Live page, 2026-09-15. |

The license page has no version number or "last updated" line. Spot-checking
the 2025-03-07 archive capture of the same URL shows every clause quoted below
was already present then; the only material addition since is the "Libraries"
(Elements JavaScript library) term, which does not affect this ticket.

**Access note.** On 2026-09-15, `curl https://tailwindcss.com/plus` and
`curl https://tailwindcss.com/plus/license` both redirected (HTTP 200 after
redirect) to `https://tailwindcss.com/plus/login`. The Internet Archive's
2026-09-07 capture of `/plus/license` was still served with status 200, so this
gate is recent. Anyone on the team who wants to read the license text
first-hand currently needs to be signed in.

**Terminology.** The ticket says "UI Blocks". The license never uses that
phrase; it governs "Components, Templates, and Libraries", defined as
"the source code and design assets made available to the Licensee after
purchasing a Tailwind Plus license." [L] The catalog page at
`/plus/ui-blocks` is titled "Tailwind CSS Components - Tailwind Plus", so
UI Blocks are the license's "Components".

## Q1. Using UI Blocks in an end product whose source is a public GitHub repo

**Answer: allowed.** Under both the Personal and Team license, an open-source
marketing site is an explicitly permitted End Product.

- "You can: … Use the Components, Templates, and Libraries to create End
  Products that are open source and freely available to End Users." [L]
  (identical wording in the Personal and Team sections)
- "End Product is any artifact produced that incorporates the Components,
  Templates, Libraries, or derivatives of them." [L]
- Allowed example: "Creating a web application where the primary purpose is
  clearly not to simply re-distribute the components or libraries (like a
  conference organization app that uses them for its UI for example) that is
  free and open source, where the source code is publicly available." [L]
- FAQ, "Can I use Tailwind Plus in open source projects?": "Yep! As long as
  what you're building is some sort of actual website and not a derivative
  component library, theme builder, or other product where the primary purpose
  is clearly to repackage and redistribute our components, it's totally okay
  for that project to be open source." [FAQ]
- The summary sentence: "In simple terms, use Tailwind Plus for anything you
  like as long as it doesn't compete with Tailwind Plus." [L]

The constraint that matters is *purpose*, not *visibility*. The public repo is
fine so long as the repo's primary purpose is the CASI website, not a
collection of Tailwind Plus blocks.

Team-license holders have one extra condition: the End Product must belong to
the licensee or a client. "You cannot: … Use the Components, Templates, or
Libraries to create End Products that are the property of any individual or
entity other than the Licensee or Clients of the Licensee." [L] See Q4.

## Q2. Committing block source (adapted or verbatim) into that public repo

**Answer: allowed as part of the site; not allowed as a standalone
collection. The license draws the line at *what the repo is*, not at whether
the code was modified.**

- Modification is expressly permitted and derivatives stay under the same
  license: "You can: … Modify the Components and Templates to create
  derivative components and templates. Those components and templates are
  subject to this license." [L]
- The only distribution prohibition is on distribution *separate from an End
  Product*: "You cannot: … Re-distribute the Components, Templates, Libraries,
  or derivatives of them separately from an End Product, neither in code or as
  design assets." [L] (Personal; the Team version says the same without the
  "neither in code…" tail.)
- The disallowed examples all describe repos or packages whose purpose is the
  blocks themselves:
  - "Creating a repository of your favorite Tailwind Plus components,
    templates, or libraries (or derivatives of them) and publishing it
    publicly." [L]
  - "Creating a UI library using Tailwind Plus components, templates, or
    libraries and making it available either for sale or for free." [L]
  - "Creating a theme, template, or project starter kit using the components,
    templates, or libraries and making it available either for sale or for
    free." [L]
- The allowed open-source example (quoted in Q1) is a public-source app that
  "uses them for its UI". [L]

**Where the license is silent or ambiguous:**

- It does not distinguish "verbatim" from "adapted" block source inside an
  End Product. Both are covered by "incorporates the Components … or
  derivatives of them." [L] Verbatim block HTML committed as part of
  `index.html` is no different, licence-wise, from an edited copy.
- It does not define how many blocks, or how unmodified, a public repo may
  contain before it becomes "a repository of your favorite Tailwind Plus
  components". The test it gives is whether "the primary purpose is clearly not
  to simply re-distribute the components". [L] A single-page marketing site
  with CASI copy, images, and calendar/blog wiring clearly passes that test; a
  branch that contained dozens of stock blocks with placeholder text and no
  site around them would not.
- Nothing in the license requires (or forbids) an attribution notice,
  copyright header, or `LICENSE` file for the block code. Copyright remains
  with Tailwind Labs: "The copyright of the Components, Templates, and
  Libraries is owned by Tailwind Labs Inc. You are granted only the
  permissions described in this license; all other rights are reserved." [L]
  Consequence: a repo-wide open-source license (MIT, etc.) cannot be applied
  to the block-derived markup; it is licensed to CASI, not open-sourced by CASI.

## Q3. Keeping a private local archive of the full block catalog

**Answer: not addressed by the license text. What is addressed is
*sharing*, and that is prohibited.**

- No clause in [L] mentions downloading, caching, mirroring, or keeping copies
  of the catalog. The FAQ's "lifetime access" answer describes the
  entitlement in terms of access, not copies: "When you purchase a Tailwind
  Plus license, you get access to everything in Tailwind Plus forever." [FAQ]
- What *is* prohibited is giving the copy to anyone else:
  - Personal: "You cannot: … Share your access to the Components, Templates,
    or Libraries with any other individuals." [L]
  - Team: "You cannot: … Grant access to the Components, Templates, or
    Libraries to individuals who are not an Employee or Contractor of the
    Licensee." [L]
  - And the redistribution clause quoted in Q2 applies to any copy that
    leaves the licensee's hands separate from an End Product. [L]
- Enforcement names private redistribution as the blatant case: "When license
  violation is blatant and malicious (such as intentionally redistributing the
  Components, Templates, or Libraries through private warez channels), no
  refund will be issued." [L]

Reuse *across projects* by the same licensee is fine: "Use the Components,
Templates, and Libraries to create unlimited End Products." [L] and FAQ: "you
can build as many sites as you want without ever having to buy an additional
license." [FAQ] The Team-license caveat from Q1 applies to each of those
projects.

So a local archive is a licensing question only at the moment it is *shared*
or *published*. The license is silent on the archive itself.

## Q4. Personal vs Team license: who may use the blocks; unlicensed contributors

**The two licenses differ in who is licensed, not in what may be built.**

Personal:

- "The license grants permission to one individual (the Licensee) to access
  and use the Components, Templates, and Libraries." [L]
- "Licensee is the individual who has purchased a Personal License." [L]
- "You cannot: … Share your access to the Components, Templates, or Libraries
  with any other individuals." [L]
- Allowed example: "Creating a personal website by yourself." [L]

Team:

- "The license grants permission for up to 25 Employees and Contractors of
  the Licensee to access and use the Components, Templates, and Libraries."
  [L]
- "Licensee is the business entity who has purchased a Team License." [L]
- "Employee is a full-time or part-time employee of the Licensee." and
  "Contractor is an individual or business entity contracted to perform
  services for the Licensee." [L]
- Team-only restriction: "You cannot: … Use the Components, Templates, or
  Libraries to create End Products that are the property of any individual or
  entity other than the Licensee or Clients of the Licensee." with the example
  "your employees/contractors can't use your company Tailwind Plus license to
  build their own websites or side projects." [L]
- Upgrade path: "If you're a solo developer you can start with a regular
  license, and then upgrade to the team license later if other developers join
  your team. There is an 'Upgrade to Team License' option under the 'Account'
  menu after logging in." [FAQ]
- Pricing at capture: Personal "CA$349 one time payment"; Teams "CA$1,299 one
  time payment … team licenses include access for up to 25 people". [PRICE]

**Which license CASI holds.** The signed-in account's Purchases page lists one
purchase, "Tailwind Plus", dated Jul 13, 2023, at $299.00, and the Account
menu offers Changelog / Support / License / Account settings / Purchases with
no team-management entry (the FAQ says a Personal account shows an "Upgrade to
Team License" option there; it was not visible, so the menu is not a reliable
tell either way). A $299 one-time price is in line with the individual tier,
and far below the current Teams price (CA$1,299 vs CA$349 [PRICE]), so this is
very likely a **Personal** license held by the purchaser as an individual, not
a Team license held by CASI. Confirm against the receipt if it matters.

**Does an unlicensed contributor editing the repo matter?** The license does
not answer this directly. What it does say:

- The licensed act is to "access and use the Components". [L] Editing an End
  Product that already incorporates derivatives is not listed as either
  permitted or prohibited for non-licensees. The license is **silent** here.
- What would clearly cross the line is the licensee giving the contributor the
  catalog itself, e.g. account credentials, the local archive, or a pasted
  block from the catalog for them to place: "Share your access … with any
  other individuals" [L]. A contributor who receives only the CASI site source
  has received an End Product, which the license permits to be "open source and
  freely available". [L]
- The FAQ frames the team license as the answer when "other developers join
  your team". [FAQ] The most cautious reading is that anyone who works
  *directly from the block catalog* (rather than from the finished site)
  should be covered by a license: either their own Personal license or a seat
  on a Team license.

Where the license is ambiguous the page says to ask: "Unsure which license
you need, or unsure if your use case is covered by our licenses? Email us at
support@tailwindcss.com with your questions." [L] Support covers "licensing
related concerns". [SUPPORT]

## What this means for CASIWebsite

**1. Adapted block code may be committed to the public repo. Yes.**

The site is an ordinary marketing site, which is the license's own example of
an allowed open-source End Product. Block-derived markup, edited or verbatim,
may live in `index.html` (or wherever the Tailwind rewrite puts it) on a
public branch. Conditions:

- Keep the repo's purpose the website. Do not create a `blocks/`, `ui/`, or
  `components/` directory that holds stock blocks waiting to be used, and do
  not commit an "all blocks we like" reference page. That is the "repository
  of your favorite Tailwind Plus components" the license forbids, even on a
  branch, because the branch is public.
- Do not add a repo-wide MIT/Apache/CC `LICENSE` file that purports to cover
  the markup. Tailwind Labs keeps copyright on the block source. If a
  `LICENSE` is wanted for CASI's own code, scope it and add a short
  `NOTICE`-style line that UI markup derived from Tailwind Plus remains under
  the Tailwind Plus license. (The license does not require this; it avoids
  implying an open-source grant CASI cannot make.)
- Prefer adapted over verbatim: not because the license requires it, but
  because heavily stock, placeholder-filled blocks weaken the "primary
  purpose is the site" argument.

**2. The local archive must stay private to the licensee.**

- Keep the downloaded catalog outside the repository, and outside any shared
  drive, Slack, or Google Drive folder that other CASI members can read.
  Sharing it with anyone is a stated violation under a Personal license.
- Add the archive path to `.gitignore` if it ever sits near the repo (the
  existing `design_handoff_casi_website/` exclusion is the pattern).
- Reuse across the licensee's own projects is fine. Under a Personal license
  those are the licensee's projects; under a Team license they must be the
  licensee company's or a client's.

**3. Contributors.**

- Contributors who edit the finished site (change copy, fix layout, adjust
  the blocks already in `index.html`) do not receive catalog access and the
  license has nothing to say about them. This is the normal case for CASI
  members opening PRs.
- Anyone who needs to pull *new* blocks from the catalog should be a
  licensee. With the current Personal license that is one person. If more
  than one CASI member will work from the catalog, the FAQ's answer is the
  Team upgrade under Account, but note that a Team license is held by a
  "business entity" and covers that entity's employees/contractors, which
  is an awkward fit for a student org. Asking support@tailwindcss.com how they
  treat a student organization is the sanctioned path.

**4. Plan impact.** Nothing here blocks the Tailwind rewrite (#8). The two
things to add to the plan: (a) a `.gitignore` entry and a one-line note in
`CLAUDE.md` that the block archive is never committed and never shared, and
(b) a decision on whether the licensee is the only person who pulls from the
catalog or whether a Team license is bought.
