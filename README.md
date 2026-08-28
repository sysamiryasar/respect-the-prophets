# Respect the Prophets ﷺ

**A Journey Through Faith, History & Character**

An interactive cinematic documentary about the Messengers of Allah — built as a
multi-page React application, not one long scrolling page.

```bash
npm install
npm run dev      # http://localhost:5173
npm run plates   # regenerate the image assets
npm run build    # plates + type-check + production bundle into dist/
npm run preview  # serve the built bundle
```

---

## The two rules this project is built around

**1. No Prophet is ever depicted.** Not a face, not a body, not a silhouette, not a
figure of any kind — in the vector artwork or the raster images. Every scene is told
through landscape, architecture, object, light and shadow. This is stated and enforced
in the header comments of both [`SceneArt.tsx`](src/components/visuals/SceneArt.tsx)
and [`plate-art.mjs`](scripts/plate-art.mjs).

**2. Nothing religious is invented.** Every Arabic passage in
[`content.ts`](src/data/content.ts) is real Qur'anic wording or a real hadith, each
carried with its surah/ayah or its collection. Qur'an and hadith are kept structurally
separate and never blended. English text is labelled as a translation of meaning.
Prophet descriptions are educational summaries, not scripture, and the timeline states
outright that it is *not* a precise chronology.

---

## The journey — one continuous experience at `/`

The landing route is a single scroll-driven journey, not a slideshow and not a set of
pages. Ten named sections run **Intro → Why → Iman → Prophets → Stories → Trials →
Lessons → Muhammad ﷺ → Action → Final**, tracked by a top progress bar you can click to
jump anywhere.

**About 12 minutes end to end**, and the reader sets the pace — roughly 22 screens
of scroll and ~90 things to click.

It alternates two modes on purpose:

- **Two pinned cinematic runs**, kept for the moments that earn the scroll: the desert
  road travelling forward, and the reveal of the final Messenger ﷺ over the Ka'bah.
- **Everything else is a stage you click through.** Each prophet's story is a single
  screen advanced beat by beat — Musa's sea opens, Ibrahim's fire cools into light,
  Nuh's storm rises — as are the four points on the road, the six-pillar constellation,
  the golden path of seven prophets, three expanding trials, an eight-spoke wheel that
  turns your choice to the top, sixteen Qur'anic verses, five floating qualities, a
  five-step path upward, and the finale's fade from night into dawn.

The stories used to be scroll-pinned: four screens of scrolling to read four sentences,
and the whole journey ran to 41 screens. Turning them into stages roughly halved the
length and put the reader in control at the same time.

Yusuf's story is a **draggable horizontal journey** — well → prison → palace — that
becomes a vertical list on mobile.

> The chapter pages below still exist and still work; the journey just sits in front of
> them. To swap them back, change the `index` route in `src/App.tsx` from `JourneyPage`
> to `HomePage`.

## The chapters — nine pages

| Route | Chapter | What it does |
|---|---|---|
| `/chapters` | Index | Staged reveal, then an index of all nine chapters |
| `/why` | 01 Why Respect? | Line-by-line reveal building to “We believe in them all” |
| `/pillars` | 02 Six Pillars | Interactive wheel; nodes expand, others dim |
| `/prophets` | 03 The Prophets | 16 cards on a celestial rail (vertical on mobile) |
| `/prophets/:id` | — | A full page per prophet: symbols, story, lesson, references |
| `/stories` | 04 Stories | The seven cinematic scenes, as cards |
| `/stories/:id` | — | One scene, staged beat by beat |
| `/quran` | 05 The Qur'an | 16 verses, word-by-word Arabic, plus hadith |
| `/lessons` | 06 Lessons | 8 qualities, each expanding |
| `/respect` | 07 Respect | Six things respect actually asks of us |
| `/constellation` | 08 Constellation | 16 stars, every line converging on one centre |
| `/final` | 09 Final Message | Fades to one light, then restart |

