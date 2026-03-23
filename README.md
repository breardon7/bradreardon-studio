# bradreardon.studio — Photography Portfolio

Next.js 14 · Tailwind CSS · Vercel

---

## Getting started

```bash
npx create-next-app@latest bradreardon --typescript --tailwind --app --eslint
# Copy all files from this scaffold into the new project
cd bradreardon
npm install
cp .env.local.example .env.local   # fill in your keys
npm run dev
```

---

## Adding photos — full workflow

This is the section you'll return to every time you update the site.
There are two steps: export the file, then register it in `content/photos.ts`.

---

### Step 1 — Lightroom export settings

Use these settings every time. Save them as a named export preset in Lightroom
("Web — bradreardon.studio") so you never have to think about it again.

**File settings**
- Format: JPEG
- Quality: 85
- Color space: sRGB  ← critical — AdobeRGB will look washed out in browsers
- Limit file size to: leave unchecked

**Image sizing**
- Resize to fit: Long Edge
- Long edge: 2400 px
- Resolution: 72 ppi (irrelevant for web, but set it anyway)

**Output sharpening**
- Sharpen for: Screen
- Amount: Standard

**Metadata**
- Include: Copyright Only  ← strips GPS, keeps your copyright string
- Remove person info: checked
- Write keywords as Lightroom hierarchy: unchecked

**Watermarking**
- None — watermarks degrade the work; copyright metadata is sufficient

**File naming**
Use lowercase, hyphens only, no spaces or underscores:
`series-descriptive-title-year.jpg`

Examples:
- `architecture-broadway-facade-2024.jpg`
- `street-canal-st-rain-2023.jpg`
- `still-life-glass-study-iii-2024.jpg`
- `abstract-light-form-no7-2024.jpg`

**After export — optional compression pass**
Run exported files through Squoosh CLI for an additional 20–40% size reduction
with no visible quality loss. Target: under 400KB per file, ideally under 300KB.

```bash
npm install -g @squoosh/cli
squoosh-cli --mozjpeg '{"quality":85}' public/images/architecture/*.jpg
```

---

### Step 2 — Folder structure in the repo

Place exported files here, organised by series. The folder name does not need
to match the series name exactly — it just needs to be consistent with the `src`
paths you write in `content/photos.ts`.

```
public/
  images/
    architecture/
      broadway-facade-2024.jpg
      canal-columns-2023.jpg
      interior-no2-2024.jpg
    street/
      canal-st-rain-2023.jpg
      bowery-3am-2024.jpg
    still-life/
      glass-study-iii-2024.jpg
      surface-no4-2023.jpg
    abstract/
      light-form-no7-2024.jpg
      shadow-study-iv-2023.jpg
    about/
      portrait-2024.jpg          ← your about page photo, any size/crop
    prints/
      broadway-facade-print.jpg  ← optional higher-res version for shop thumbnails
```

**Rules:**
- Never put original full-resolution files in `public/` — these are public-facing
- Keep originals in a separate encrypted backup, never in the repo
- File names in lowercase, hyphens only — no spaces, no underscores, no capitals
- The `public/` folder is committed to GitHub; keep it web-optimised files only

---

### Step 3 — Register the photo in `content/photos.ts`

Open `content/photos.ts`. Every photo on the site lives here as an object in
the `photos` array. Add a new entry following this structure:

```ts
{
  slug: 'broadway-facade-2024',
  // ↑ Unique identifier. URL-safe: lowercase, hyphens, no spaces.
  //   Used to link to the print shop page if you sell this image.
  //   Once set, don't change it — it would break any existing links.

  src: '/images/architecture/broadway-facade-2024.jpg',
  // ↑ Path from the public/ folder. Must start with /images/

  alt: 'Cast iron facade on Broadway, early morning light, 2024',
  // ↑ Describes the image for screen readers and search engines.
  //   Be specific. "Architecture photo" is bad. Describe what's actually there.

  title: 'Broadway, no. 3',
  // ↑ Shown on hover in the gallery grid, and on the print shop page.
  //   This is editorial — it's how you want the work named publicly.
  //   Can differ from the filename.

  series: 'Architecture',
  // ↑ Controls which filter tab this photo appears under.
  //   Must be EXACTLY one of these strings (case-sensitive):
  //   'Architecture' | 'Street' | 'Still life' | 'Abstract'

  aspectRatio: '3/4',
  // ↑ The shape of the card in the grid. Must match your actual crop.
  //   Wrong aspect ratio = image squashed or cropped wrong in the layout.
  //
  //   Common values:
  //   '3/4'   portrait, standard (most common for architectural/fashion)
  //   '2/3'   portrait, taller
  //   '1'     square
  //   '3/2'   landscape, standard
  //   '5/4'   landscape, slightly tall
  //   '16/9'  cinematic wide

  year: 2024,
  // ↑ Shown alongside the series name in the hover overlay.

  featured: false,
  // ↑ Set to true for exactly 4 photos — these appear as the small
  //   thumbnail strip on the home page bottom-right.
  //   Pick images that represent different series and aspect ratios.
}
```

