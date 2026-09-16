# Google Calendar data access: build-time iCal and the browser API key

Research for issue #12 (part of #8). Date of the empirical checks: 2026-09-15
(UTC 2026-09-16 02:19), run from a macOS laptop with curl 8.x, Python 3 and
Node 23.11.1. Every empirical claim states the command and the response. The
API key is never written here; it is called "the key in index.html" (the
`default` value of `gcalApiKey` in the `data-props` attribute of the
`<script type="text/x-dc">` tag, `index.html` line 1134).

Facts used throughout:

- Calendar ID: `c_30fd9569f750ccfb1d8fcacd354e814213f016626f94a1848b8dee1a07e06513@group.calendar.google.com`
  (`gcalId`, `index.html` line 1140).
- Public iCal URL: `https://calendar.google.com/calendar/ical/c_30fd9569f750ccfb1d8fcacd354e814213f016626f94a1848b8dee1a07e06513%40group.calendar.google.com/public/basic.ics`
- Client code: `loadGcal()` (`index.html` line 1256) calls
  `https://www.googleapis.com/calendar/v3/calendars/<id>/events?timeMin=...&singleEvents=true&orderBy=startTime&maxResults=40&key=...`
  twice (upcoming and past) and swallows every error (`.catch(() => {})`).

## Summary

| Question | Answer |
| --- | --- |
| 1. Public iCal from Actions, no key? | Yes. `GET basic.ics` returns 200 with no credentials, no cookie and any (or no) User-Agent. 124 KB, 132 VEVENTs, 35 event RRULEs, 1 VTIMEZONE, 58 RECURRENCE-ID overrides, 16 EXDATEs. `node-ical` 0.27.2 parses and expands it; its expansion matched the Calendar API's own `singleEvents=true` expansion instance-for-instance (19 = 19) for a 6-week window. |
| 2. API v3 from a server with a key? | Yes for a public calendar (the API returns data with only `key=`), but a referrer-restricted key rejects a request that sends no `Referer` (403 `API_KEY_HTTP_REFERRER_BLOCKED`). A server would need either a second key with different restrictions, or to send a matching `Referer` header (which works, but is the wrong tool). The keyless iCal route is better. |
| 3. Website restrictions | Set in Cloud Console under the key's **Application restrictions > Websites**. Google matches the `Referer`; wildcard `*` is allowed only for a whole subdomain or a path. To allow one host you add two entries: `host` and `host/*`. Patterns for this site: `cmuaisafety.com`, `cmuaisafety.com/*`, `www.cmuaisafety.com`, `www.cmuaisafety.com/*`, and for dev `localhost:4399`, `localhost:4399/*`. **API restrictions > Restrict key > Google Calendar API** makes the key useless for any other Google API. |
| 4. Is the key already restricted? | Yes, on both axes. Empirically: no Referer -> 403 `API_KEY_HTTP_REFERRER_BLOCKED`; `Referer: https://cmuaisafety.com/` -> 200; `https://www.cmuaisafety.com/` -> 403; `https://example.com/` -> 403; `http://localhost:4399/` -> 403. A call to the Web Fonts API with the key returns 403 `API_KEY_SERVICE_BLOCKED`, which is the error for a key whose API restrictions exclude that API. So the allow-list today is effectively "cmuaisafety.com, any scheme, any path" and the key is limited to a set of APIs that includes Calendar. |

## Question 1: fetching and parsing the public iCal feed without a key

### 1a. Fetch without credentials

`curl -sI` against the public URL (HEAD request):

```
HTTP/2 200
content-type: text/calendar; charset=utf-8
cache-control: no-cache, no-store, max-age=0, must-revalidate
pragma: no-cache
expires: Mon, 01 Jan 1990 00:00:00 GMT
content-length: 0            <- HEAD; the GET body is 124109 bytes
strict-transport-security: max-age=31536000; includeSubDomains; preload
server: ESF
set-cookie: NID=...; domain=.google.com; HttpOnly   <- set, not required
```

`curl -s -o basic.ics -w "status=%{http_code} size=%{size_download} type=%{content_type} redirects=%{num_redirects}"`:

```
status=200 size=124109 type=text/calendar; charset=utf-8 redirects=0
```

Content of the downloaded `basic.ics` (grep counts):

