export interface SeriesConfig {
  visible: boolean
}

export const seriesConfig: Record<string, SeriesConfig> = {
  'Architecture': { visible: true },
  'Urban Extracts': { visible: true },
  'Street': { visible: true },
  'Endless Pane': { visible: true },
  'Around the Corner': { visible: true },
  'Still Life': { visible: true },
  'Clasped': { visible: true },
  'Self-Portraits': { visible: false },
  'Abstract': { visible: false },
}

export function getVisibleSeries(): string[] {
  return Object.entries(seriesConfig)
    .filter(([, v]) => v.visible)
    .map(([k]) => k)
}

// Slugs of featured photos in homepage display order
export const featuredOrder: string[] = [
  'colors-of-cdmx-002-2025',
  'colors-of-cdmx-001-2025',
  'colors-of-cdmx-003-2025',
  'the-path-2026',
  'pigeon-holed-2026',
  'barbed-2026',
  'clasped-001-2026',
  'clasped-002-2026',
  'clasped-003-2026',
  'atc-004-2025',
  'atc-007-2026',
  'atc-005-2025',
  'moons-edge',
  'crimson-bridge-2026',
  'cycling-001-2025',
  'urban-crown-shyness',
  'drops-from-above-2025',
  'alwyn-court-2025',
  'the-o-2026',
  'still-life-001-2026',
  'reflect-amouge-2026',
  'ep-001-2025',
  'ep-002-2026',
  'ep-005-2026',
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
    'silv-2026',
    'atc-004-2025',
    'atc-007-2026',
    'atc-001-2025',
    'atc-002-2025',
    'atc-007-2025',
    'atc-003-2025',
    'atc-006-2025',
  ],
  'Clasped': [
    'clasped-001-2026',
    'clasped-002-2026',
    'clasped-003-2026',
  ],
  'Still Life': [
    'still-life-001-2026',
    'still-life-002-2025',
    'still-life-003-2025',
    'reflect-amouge-2026',
    'the-o-2026',
    'anua-pomegranate-2026',
    'still-life-004-2026',
    'still-life-005-2026',
    'still-life-006-2026',
  ],
  'Street': [
    'pensive-2025',
    'witness-2025',
    'flow-2025',
    'trapped-2025',
    'ponder-2025',
    'the-transition-2024',
    'fading-2026',
    'now-is-now-2025',
    'fated-2025',
    'analog-slog-2025',
    'reflections-2026',
    'peaking-into-their-future-2025',
  ],
}