**Full working example — architecture photo:**

```ts
{
  slug: 'broadway-facade-2024',
  src: '/images/architecture/broadway-facade-2024.jpg',
  alt: 'Cast iron facade on Broadway, early morning light, 2024',
  title: 'Broadway, no. 3',
  series: 'Architecture',
  aspectRatio: '3/4',
  year: 2024,
  featured: true,
},
```

**Full working example — street photo:**

```ts
{
  slug: 'canal-st-rain-2023',
  src: '/images/street/canal-st-rain-2023.jpg',
  alt: 'Canal Street intersection in rain, looking north, 2023',
  title: 'Canal St.',
  series: 'Street',
  aspectRatio: '3/2',
  year: 2023,
  featured: false,
},
```

**Full working example — still life:**

```ts
{
  slug: 'glass-study-iii-2024',
  src: '/images/still-life/glass-study-iii-2024.jpg',
  alt: 'Glass vessel catching afternoon light against white surface',
  title: 'Glass study, III',
  series: 'Still life',
  aspectRatio: '1',
  year: 2024,
  featured: true,
},
```

---

### Step 4 — Controlling the order

Photos appear in the gallery in the **exact order they are listed in the array**,
top to bottom. The grid fills left-to-right across three columns, so position 1
is top-left, position 2 is top-centre, position 3 is top-right, position 4 is
second row left, and so on.

**Sequencing principles:**

- Lead with your strongest single image — it sets the bar for everything else
- Vary series across the first 6 entries so the initial grid shows range before
  anyone touches the filter tabs
- Think about aspect ratio rhythm — alternating portrait/landscape/square creates
  visual tension; running 6 portraits in a row feels static
- Within a series filter, the same global order applies — so if you want your
  Architecture series to open with the facade shot, make sure it appears before
  your other architecture entries in the array

**Example of a well-sequenced opening (first 6 entries):**

```ts
export const photos: Photo[] = [
  // Row 1
  { slug: 'broadway-facade-2024', series: 'Architecture', aspectRatio: '3/4', ... },  // strong, portrait
  { slug: 'canal-st-rain-2023',   series: 'Street',       aspectRatio: '3/2', ... },  // landscape contrast
  { slug: 'glass-study-iii-2024', series: 'Still life',   aspectRatio: '1',   ... },  // square, different register

  // Row 2
  { slug: 'light-form-no7-2024',  series: 'Abstract',     aspectRatio: '2/3', ... },  // tall portrait
  { slug: 'bowery-3am-2024',      series: 'Street',       aspectRatio: '3/4', ... },  // portrait
  { slug: 'interior-no2-2024',    series: 'Architecture', aspectRatio: '5/4', ... },  // landscape, closes row
  // ... continue
]
```

---

### Step 5 — Featured thumbnails (home page)

The home page shows 4 small thumbnails in the bottom-right corner. These are
controlled by `featured: true` in `photos.ts`. Set exactly 4 photos as featured.

Pick images that:
- Represent different series (show range at a glance)
- Have varied aspect ratios — the strip looks better with mixed heights
- Are among your strongest individual frames

The strip renders in the order they appear in the array, so if you want a
specific left-to-right sequence, order your `featured: true` entries accordingly.

---

## Cursor workflow

Open this project in Cursor. Use **Composer** (⌘K or the Composer panel) to
generate components by describing them. Keep this README open as context.