Every page carries a **prev/next chapter footer**, the nav shows **`03 / 09`**, and
`Alt + ←/→` jumps between chapters. Deep links work, the back button works, and each
chapter is its own lazily-loaded chunk.

### Scenes are stepped, not scrolled

The pieces that used to be scroll-pinned — the seven scenes, the "Respect is more than
words" sequence, the finale — are now driven by
[`SceneStepper`](src/components/SceneStepper.tsx). The reader advances one beat at a
time with a click, the arrow keys, or a swipe, and the artwork responds to the beat:
Musa's sea parts, Ibrahim's fire cools into light, Yusuf's well becomes prison, palace,
then eleven stars. Under reduced motion the whole sequence renders as a plain list
instead.

There is a **hidden interaction** on the Iman hub. Five taps.

---

## Images

The atmospheric backdrop behind every page and card is a real image asset — **26 plates
× 2 themes, 208 files, ~1.7 MB total, largest single file 16 kB** — produced by
[`npm run plates`](scripts/build-plates.mjs):

- AVIF with a WebP fallback, at 1600px and 800px
- a ~1 kB inline LQIP per plate, so images blur up instead of popping in
- `loading="lazy"` and `fetchpriority` set per use site

### They are rendered, not drawn

[`scripts/plate-render.mjs`](scripts/plate-render.mjs) is a small renderer that
evaluates each plate per pixel, in linear light:

| | |
|---|---|
| **sky** | vertical gradient plus three sun lobes — the disc, a tight Mie forward-scatter halo, and the broad wash that lifts the whole sky near the light |
| **clouds** | fBm density shaded by transmittance toward the sun, which is what gives a cloud its bright rim instead of a flat grey blob |
| **shafts** | crepuscular rays, ray-marched toward the sun at quarter resolution |
| **terrain** | fBm and ridged heightfields, normals from a 2D surface field, Lambert shading, ambient occlusion, and aerial perspective |
| **water** | wave normals differenced in screen space → Fresnel sky reflection, plus a specular track under the light |
| **depths** | Beer-Lambert absorption, caustics, and a single shaft from the surface |
| **lens** | bloom, ACES filmic tonemap, film grain, vignette, chromatic aberration |

Working in linear space and tonemapping at the end is most of why these read as light
rather than as gradients, and aerial perspective is what stops the ranges stacking up
like paper cutouts. Everything is seeded from the plate id, so builds stay byte-stable.

The earlier plates were SVG — a linear-gradient sky, circles for stars, flat-filled
silhouettes — which is why they read as illustration.

