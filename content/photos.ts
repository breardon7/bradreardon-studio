// ── Photo type ────────────────────────────────────────────────────────────────
export interface Photo {
  slug: string
  src: string
  alt: string
  title: string
  series: string
  aspectRatio: string
  year: number
  featured?: boolean
  cover?: boolean
}

// ── Series list ───────────────────────────────────────────────────────────────
export const SERIES = [
  'Architecture',
  'Street',
  'Endless Pane',
  'Still Life',
  'Personal Projects',
  'Abstract',
] as const

// ── Photos ────────────────────────────────────────────────────────────────────
export const photos: Photo[] = [
  {
    slug: 'urban-crown-shyness',
    src: '/images/architecture/urban-crown-shyness.jpg',
    alt: 'Urban Crown Shyness',
    title: 'Urban Crown Shyness',
    series: 'Architecture',
    aspectRatio: '2/3',
    year: 2026,
    featured: true,
    cover: true,
  },
  {
    slug: 'moons-edge',
    src: '/images/street/moons-edge-left.jpg',
    alt: "Alone at the Moon's Edge",
    title: "At Moon's Edge",
    series: 'Street',
    aspectRatio: '2/3',
    year: 2026,
    featured: true,
    cover: true,
  },
  {
    slug: 'cubed-panes',
    src: '/images/endless_pane/cubed-panes.jpg',
    alt: 'Merging of Skyscrapers',
    title: 'Cubed Panes',
    series: 'Endless Pane',
    aspectRatio: '2/3',
    year: 2026,
    featured: true,
    cover: true,
  },
  {
    slug: 'crimson-bridge-v2',
    src: '/images/street/crimson-bridge-v2.jpg',
    alt: "Crimson Bridge",
    title: "Crimson Bridge",
    series: 'Street',
    aspectRatio: '2/3',
    year: 2026,
    featured: true,
    cover: true,
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
  {
    slug: 'colors-of-cdmx-001-2025',
    src: '/images/architecture/1-DSCF5662.jpg',
    alt: 'Museo Casa Estudio Frida Kahlo',
    title: 'Colors of CDMX 001',
    series: 'Architecture',
    aspectRatio: '2/3',
    year: 2025,
  },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
export const getFeatured = () => photos.filter(p => p.featured)
export const getCover = () => photos.filter(p => p.cover)
export const getBySeries = (series: string) => photos.filter(p => p.series === series)