| Item | Count | Command |
| --- | --- | --- |
| `BEGIN:VEVENT` | 132 | `grep -c '^BEGIN:VEVENT' basic.ics` |
| `RRULE` lines | 37 (35 on events + 2 inside the VTIMEZONE DAYLIGHT/STANDARD blocks) | `grep -c '^RRULE' basic.ics` |
| `BEGIN:VTIMEZONE` | 1 (`TZID:America/New_York`, with DST rules) | `grep -c '^BEGIN:VTIMEZONE'` |
| `RECURRENCE-ID` | 58 (modified instances of recurring events) | `grep -c '^RECURRENCE-ID'` |
| `EXDATE` | 16 | `grep -c '^EXDATE'` |
| `TZID=` references | 260, all `America/New_York` | `grep -o 'TZID=[^:;]*' basic.ics \| sort \| uniq -c` |

The header of the file says `PRODID:-//Google Inc//Google Calendar 70.9054//EN`,
`X-WR-CALNAME:CASI [PUBLIC]`, `X-WR-TIMEZONE:America/New_York`. Sample RRULEs are
of the form `RRULE:FREQ=WEEKLY;UNTIL=20260422T035959Z;BYDAY=WE` and
`RRULE:FREQ=WEEKLY;WKST=MO;COUNT=8;BYDAY=MO`.

Other variants, all HTTP 200 with the same 124109-byte body:

- `curl -s -A '' ...` (empty User-Agent) -> `200 124109`
- `curl -s -A 'node' ...` -> `200 124109`
- Node 23 built-in `fetch(url)` -> `200 text/calendar; charset=utf-8`, 132 VEVENTs; `etag: null`, `last-modified: null`
- Three back-to-back fetches -> `200 200 200`
- The unencoded form of the URL (`...@group.calendar.google.com/...`) -> `200`

Observations that affect the build:

- No credentials, cookie or special User-Agent are needed. Nothing about the
  request depends on where it runs, so a GitHub Actions runner can fetch it the
  same way (I could not run this from Actions itself; the claim rests on the
  request needing nothing runner-specific).
- The response is `cache-control: no-cache, no-store` with no `ETag` or
  `Last-Modified`, so conditional requests are not possible; each build
  downloads the full ~124 KB file. That is fine for a scheduled build.
- I found no published rate limit or quota for the `/calendar/ical/.../public/basic.ics`
  endpoint in the Google Calendar API documentation (the documented quotas at
  <https://developers.google.com/workspace/calendar/api/guides/quota> apply to
  the JSON API, not to the ICS export). Treat the feed as best-effort; one
  fetch per build is far below anything that would matter.
- Freshness: the feed and the JSON API agreed instance-for-instance for the
  2026-09-01 to 2026-10-15 window at the time of the test (see 1c), so the
  export was current at that moment. Google does not document a staleness
  bound for the ICS export; I make no claim about it.

### 1b. Node parsers compared

Registry metadata from `curl https://registry.npmjs.org/<pkg>` on 2026-09-15:

| Package | Latest | Published | Runtime deps | Engines | Licence | Repo |
| --- | --- | --- | --- | --- | --- | --- |
| `node-ical` | 0.27.2 | 2026-09-13 | `rrule-temporal ^2.2.4`, `temporal-polyfill ^1.0.4` | node >= 22 | Apache-2.0 | github.com/jens-maus/node-ical |
| `ical.js` | 2.2.1 | 2025-08-08 | none | none | MPL-2.0 | github.com/kewisch/ical.js |
| `ical-expander` | 3.2.0 | 2025-10-02 | `ical.js ^1.2.2` (resolves to 1.5.0, the previous major) | node >= 4 | MIT | github.com/mifi/ical-expander |
| `rrule` | 2.8.1 | 2023-11-10 | `tslib` | none | BSD-3-Clause | github.com/jakubroztocil/rrule |
| `ical` (peterbraden) | 0.8.0 | 2020-04-07 | `rrule 2.4.1` | none | Apache-2.0 | github.com/peterbraden/ical.js |

What each README says about recurrence and time zones:

