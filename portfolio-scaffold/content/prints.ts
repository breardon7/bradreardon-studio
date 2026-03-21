// ── Print product type ────────────────────────────────────────────────────────
export interface PrintSize {
  label: string       // e.g. '8×10'
  price: number       // USD
  edition: number     // edition size
  sold?: number       // how many sold (for availability display)
}

export interface PrintProduct {
  slug: string
  photoSlug: string   // references photos.ts slug
  title: string
  description: string
  sizes: PrintSize[]
  medium: string      // e.g. 'Archival giclée on Hahnemühle Photo Rag 308gsm'
  framing: string     // e.g. 'Available framed in natural oak, black, or white'
  shipping: string    // e.g. 'Ships within 5–7 business days'
  certificate: boolean // certificate of authenticity included
}

export const prints: PrintProduct[] = [
  {
    slug: 'mist-kyoto-2024',
    photoSlug: 'mist-kyoto-2024',
    title: 'Mist, Kyoto 2024',
    description: 'Taken at 5:30am in the Higashiyama district. The alley was completely empty — an unusual moment in one of Kyoto\'s most-visited areas. The mist had rolled in overnight from the mountains.',
    sizes: [
      { label: '8×10', price: 180, edition: 50 },
      { label: '11×14', price: 320, edition: 25 },
      { label: '16×20', price: 580, edition: 10 },
    ],
    medium: 'Archival giclée on Hahnemühle Photo Rag 308gsm',
    framing: 'Available framed in natural oak, matte black, or white. Frame adds 3–4 days.',
    shipping: 'Ships flat within 5–7 business days. Framed prints ship in 8–10 days.',
    certificate: true,
  },
  {
    slug: 'midtown-3am',
    photoSlug: 'midtown-3am',
    title: 'Midtown, 3am',
    description: 'Shot during a heatwave in July. The streets emptied out around 2am and this stretch of 6th Avenue was completely clear for about forty minutes.',
    sizes: [
      { label: '11×14', price: 280, edition: 30 },
      { label: '16×20', price: 480, edition: 15 },
      { label: '20×24', price: 780, edition: 5 },
    ],
    medium: 'Archival giclée on Canson Baryta Photographique 310gsm',
    framing: 'Available framed in matte black only (portrait orientation).',
    shipping: 'Ships flat within 5–7 business days.',
    certificate: true,
  },
  // Add more prints here
]

export const getPrint = (slug: string) => prints.find(p => p.slug === slug)