They remain **backdrops**: landscape, weather, light, water and Islamic architecture
(domes, minarets, arcades). The symbolic vector art (staff, ark, well, Ka'bah) is
layered live on top, so nothing is duplicated between the two. Nothing in the renderer
is capable of drawing a figure.

The parchment theme is not the night theme with a filter over it. It is the same
landscape at a different hour: its own sun, haze, exposure and grade, settled onto the
same paper colour the UI uses.

### Using your own artwork instead — including from Canva

Export 16:9, drop the files in [`art/`](art/README.md) named after the plates they
replace, and run:

```bash
npm run plates:import
```

That builds the same AVIF/WebP/LQIP set from your images and records them in
`art/imported.json`, so a later `npm run plates` leaves them alone instead of
overwriting your work. Supply only the ids you want — the rest keep their render, and
the two mix freely on the same page. `art/README.md` has the full id list.

> Whatever you put there is bound by the same rule as the rest of the project: no
> depiction of any Prophet, including silhouettes. If you generate images with an AI
> tool, check the output rather than trusting the prompt — and keep Arabic and Qur'anic
> text out of generated imagery, since verses here are set as real text with surah and
> ayah numbers precisely so nothing scriptural is left to a generator.

---

## Architecture

```
scripts/
  plate-art.mjs        the backdrop generator (SVG)
  build-plates.mjs     rasterises to AVIF/WebP + writes src/data/plates.ts
src/
  data/
    prophets.ts        16 prophets: symbols, themes, lessons, Qur'an refs, star map
    content.ts         verses, hadith, pillars, lessons, scene beats
    chapters.ts        the nine-chapter registry — order, titles, plates, routing
    plates.ts          GENERATED — inline blur-up placeholders
  lib/
    journey.tsx        app state: motion pref, sound, viewport
    useCanvas.ts       one well-behaved canvas loop (DPR, visibility, self-healing)
  components/
    AppShell           routing shell, page transition, scroll reset
    ChapterPage        the shell every chapter shares + prev/next footer
    SceneStepper       beat-by-beat scene navigation
    Plate              responsive AVIF/WebP with blur-up
    Navigation · ProphetCard · CustomCursor · AudioControls · ui
    visuals/           ParticleField · GeometricPattern · SceneArt · ProphetGlyph
  pages/               one file per route
```

**Stack:** React 18 · TypeScript (strict) · Vite 6 · Tailwind v4 · React Router 7 ·
Framer Motion · Lucide · sharp (build-time only). No GSAP and no Three.js — every
environment is 2D canvas or SVG, so neither would have earned its bytes.

---

## Deploying

**Live at <https://sysamiryasar.github.io/respect-the-prophets/>**

`dist/` is a static SPA. Two things matter wherever it goes:

1. **The base path.** Project pages are served from `/<repo>/`, so build with
   `BASE_PATH` set. At the root (Netlify, Vercel, a custom domain) leave it unset.
2. **A fallback for deep links.** `/prophets/musa` is a client-side route, so the host
   must serve the app shell for unknown paths. `public/_redirects` (Netlify) and
   `vercel.json` do this; GitHub Pages has no rewrite rules, so `404.html` is a copy of
   `index.html` instead — it comes back with a 404 *status*, then the app boots and
   routes correctly.

Check a Pages-style build locally before shipping — subpath and fallback included:

```bash
BASE_PATH=/respect-the-prophets/ npm run build && cp dist/index.html dist/404.html
npm run preview:pages   # http://localhost:5180/respect-the-prophets/
```

### Publishing an update

The site currently deploys from the `gh-pages` branch:

```bash
BASE_PATH=/respect-the-prophets/ npm run build
cp dist/index.html dist/404.html && touch dist/.nojekyll
git worktree add --detach ../.ghp-tmp && cd ../.ghp-tmp
git checkout gh-pages && rm -rf ./* && cp -r ../respect-the-prophets/dist/. .
git add -A && git commit -m "Deploy" && git push
```

### Automating it

[`deploy/github-pages.yml`](deploy/github-pages.yml) is a ready GitHub Actions workflow
that does all of the above on every push to `main`. It isn't active yet: writing to
`.github/workflows/` needs the `workflow` OAuth scope, which the token used to create
this repo didn't have. To turn it on:

```bash
gh auth refresh -h github.com -s workflow
git mv deploy/github-pages.yml .github/workflows/deploy.yml
git commit -m "Enable Pages deploy workflow" && git push
```

Then set **Settings → Pages → Source** to **GitHub Actions**.

---

## Performance

The opening page plus the shell is all that loads up front; each of the twelve routes is
its own chunk (1–10 kB gzipped).

The particle system is deliberately cheap: glow comes from a single pre-rendered radial
sprite rather than `shadowBlur`, counts scale to viewport area and halve on small
screens, and every canvas pauses when scrolled out of view or when the tab is hidden.

## Themes

Two complete art directions, toggled from the header (☀/☾) and remembered per
visitor; the first visit follows `prefers-color-scheme`.

The dark theme is the source of truth — every accent, sky and silhouette is
authored for night. The light theme re-reads those same values through the
transforms in [`lib/art.ts`](src/lib/art.ts), so there is one palette to
maintain rather than two:

| transform | what it does on parchment |
|---|---|
| `ac()` | drives an accent down to a readable version of the same hue |
| `sky()` | turns a night sky into a pale wash — Musa stays cool, Ibrahim warm |
| `ground()` | keeps terrain sand-toned, since near-black type sits on it |
| `sil()` | keeps architecture dark, so the Ka'bah still reads as a silhouette |

Each forces an exact lightness rather than scaling it, which makes them
idempotent — safe to apply anywhere in the tree. Colours are biased toward
paper on the way, because raising the lightness of a blue-black palette
otherwise gives you cold lavender on a warm ground.

Tailwind v4 compiles theme values to CSS variables, so redefining them under
`html[data-theme="light"]` re-skins every `bg-ink`/`text-ivory` at once. The
token names are **roles**: `ink` is always the page ground, `ivory` always the
primary text, and the two simply trade places.

Every plate is rasterised twice, and `Plate` picks the right one.

## Performance

```bash
node scripts/perf.mjs --url http://localhost:5179/ --cpu 4          # desktop
node scripts/perf.mjs --url http://localhost:5179/ --cpu 6 --mobile
```

Scroll was measurably janky — 100 ms median frames at 4× CPU throttle. What
fixed it, in order of effect:

- **Scroll progress moved from React state to a MotionValue.** It changed 60×
  a second, which changed the context value, which re-rendered the entire
  journey on every frame.
- **The nav stopped measuring eleven elements per scroll frame** to find the
  active section — that was forcing synchronous layout the whole way down.
  It uses an IntersectionObserver now.
- **`content-visibility`** so the browser skips styling, layout and paint for
  scenes that are nowhere near the viewport. Placeholder sizes are matched per
  section height, or the page grows and shrinks as you scroll.
- **Canvases mount only near the viewport.** Each is its own compositing layer
  whether or not it is drawing; the page went from 23 live canvases to 3.
- **One shared rAF** drives every canvas instead of one loop each.
- **Blur pulled back on display type** (16px → 5px, none on touch) — blurring
  8rem text re-rasterises it every frame.
- One grain and one vignette for the page instead of 31 full-viewport layers.

Result at 4× throttle: median 100 → 50 ms, worst frame 233 → 100 ms, long
frames 284 → 105. Mobile at 6× throttle sits at 33 ms with 20 long frames.

## Responsive

```bash
node scripts/responsive.mjs --url http://localhost:5179/
```

Loads the journey at eight real device widths in both themes and walks the
whole page at each, checking horizontal overflow, elements escaping their
container, text clipped inside its own box, sub-28px tap targets, and console
errors. Currently **16/16 clean**.

## Visual QA

```bash
npx playwright install chromium   # once
node scripts/capture.mjs --url http://localhost:5178/ --out .qa
node scripts/capture.mjs --url http://localhost:5178/ --out .qa-mob --mobile
```

[`scripts/capture.mjs`](scripts/capture.mjs) walks the journey in a real rendering
browser: it screenshots every scene at four points through its scroll track, clicks
each interaction and screenshots the result, and writes a `report.json` with console
errors, horizontal overflow, and any element bleeding out of its container. Looking at
the output is how the fire stopped being a row of spikes and the crescent moon stopped
being a full disc.

## Accessibility

- Full keyboard support: skip link, gold focus rings, arrow keys on the stepper /
  pillars wheel / timeline rail / verse reader, `Alt+←/→` between chapters, `Esc` to
  close.
- Dialogs trap focus, lock the body, and restore focus on close.
- One `h1` per page, real landmarks, labelled controls, ≥30px touch targets.
- **A motion toggle in the header**, on top of honouring `prefers-reduced-motion`.
  Reduced motion is a genuinely different build: stepped scenes become plain lists,
  entrance animations are skipped rather than shortened, canvases render one still
  frame, and page transitions are removed.
- Reveal animations carry a failsafe — if the observer never reports, content in the
  viewport is shown anyway. An animation must never be why text is unreadable.

## Sound

Nothing autoplays. The **Sound on/off** control synthesises a wind-and-drone bed with
the Web Audio API, so the page ships zero audio payload while exposing the interface a
real stem set would use (`start()` / `stop()` / `cue()`). To swap in recordings, replace
`buildBed()` in [`journey.tsx`](src/lib/journey.tsx).
