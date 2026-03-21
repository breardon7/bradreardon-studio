// ── Photo type ────────────────────────────────────────────────────────────────
export interface Photo {
  slug: string
  src: string
  alt: string
  title: string
  series: string
  aspectRatio: string  // e.g. '3/4', '4/5', '1'
  year: number
  featured?: boolean
}

// ── Series list ───────────────────────────────────────────────────────────────
export const SERIES = [
  'Urban Stillness',
  'Coastlines',
  'Portraits',
  'Long Exposure',
  'Abstract',
] as const

// ── Sample data — replace src values with your actual images ─────────────────
// Place your optimised JPEGs in /public/images/ and update src paths below.
// Naming convention: /images/{series-slug}/{filename}.jpg
export const photos: Photo[] = [
  {
    slug: 'mist-kyoto-2024',
    src: '/images/urban/mist-kyoto.jpg',
    alt: 'Morning mist over empty Kyoto alley',
    title: 'Mist, Kyoto 2024',
    series: 'Urban Stillness',
    aspectRatio: '3/4',
    year: 2024,
    featured: true,
  },
  {
    slug: 'midtown-3am',
    src: '/images/urban/midtown-3am.jpg',
    alt: 'Empty Midtown Manhattan street at 3am',
    title: 'Midtown, 3am',
    series: 'Urban Stillness',
    aspectRatio: '4/5',
    year: 2024,
    featured: true,
  },
  {
    slug: 'pacific-coast-hwy',
    src: '/images/coastlines/pacific-coast.jpg',
    alt: 'Pacific Coast Highway at dusk',
    title: 'Pacific Coast Hwy',
    series: 'Coastlines',
    aspectRatio: '5/4',
    year: 2023,
  },
  {
    slug: 'clara-natural-light',
    src: '/images/portraits/clara.jpg',
    alt: 'Portrait of Clara in natural window light',
    title: 'Clara, Natural Light',
    series: 'Portraits',
    aspectRatio: '2/3',
    year: 2024,
  },
  {
    slug: 'shadow-study-iv',
    src: '/images/abstract/shadow-study-4.jpg',
    alt: 'Abstract shadow pattern study number four',
    title: 'Shadow Study IV',
    series: 'Abstract',
    aspectRatio: '1',
    year: 2023,
  },
  // Add more photos here following the same structure
]

// ── Helpers ───────────────────────────────────────────────────────────────────
export const getFeatured = () => photos.filter(p => p.featured)
export const getBySeries = (series: string) => photos.filter(p => p.series === series)