**Effective prompt pattern:**
> "In this Next.js 14 + Tailwind project, create [component]. It should [visual
> description]. Use the existing color tokens from tailwind.config.ts. Match the
> typographic style in Nav.tsx — Libre Baskerville for display, Jost 300 for body.
> Follow the existing file structure."

**Key prompts to run first:**

1. Lightbox / fullscreen viewer:
   > "Create a PhotoLightbox component. When a photo card in WorkPage is clicked,
   > it opens a fullscreen overlay on the dark ground (#0e0e0c). Shows the image
   > centered with prev/next keyboard navigation (← →) and escape to close.
   > Title and series shown bottom-left in the same type treatment as work grid
   > hover state. No close button — escape only."

2. Mobile nav:
   > "Add a mobile hamburger menu to Nav.tsx. On screens below md breakpoint,
   > hide the nav-links and show a minimal toggle. When open, show links stacked
   > vertically in a full-width drawer below the nav bar, same type treatment."

3. Print shop Stripe integration (when ready):
   > "Add Stripe Checkout to the shop. Each PrintProduct in content/prints.ts
   > has a sizes array. Create an API route at /api/checkout that accepts a
   > printSlug and sizeLabel, finds the matching Stripe Price ID from an env
   > variable map, and creates a Stripe Checkout Session with success_url and
   > cancel_url. Return the session URL."

---

## Print fulfilment

**Current approach: inquiry-based (no payment processing needed yet)**

- Buyer clicks a print → /shop/[slug] → clicks "Inquire about this print"
- Contact form pre-fills subject with print title
- You receive the email via Resend, invoice manually via Stripe Payment Link
- Print at your local fine art lab, ship yourself
- This keeps overhead zero while your print offering is small

**When to add Stripe Checkout:**
- More than ~5 print inquiries/month
- You want to accept payment without back-and-forth

**Recommended labs (NYC):**
- Duggal Visual Solutions (Chelsea) — fine art giclée, excellent quality
- Digital Silver Imaging (Boston, ships fast) — Hahnemühle specialist
- Capture (Brooklyn) — good for smaller runs

---

## Deployment

1. Push to a **private** GitHub repository
2. Connect repo to Vercel — every push to `main` auto-deploys
3. Add environment variables in Vercel dashboard → Settings → Environment Variables
4. Add custom domain: Vercel dashboard → Domains → add `bradreardon.studio`
5. At your registrar (Cloudflare), set:
   - A record: `@` → Vercel's IP (shown in dashboard)
   - CNAME: `www` → `cname.vercel-dns.com`

**Note:** If you registered at Cloudflare Registrar and also use Cloudflare DNS,
you can point directly to Vercel's nameservers or use Cloudflare's proxy —
Vercel's docs cover both. The simplest path: in Vercel, click "Add Domain",
follow the prompts, and it will tell you exactly which DNS records to set.

---

## File structure

```
app/
  (site)/
    page.tsx          ← Home: name + series index + thumbs
    gallery/          ← Work: series-filtered grid
    about/            ← About: split layout
    shop/             ← Print listing
    shop/[slug]/      ← Individual print + inquiry
    contact/          ← Contact form
  api/
    contact/          ← Resend email API
  layout.tsx          ← Root layout, fonts, nav, footer
  globals.css

components/
  Nav.tsx             ← Site navigation
  MasonryGrid.tsx     ← Reusable photo grid (columns layout)

content/
  photos.ts           ← Photo metadata — edit this to add/remove images
  prints.ts           ← Print product data — edit this to manage shop

public/
  images/             ← Optimised JPEGs (2400px long edge, 85% quality)
    architecture/
    street/
    still-life/
    abstract/
    about/
    prints/
```

---

## Color tokens (Tailwind)

| Token | Value     | Use                       |
|-------|-----------|---------------------------|
| bg    | #0e0e0c   | Body background           |
| bg2   | #131311   | Nav, raised surfaces      |
| bg3   | #181816   | Cards                     |
| edge  | #222220   | Borders, dividers, gaps   |
| white | #f0ede8   | Headings, active elements |
| text  | #ccc9c2   | Body text                 |
| muted | #5e5c58   | Secondary text, inactive  |
| dim   | #3a3836   | Tertiary — counts, caps   |
| faint | #2e2e2c   | Structural, nearly hidden |