- **node-ical** (README at <https://github.com/jens-maus/node-ical/blob/master/README.md>):
  "A feature-rich iCalendar/ICS (RFC 5545) parser for Node.js. Originally
  forked from ical.js by Peter Braden, node-ical has evolved significantly to
  include robust recurrence rule (RRULE) expansion, timezone-aware date
  handling, exception dates (EXDATE), and recurrence overrides (RECURRENCE-ID)."
  Section "Recurrence rule (RRULE) and Timezone Handling": "If a timezone is
  present in DTSTART, all recurrence dates are calculated in that timezone."
  Section "Expanding recurring events": `ical.expandRecurringEvent(event,
  {from, to, includeOverrides, excludeExdates, expandOngoing})` "with proper
  handling of EXDATE, RECURRENCE-ID, and DST transitions". It also ships
  `ical.async.fromURL(url)` to download and parse in one call. The README warns
  that all-day handling changed in v0.22 ("Treat this as a breaking behaviour
  change when migrating from older releases").
- **ical.js** (README at <https://github.com/kewisch/ical.js/blob/main/README.md>):
  parses RFC 5545/7265/6350/7095; has a recurrence iterator ("The recurrence
  tester calculates occurrences based on a RRULE"). Section "Timezones": "The
  stock ical.js does not register any timezones, due to the additional size it
  brings. If you'd like to do timezone conversion, and the timezone
  definitions are not included in the respective ics files, you'll need to use
  `ical.timezones.js`". Our feed does include its VTIMEZONE, so stock ical.js
  is enough, but EXDATE/RECURRENCE-ID handling and windowed expansion are left
  to the caller.
- **ical-expander** (README at <https://github.com/mifi/ical-expander/blob/master/README.md>):
  "Wrapper around ical.js that automatically handles EXDATE (excluded
  recursive occurrences), RRULE and recurring events overridden by
  RECURRENCE-ID. Also handles timezones, and includes timezones from the IANA
  Time Zone Database". API: `new IcalExpander({ics, maxIterations})` then
  `.between(after, before)` returning `{events, occurrences}`. Caveat: it pins
  `ical.js ^1.x` while ical.js is on 2.x, and its `zones.json` is a bundled
  copy of the IANA data that only updates when the package is released.

### 1c. Empirical parse of the real feed

Script: `parsetest/run.js` (scratchpad), Node 23.11.1, packages installed with
`npm install node-ical@0.27.2 ical-expander@3.2.0 ical.js@2.2.1`. Window:
2026-09-01T00:00Z to 2026-10-15T00:00Z.

```
node-ical 0.27.2: 74 VEVENT objects (35 with rrule, 0 standalone RECURRENCE-ID);
  19 instances in window; 70 ms
ical-expander 3.2.0 (ical.js 1.5.0): 9 events + 10 occurrences = 19 in window; 23 ms
only in node-ical: []
only in ical-expander: []
```

(node-ical folds the 58 RECURRENCE-ID components into their master event's
`recurrences` map, hence 74 objects for 132 VEVENTs.) Both libraries produced
the same 19 `(start instant, summary)` pairs, including one RECURRENCE-ID
override (`Session A` on 2026-09-08, flagged `isOverride` by node-ical) and
local times that render correctly in `America/New_York` (5:00 PM EDT ->
21:00Z).

Cross-check against Google's own expansion: `events.list?singleEvents=true&orderBy=startTime&maxResults=250&timeMin=2026-09-01T00:00:00Z&timeMax=2026-10-15T00:00:00Z&key=<the key>`
with `Referer: https://cmuaisafety.com/` returned `HTTP 200`, `19 items`,
`timeZone: America/New_York`, no `nextPageToken`. Diff against the node-ical
set: `only in API: []`, `only in node-ical: []`.

Recommendation: **node-ical**. It is the most recently maintained (published
two days before this test), has first-class `expandRecurringEvent` with
EXDATE/RECURRENCE-ID/DST handling documented in its README, has a built-in
`fromURL`, and its output matched the API exactly on this feed. It requires
Node >= 22; the `ubuntu-24.04` Actions image ships Node 22.23.2 and 24.20.0
(<https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md>,
"Node.js" section), so use `actions/setup-node` with `node-version: 22`.
ical-expander is a fine fallback and gave identical results, but it lags a
major version of ical.js.

## Question 2: Calendar API v3 `events.list` from a server with an API key

What the docs say:

- The `events.list` reference (<https://developers.google.com/workspace/calendar/api/v3/reference/events/list>)
  lists the request as `GET https://www.googleapis.com/calendar/v3/calendars/calendarId/events`,
  marks authorization as optional and lists OAuth scopes including
  `https://www.googleapis.com/auth/calendar.events.public.readonly`. It does
  not itself discuss API keys.
- Google Workspace "Create access credentials" (<https://developers.google.com/workspace/guides/create-credentials>)
  says API keys are for "Access publicly available data anonymously in your
  app" and: "To prevent unauthorized use, we recommend restricting where and
  for which APIs the API key can be used."
- The quota page (<https://developers.google.com/workspace/calendar/api/guides/quota>)
  gives 10,000 requests per minute per project and 600 per minute per user per
  project; over-quota requests get `403 usageLimits` or `429 usageLimits`.

Empirical (all with `maxResults=1&singleEvents=true&orderBy=startTime&timeMin=<now>`,
script `keytest.py`):

| Request | Result |
| --- | --- |
| no `key`, no Referer | `HTTP 403` `PERMISSION_DENIED` reason `forbidden`: "Method doesn't allow unregistered callers (callers without established identity). Please use API Key or other form of API consumer identity to call this API." |
| key in index.html, no Referer | `HTTP 403` `PERMISSION_DENIED`, `ErrorInfo.reason = API_KEY_HTTP_REFERRER_BLOCKED`, metadata `httpReferrer: <empty>`, `service: calendar-json.googleapis.com` |
| key in index.html, `Referer: https://cmuaisafety.com/` | `HTTP 200`, `kind: calendar#events`, `summary: CASI [PUBLIC]`, 1 item |

So:

1. A public calendar's `events.list` works with **only** an API key (no
   OAuth): the request with a matching Referer succeeded with nothing else.
2. A **referrer-restricted key rejects a server request** that sends no
   Referer (`API_KEY_HTTP_REFERRER_BLOCKED`). The `error_reason.proto` in
   googleapis defines it as "The request is denied because it violates API
   key HTTP restrictions"
   (<https://github.com/googleapis/googleapis/blob/master/google/api/error_reason.proto>).
3. A server *can* pass the check by sending a spoofed `Referer` (the row that
   returned 200 came from a Python script on a laptop). That means the
   website restriction only stops browser-originated misuse from other sites;
   it is not a secret. It also means GitHub Actions could technically call the
   API with the browser key plus a `Referer` header, but that is a workaround
   of the restriction, not a design.
4. A server-side key that works cleanly would need **different application
   restrictions** (`IP addresses` or none). GitHub-hosted runners have no fixed
   egress IPs to allow-list, and the docs note "Internal IP addresses and
   localhost aren't supported" for IP restrictions
   (<https://docs.cloud.google.com/docs/authentication/api-keys>, "IP addresses"),
   so the practical server key would be one with **no** application
   restriction and only an API restriction, held as an Actions secret. That is
   a weaker posture than the key we already ship, for no gain: the public iCal
   feed carries the same events with no key at all (Question 1).

Not usable with a key at all (for the record): `calendars.get` on the calendar
and `calendarList.list` both return `HTTP 401 UNAUTHENTICATED`, reason
`CREDENTIALS_MISSING`, "API keys are not supported by this API. Expected
OAuth2 access token". Only `events.list` (and the other public-data reads) work
with a key.

## Question 3: website (HTTP referrer) restrictions and API restrictions

Source: "Manage API keys", <https://docs.cloud.google.com/docs/authentication/api-keys>
(the `cloud.google.com/docs/authentication/api-keys` URL 301-redirects there).
Quotes below are verbatim from that page as fetched on 2026-09-15.

### How restrictions are set (Console)

Section "Add application restrictions", Websites, Console tab:

> In the Google Cloud console, go to the Credentials page: Go to Credentials.
> Click the name of the API key that you want to restrict. In the Application
> restrictions section, select Websites. For each restriction that you want to
> add, click Add, enter the restriction, and then click Done. Click Save to save
> your changes and return to the API key list.

The Credentials page is reached from the console menu **APIs & Services >
Credentials** (Workspace "Create access credentials" page, step 1).

Also: "You can apply only one application restriction type at a time." The
Websites row of the table reads "Web applications — Specifies the websites that
can use the key."

### How the referrer is matched

> To control which websites can use your API keys, you can add one or more HTTP
> referrers as website restrictions. For example, adding https://example.com to
> an API key's website restrictions means that only calls from
> https://example.com can use that API key.
>
> The HTTP referrers used in website restrictions have limited wildcard
> support. You can substitute a wildcard character (*) for a subdomain or path,
> but you can't use a wildcard character in the middle of a URL. For example,
> *.example.com is valid, and accepts all sites ending in .example.com.
> However, mysubdomain*.example.com isn't a valid restriction.
>
> Port numbers can be included in website restrictions. If you include a port
> number, then only requests using that port are matched. If you don't specify
> a port number, then requests from any port number are matched.

The scenario table on the same page:

> **Allow a specific URL** — Add a URL with an exact path. For example:
> `www.example.com/path`, `www.example.com/path/path`. Some browsers implement
> a referrer policy that sends only the origin URL for cross-origin requests.
> Users of these browsers can't use keys with page-specific URL restrictions.
>
> **Allow any URL in your site** — You must set two URLs in the
> allowedReferers list. URL for the domain, without a subdomain, and with a
> wildcard for the path. For example: `example.com/*`. A second URL that
> includes a wildcard for the subdomain and a wildcard for the path. For
> example: `*.example.com/*`.
>
> **Allow any URL in a single subdomain or naked domain** — You must set two
> URLs in the allowedReferers list to allow an entire domain: URL for the
> domain, without a trailing slash. For example: `www.example.com`,
> `sub.example.com`, `example.com`. A second URL for the domain that includes a
> wildcard for the path. For example: `www.example.com/*`, `sub.example.com/*`,
> `example.com/*`.

The same page gives the CLI equivalent: `gcloud services api-keys update
KEY_ID --allowed-referrers="ALLOWED_REFERRER_1"` and notes "the referrer
restrictions provided replace any existing referrer restrictions on the key."

Two facts about how the browser will present itself, which matter for the
pattern choice:

- The default referrer policy is `strict-origin-when-cross-origin`: the W3C
  Referrer Policy spec says a document whose policy is the empty string is
  treated "the same as `strict-origin-when-cross-origin`"
  (<https://w3c.github.io/webappsec-referrer-policy/>, section 3.9 / 8.3).
  For the cross-origin `fetch()` to `www.googleapis.com` that means the browser
  sends `Referer: https://cmuaisafety.com/` (origin only). `index.html` sets
  no `Referrer-Policy`, and `curl -sI https://cmuaisafety.com/` shows GitHub
  Pages sends none either. So a host-level pattern (`cmuaisafety.com/*`) is the
  right shape; page-level patterns would break, as Google's own note warns.
- `https://www.cmuaisafety.com/` answers `HTTP/2 301` with
  `location: https://cmuaisafety.com/` (`curl -sI`, server `GitHub.com`), and
  `http://cmuaisafety.com/` 301s to `https://cmuaisafety.com/`. Browsers never
  execute the page on the `www` host, so today no real request carries a
  `www.` referrer. Allowing `www.` is still worth doing so the key keeps
  working if the redirect is ever removed.

Empirical evidence of matching semantics (Question 4 has the full table):
with the current key, `Referer` values `https://cmuaisafety.com`,
`https://cmuaisafety.com/`, `https://cmuaisafety.com/calendar`,
`https://cmuaisafety.com/a/b?c=d` and `http://cmuaisafety.com/` all passed, while
`https://www.cmuaisafety.com/`, `https://sub.cmuaisafety.com/`,
`https://cmuaisafety.com.evil.com/` and every `localhost` form were blocked.
This is consistent with a scheme-less host pattern plus `/*` (any scheme, any
port, any path, exact host), which is the "single subdomain or naked domain"
recipe above.

Does it work for the Calendar API? Yes: the 403 responses carry
`metadata.service = calendar-json.googleapis.com`, i.e. the Calendar API
front end enforced the referrer rule; the 200 with a matching Referer shows it
lets matching requests through.

### Patterns for this site

Following the "Allow any URL in a single subdomain or naked domain" recipe
(two entries per host):

| Purpose | Entries |
| --- | --- |
| Production apex | `cmuaisafety.com` and `cmuaisafety.com/*` |
| `www` (defensive; currently 301s to apex) | `www.cmuaisafety.com` and `www.cmuaisafety.com/*` |
| Local development (`python3 -m http.server 4399`) | `localhost:4399` and `localhost:4399/*` (port-specific per the port rule), or `localhost` and `localhost/*` to accept any port |

Do not use `*.cmuaisafety.com/*` unless subdomains are wanted; the docs say
`*.example.com` "accepts all sites ending in `.example.com`". The GitHub Pages
default origin (`carnegie-mellon-ai-safety-initiative.github.io`) is blocked
today and should stay blocked unless the site is ever previewed there.

Adding `localhost` is a trade-off: anyone can send `Referer: http://localhost:4399/`
from a script just as they can send any other value (see Question 2, point 3),
so it does not weaken the key against scripted abuse, but it does let any
web page served on a developer's localhost use the key from a browser. The
key's blast radius is bounded by the API restriction (below) and the read-only
nature of key-authenticated Calendar access (Question 2: writes need OAuth).

### API restrictions

Same page, "Apply API key restrictions":

> Unrestricted API keys are insecure. To reduce security risks, you can
> restrict API keys in the following ways: API restrictions: Limit an API key
> so it can only be used with a specific set of APIs. API keys without API
> restrictions can be used with all APIs that accept keys generated by Google
> Cloud. Application restrictions: Limit an API key so it can only be used by
> specific websites, IP addresses, or applications. API keys without
> application restrictions can be used from anywhere. We recommend setting both
> API restrictions and application restrictions.

Section "Add API restrictions", Console tab:

> API restrictions specify which APIs can be called using the API key. Note:
> Before you can specify an API for an API restriction, the API must be
> enabled for your project. ... In the Google Cloud console, go to the
> Credentials page. Click the name of the API key that you want to restrict.
> In the API restrictions section, click Restrict key. Select all APIs that
> your API key will be used to access. Click Save to save your changes and
> return to the API key list.

A request to an API outside the list fails with `API_KEY_SERVICE_BLOCKED`,
defined in `error_reason.proto` as "The request is denied because it violates
API key API restrictions." For this site the list should contain exactly
**Google Calendar API**.

## Question 4: is the current key already restricted?

Script `keytest.py` / `keytest2.py` / `keytest3.py` (scratchpad), Python
`urllib`, User-Agent `curl/8.7.1`, each request
`GET .../calendars/<id>/events?maxResults=1&singleEvents=true&orderBy=startTime&timeMin=<now>&key=<the key in index.html>`.
The key string was read from `index.html` at run time and replaced by
`<KEY>` in all output.

### Website restriction: present

| `Referer` header sent | HTTP | `error.status` / `ErrorInfo.reason` |
| --- | --- | --- |
| (none) | 403 | `PERMISSION_DENIED` / `API_KEY_HTTP_REFERRER_BLOCKED` — "Requests from referer <empty> are blocked." |
| `https://cmuaisafety.com/` | **200** | — (`summary: "CASI [PUBLIC]"`, 1 item) |
| `https://cmuaisafety.com` (no slash) | 200 | — |
| `https://cmuaisafety.com/calendar` | 200 | — |
| `https://cmuaisafety.com/a/b?c=d` | 200 | — |
| `http://cmuaisafety.com/` | 200 | — |
| `https://www.cmuaisafety.com/` | 403 | `API_KEY_HTTP_REFERRER_BLOCKED` |
| `https://sub.cmuaisafety.com/` | 403 | `API_KEY_HTTP_REFERRER_BLOCKED` |
| `https://cmuaisafety.com.evil.com/` | 403 | `API_KEY_HTTP_REFERRER_BLOCKED` |
| `https://example.com/` | 403 | `API_KEY_HTTP_REFERRER_BLOCKED` |
| `https://carnegie-mellon-ai-safety-initiative.github.io/CASIWebsite/` | 403 | `API_KEY_HTTP_REFERRER_BLOCKED` |
| `http://localhost:4399/` | 403 | `API_KEY_HTTP_REFERRER_BLOCKED` |
| `http://localhost/`, `https://localhost/`, `http://127.0.0.1:4399/` | 403 | `API_KEY_HTTP_REFERRER_BLOCKED` |
| (none) but `Origin: https://cmuaisafety.com` | 200 | — |

The last row is an observation, not documented behaviour: Google accepted a
request that had no `Referer` but an `Origin` header matching the allow-list.
The docs do not mention `Origin`; do not rely on it.

Every 403 carries `metadata.consumer = projects/928338477292` — that is the
Google Cloud **project number** that owns the key, which is how to find the
right project in the console (it is not a secret; it is returned to anyone
holding the key).

Conclusion: **the key already has a Websites restriction whose allow-list
covers the apex host only** (any scheme, any path, no `www.`, no subdomains, no
localhost). This is why the live refresh works on cmuaisafety.com and silently
does nothing on `localhost:4399` (the code's `.catch(() => {})` hides the 403).

### API restriction: present

With `Referer: https://cmuaisafety.com/` and the same key:

| Endpoint | HTTP | Reason |
| --- | --- | --- |
| Calendar `events.list` | 200 | — |
| Web Fonts Developer API `GET https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity` | 403 | `API_KEY_SERVICE_BLOCKED` — "Requests to this API webfonts method google.fonts.v1.WebFontsService.ListWebFonts are blocked." |
| YouTube Data API v3 `videos.list` | 403 | `accessNotConfigured`-style message: "YouTube Data API v3 has not been used in project 928338477292 before or it is disabled." (the project-enablement check fired before any key check) |

`API_KEY_SERVICE_BLOCKED` is by definition the error for "violates API key API
restrictions" (`error_reason.proto`), so the key has an API restriction list
and Web Fonts is not on it. I cannot see the list itself from outside; the
console is the only place to confirm it is *exactly* Google Calendar API.

## Recommendation for the data flow

1. **Build (GitHub Actions): use the public iCal feed, no key.**
   - `fetch()` the `basic.ics` URL (Question 1: 200, no credentials, no
     conditional caching, ~124 KB).
   - Parse with `node-ical` (Node 22 via `actions/setup-node`), then for each
     VEVENT call `ical.expandRecurringEvent(ev, { from, to, expandOngoing: true })`
     with a window such as "6 months back to 12 months ahead"; that matches the
     API's `timeMin` semantics ("Lower bound (exclusive) for an event's end
     time", so in-progress events are included). Dedupe on
     `(start instant, uid)` and emit the same shape `mapGcal()` consumes
     (`summary`, `description`, `location`, `start.dateTime|date`,
     `htmlLink`).
   - The ICS has no `URL` property (`grep -c '^URL' basic.ics` -> 0), so the
     "Add to calendar" link has to be derived. Observed relationship (script
     `keytest5.py`, three events checked): the API's `iCalUID` equals the ICS
     `UID` (`<id>@google.com`), the API `id` is that `<id>` with
     `_<YYYYMMDDTHHMMSSZ>` appended for a recurring instance, and `htmlLink`
     is `https://www.google.com/calendar/event?eid=` + unpadded base64 of
     `"<id>[_<instanceUTC>] <calendarId cut after '@g'>"`, e.g.
     `4ugdnj6v2uoi0l27g6oeqvi8g0 c_30fd...e06513@g`. This format is not
     documented by Google; it is observed. Either reproduce it in the build
     (cheap, and matches what the client refresh will render), or leave
     `gcalUrl` empty in the snapshot and let the live refresh fill it.
   - Write `events.json` (or inline it into the page) and commit/deploy on a
     schedule (e.g. cron every few hours) plus on push. Fail the build loudly
     if the fetch is not 200 or yields zero VEVENTs, and keep the previous
     snapshot in that case.
   - Do **not** provision a second, unrestricted API key for Actions; the ICS
     route gives the same data with no secret to manage (Question 2).
2. **Browser: keep the existing referrer-restricted key and `events.list`
   call** for the live refresh. It already works on production; the only
   fix needed is on the key's allow-list (add `www.` and, if wanted,
   `localhost:4399`) — see the checklist. Keep `singleEvents=true` so the API
   does RRULE expansion; the two calls (upcoming/past) are well under quota.
   Consider logging the 403 in development instead of swallowing it, so a
   misconfigured key is visible.
3. **Client merge rule**: render the snapshot immediately; when the live call
   returns 200 with at least one item, replace the snapshot wholesale (the API
   is authoritative). On any error, keep the snapshot. This is what the
   current `loadGcal()` already does with `liveEvents`.
4. Both sources agree on expansion today (19 = 19 in the test window), so
   users should see no flicker between snapshot and live data beyond genuinely
   new edits.

## Checklist for restricting the key in Google Cloud Console (feeds #22)

Everything here is a human task in the console; nothing in the repo changes.
Menu paths and button names are quoted from
<https://docs.cloud.google.com/docs/authentication/api-keys> (sections "Add
API restrictions" and "Add application restrictions > Websites").

1. **Find the project.** Sign in at <https://console.cloud.google.com/> with
   the Google account that owns the CASI calendar project. In the project
   picker, choose the project whose **project number** is `928338477292`
   (shown on the project's Dashboard card; this number came back in the API
   error metadata for the key in index.html).
2. **Open Credentials.** Menu > **APIs & Services** > **Credentials**.
3. **Identify the key.** Under "API keys", find the key whose string equals
   the `gcalApiKey` default in `index.html` (use "Show key" in the console to
   compare; do not paste the key into any issue or doc). Click its name.
4. **Application restrictions > Websites.** Confirm **Websites** is selected.
   Make sure the list contains all of the following (add any that are
   missing with **Add**, then **Done**):
   - `cmuaisafety.com`
   - `cmuaisafety.com/*`
   - `www.cmuaisafety.com`
   - `www.cmuaisafety.com/*`
   - Optional, for local development on `python3 -m http.server 4399`:
     `localhost:4399` and `localhost:4399/*`
   Remove any entry that is not in this list (in particular anything with a
   leading `*.` wildcard, `*.github.io`, or a bare `*`).
5. **API restrictions > Restrict key.** Choose **Restrict key** and tick
   only **Google Calendar API**. Untick anything else. (If Google Calendar API
   is not offered, enable it first under APIs & Services > Library, since
   "Before you can specify an API for an API restriction, the API must be
   enabled for your project.")
6. **Save.** Click **Save**. Google documents a few minutes of propagation
   for key undeletes; allow a similar delay before testing (my inference, not
   a documented figure for restriction edits).
7. **Verify from a terminal** (replace `$KEY` with the key; `ID` is the
   URL-encoded calendar id). Expected results are the ones this research
   observed for a correctly restricted key:

   ```sh
   ID='c_30fd9569f750ccfb1d8fcacd354e814213f016626f94a1848b8dee1a07e06513%40group.calendar.google.com'
   URL="https://www.googleapis.com/calendar/v3/calendars/$ID/events?maxResults=1&singleEvents=true&timeMin=$(date -u +%Y-%m-%dT%H:%M:%SZ)&key=$KEY"
   curl -s -o /dev/null -w '%{http_code}\n' "$URL"                                        # expect 403 (no Referer)
   curl -s -o /dev/null -w '%{http_code}\n' -H 'Referer: https://cmuaisafety.com/' "$URL"     # expect 200
   curl -s -o /dev/null -w '%{http_code}\n' -H 'Referer: https://www.cmuaisafety.com/' "$URL" # expect 200 after step 4
   curl -s -o /dev/null -w '%{http_code}\n' -H 'Referer: https://example.com/' "$URL"         # expect 403
   curl -s -o /dev/null -w '%{http_code}\n' -H 'Referer: http://localhost:4399/' "$URL"       # 200 only if you added localhost
   curl -s "https://www.googleapis.com/webfonts/v1/webfonts?key=$KEY" -H 'Referer: https://cmuaisafety.com/' | grep -o 'API_KEY_SERVICE_BLOCKED'  # expect a match
   ```
8. **Verify in the browser.** Open <https://cmuaisafety.com/> > Calendar
   with DevTools > Network open; the two `googleapis.com/calendar/v3/...`
   requests should be 200. On `http://localhost:4399/` they will be 403 unless
   step 4 added localhost.
9. **Record the state** in issue #22: which referrers are listed, that API
   restrictions = Google Calendar API only, and the date. Do not record the
   key string.

## Sources

- Google Cloud, "Manage API keys" — <https://docs.cloud.google.com/docs/authentication/api-keys>
  (redirect target of <https://cloud.google.com/docs/authentication/api-keys>);
  sections "Apply API key restrictions", "Add API restrictions", "Add
  application restrictions" (Websites, IP addresses). Fetched 2026-09-15.
- Google Cloud, "Use API keys" — <https://docs.cloud.google.com/docs/authentication/api-keys-use>
  (usage only; no restriction guidance). Fetched 2026-09-15.
- googleapis, `google/api/error_reason.proto` — <https://github.com/googleapis/googleapis/blob/master/google/api/error_reason.proto>
  (`API_KEY_SERVICE_BLOCKED`, `API_KEY_HTTP_REFERRER_BLOCKED`, `CREDENTIALS_MISSING`, `SERVICE_DISABLED`).
- Google Calendar API, `events.list` reference — <https://developers.google.com/workspace/calendar/api/v3/reference/events/list>
- Google Calendar API, "Manage quotas" — <https://developers.google.com/workspace/calendar/api/guides/quota>
- Google Workspace, "Create access credentials" — <https://developers.google.com/workspace/guides/create-credentials> (API key section).
- W3C Referrer Policy — <https://w3c.github.io/webappsec-referrer-policy/> (empty policy = `strict-origin-when-cross-origin`).
- npm registry metadata — `https://registry.npmjs.org/{node-ical,ical.js,ical-expander,rrule,ical}` fetched 2026-09-15.
- node-ical README — <https://github.com/jens-maus/node-ical/blob/master/README.md>
- ical.js README — <https://github.com/kewisch/ical.js/blob/main/README.md>
- ical-expander README — <https://github.com/mifi/ical-expander/blob/master/README.md>
- GitHub `actions/runner-images`, Ubuntu 24.04 image readme — <https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md> (Node.js 22.23.2, 24.20.0).
- Empirical checks: `curl` against the iCal URL and `www.googleapis.com`; Python scripts `keytest.py`, `keytest2.py`, `keytest3.py`, `keytest4.py`; Node script `parsetest/run.js` (all in the session scratchpad, not committed). Commands and outputs are reproduced inline above.
