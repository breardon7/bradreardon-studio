export interface PrintSize {
  label: string
  price: number
  edition?: number
  available: boolean
}

export interface PrintListing {
  slug: string
  visible: boolean
  priceLine: string
  medium: string
  paper: string
  finish: string
  notes: string
  sizes: PrintSize[]
}

export const prints: PrintListing[] = [
  {
    slug: 'colors-of-cdmx-002-2025',
    visible: true,
    priceLine: '',
    medium: '',
    paper: '',
    finish: '',
    notes: '',
    sizes: [

    ],
  },
  {
    slug: 'colors-of-cdmx-001-2025',
    visible: true,
    priceLine: '',
    medium: '',
    paper: '',
    finish: '',
    notes: '',
    sizes: [

    ],
  },
  {
    slug: 'colors-of-cdmx-003-2025',
    visible: true,
    priceLine: '',
    medium: '',
    paper: '',
    finish: '',
    notes: '',
    sizes: [

    ],
  },
  {
    slug: 'clasped-001-2026',
    visible: true,
    priceLine: '',
    medium: '',
    paper: '',
    finish: '',
    notes: '',
    sizes: [

    ],
  },
  {
    slug: 'moons-edge',
    visible: true,
    priceLine: '',
    medium: '',
    paper: '',
    finish: '',
    notes: '',
    sizes: [

    ],
  },
  {
    slug: 'still-life-001-2026',
    visible: true,
    priceLine: '',
    medium: '',
    paper: '',
    finish: '',
    notes: '',
    sizes: [

    ],
  },
  {
    slug: 'atc-004-2025',
    visible: true,
    priceLine: '',
    medium: '',
    paper: '',
    finish: '',
    notes: '',
    sizes: [

    ],
  },
  {
    slug: 'urban-crown-shyness',
    visible: true,
    priceLine: '',
    medium: '',
    paper: '',
    finish: '',
    notes: '',
    sizes: [

    ],
  },
  {
    slug: 'atc-005-2025',
    visible: true,
    priceLine: '',
    medium: '',
    paper: '',
    finish: '',
    notes: '',
    sizes: [

    ],
  },
  {
    slug: 'panning-cyclist-2025',
    visible: false,
    priceLine: '',
    medium: '',
    paper: '',
    finish: '',
    notes: '',
    sizes: [

    ],
  },
  {
    slug: 'crimson-bridge-2026',
    visible: false,
    priceLine: '',
    medium: '',
    paper: '',
    finish: '',
    notes: '',
    sizes: [

    ],
  }
]
