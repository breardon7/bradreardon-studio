export interface SeriesConfig {
  visible: boolean
}

export const seriesConfig: Record<string, SeriesConfig> = {
  'Architecture': { visible: true },
  'Street': { visible: true },
  'Endless Pane': { visible: true },
  'Still Life': { visible: true },
  'Abstract': { visible: true },
  'Around the Corner': { visible: true },
  'Clasped': { visible: true },
  'Self-Portraits': { visible: true },
}

export function getVisibleSeries(): string[] {
  return Object.entries(seriesConfig)
    .filter(([, v]) => v.visible)
    .map(([k]) => k)
}

// Slugs of featured photos in homepage display order
export const featuredOrder: string[] = [
  'colors-of-cdmx-001-2025',
  'colors-of-cdmx-002-2025',
  'colors-of-cdmx-003-2025',
  'clasped-001-2026',
  'clasped-002-2026',
  'clasped-003-2026',
  'atc-004-2025',
  'atc-007-2026',
  'atc-005-2025',
  'moons-edge',
  'crimson-bridge-2026',
  'panning-cyclist-2025',
  'urban-crown-shyness',
  'alwyn-court-2025',
  'drops-from-above-2025',
  'budapest-001-2025',
  'sp002-2025',
  'still-life-001-2026',
]

// Per-series photo display order
export const seriesOrder: Record<string, string[]> = {
  'Architecture': [
    'colors-of-cdmx-001-2025',
    'colors-of-cdmx-002-2025',
    'colors-of-cdmx-003-2025',
    'urban-crown-shyness',
  ],
  'Endless Pane': [
    'endless-pane-003-2025',
    'endless-pane-002-2025',
    'endless-pain-001-2025',
    'endless-pane-005-2026',
    'endless-pane-004-2026',
    'endless-pane-006-2026',
  ],
  'Around the Corner': [
    'atc-005-2025',
    'atc-002-2025',
    'atc-004-2025',
    'atc-001-2025',
    'atc-007-2026',
    'atc-007-2025',
    'atc-006-2025',
    'atc-003-2025',
  ],
  'Clasped': [
    'clasped-001-2026',
    'clasped-002-2026',
    'clasped-003-2026',
  ],
}
