# bradreardon.com — Photography Portfolio

Next.js 14 · Tailwind CSS · Vercel

---

## Getting started

```bash
npx create-next-app@latest bradreardon --typescript --tailwind --app --eslint
# Then copy all files from this scaffold into the new project
cd bradreardon
npm install
cp .env.local.example .env.local   # fill in your keys
npm run dev
```

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
  Nav.tsx             ← Fixed nav with availability indicator
  MasonryGrid.tsx     ← Reusable photo grid (columns layout)

content/
  photos.ts           ← Photo metadata — edit this to add/remove images
  prints.ts           ← Print product data — edit this to manage shop

public/
  images/             ← Optimised JPEGs go here
    architecture/
    street/
    still-life/
    abstract/
    about/
    prints/
```

---

## Adding photos

1. Export from Lightroom: max 2400px long edge, 85% JPEG, strip GPS EXIF
2. Drop into `public/images/[series]/filename.jpg`
3. Add entry to `content/photos.ts` following the existing type
4. For featured thumbnails on the home page, set `featured: true`

---

## Color tokens (Tailwind)

| Token   | Value     | Use                        |
|---------|-----------|----------------------------|
| bg      | #0e0e0c   | Body background            |
| bg2     | #131311   | Nav, raised surfaces       |
| bg3     | #181816   | Cards                      |
| edge    | #222220   | Borders, dividers, gaps    |
| white   | #f0ede8   | Headings, active elements  |
| text    | #ccc9c2   | Body text                  |
| muted   | #5e5c58   | Secondary text, inactive   |
| dim     | #3a3836   | Tertiary — counts, caps    |
| faint   | #2e2e2c   | Structural, nearly hidden  |
| avail   | #6a8a6a   | Availability dot           |
