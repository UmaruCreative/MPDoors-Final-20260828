# MP Doors

The MP Doors website. Static HTML, no build step, no framework, no package
manager. Every page is hand maintained and can be opened, edited and deployed
as it stands.

- 27 pages
- 10 entry door styles, 5 patio doors, across 2 sub categories
- Metadata to `site-v4-metadata-2026-08-27` v3.0: titles, descriptions, robots,
  canonicals, Open Graph, Schema.org in JSON-LD, and Dublin Core
- Sold through The Home Depot; every "Where to buy" link points there

Full detail on structure, copy decisions, image sourcing and metadata is in
[SITE-ARCHITECTURE.txt](SITE-ARCHITECTURE.txt).

---

## Running it locally

The pages must be served over HTTP rather than opened from the filesystem, so
that relative asset paths resolve the way they will in production.

```
python3 -m http.server 8777
```

Then open <http://127.0.0.1:8777/>.

---

## Before the first deploy

Every page carries absolute URLs on `https://www.mpdoors.com`: canonical links,
`og:url`, `og:image`, `twitter:image`, `DC.identifier`, and the `@id`, `url`
and `image` fields inside each JSON-LD graph. 675 of them.

Those are correct for production and wrong anywhere else. A canonical pointing
at another host tells Google the real page lives there, and an `og:image` that
404s renders a blank social card.

Point them at whatever host you are deploying to:

```
python3 set-host.py https://YOURNAME.github.io/REPO --staging
```

`--staging` also swaps in a `robots.txt` that disallows everything, so a
preview build cannot compete with the live site in search.

At cutover, switch back:

```
python3 set-host.py https://www.mpdoors.com --production
```

The script remembers the current host in `.deploy-host`, so it can be run
repeatedly without damage. It reports how many references it changed and
verifies none were left behind.

---

## Structure

```
.
├── index.html                          Homepage
├── entry-doors.html                    Entry landing, 10 styles
├── entry-*.html                        10 entry product pages
├── patio-doors.html                    Patio landing
├── patio-gliding.html                  Gliding sub category
├── patio-hinged.html                   Hinged sub category
├── patio-2-panel-gliding.html          Product
├── gliding-3-4-lite.html               Product
├── patio-full-lite-hinged.html         Product
├── patio-3-4-lite-hinged.html          Product
├── patio-impact-full-lite-hinged.html  Product, HVHZ impact
├── why-composite.html                  Material, HydroShield, certifications
├── real-projects.html                  Filterable installation gallery
├── blog.html                           Index plus six full articles
├── warranty-support.html               Measure, install, care, warranty, FAQ
├── 404.html                            Served automatically by GitHub Pages
├── robots.txt  sitemap.xml  llms.txt
├── set-host.py                         Host switcher, see above
├── SITE-ARCHITECTURE.txt               The full record
└── assets/
    ├── css/     styles.css glass.css   homepage
    │            home.css product.css   interior pages
    ├── js-home.js                      homepage behaviour
    ├── brand/                          wordmark and icon
    ├── images/                         golden yellow renders, retained
    ├── product/                        product photography by range
    ├── scene/                          lifestyle and cinematic photography
    └── social/                         27 Open Graph cards, 1200 x 630
```

Interior pages carry their own small inline script. Only the homepage loads an
external JS file. The single third party dependency is the Google Fonts
stylesheet for Cormorant Garamond.

---

## URLs

The canonicals declare directory URLs, for example
`https://www.mpdoors.com/entry-doors/craftsman/`, while the files on disk are
flat, for example `entry-craftsman.html`.

That is deliberate and it needs one decision at deploy time.

- **On a host with rewrites** (Cloudflare Pages, Netlify, nginx, Apache) map
  each clean URL to its file. The canonicals are then correct as they stand.
- **On GitHub Pages**, which has no rewrite engine, pages are served at their
  `.html` paths. Either accept that and rerun `set-host.py`, having first
  changed the canonicals to match, or restructure each page into its own
  directory as `index.html`.

`SITE-ARCHITECTURE.txt` section 1 carries the full URL map.

---

## Editing

Colours, type scale and spacing are CSS custom properties at the top of
`assets/css/styles.css` (homepage) and `assets/css/home.css` (interior). Change
them there rather than in the rules below.

Stylesheet links carry a `?v=` cache buster. Bump it when you change a
stylesheet, or browsers will keep serving the old one.
