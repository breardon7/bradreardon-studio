import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // ── Cinematic dark palette ─────────────────────────────────────────
      colors: {
        // ── Core ground ───────────────────────────────────────────────
        bg:      '#0e0e0c',   // body background — near-black
        bg2:     '#131311',   // nav, raised surfaces
        bg3:     '#181816',   // cards
        edge:    '#222220',   // borders, dividers, grid gaps
        // ── Text scale ────────────────────────────────────────────────
        white:   '#f0ede8',   // headings, active nav, name
        text:    '#ccc9c2',   // body text
        muted:   '#5e5c58',   // secondary text, inactive nav
        dim:     '#3a3836',   // tertiary — counts, captions
        faint:   '#2e2e2c',   // nearly invisible — structural
      },
      // ── Typography ────────────────────────────────────────────────────
      fontFamily: {
        sans:  ['var(--font-jost)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-baskerville)', 'Georgia', 'serif'],
        mono:  ['Courier New', 'monospace'],
      },
      // ── Spacing extras ────────────────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '120': '30rem',
      },
      // ── Aspect ratios for photo cards ─────────────────────────────────
      aspectRatio: {
        '3/4':  '3 / 4',
        '4/5':  '4 / 5',
        '2/3':  '2 / 3',
        '5/4':  '5 / 4',
        'wide': '16 / 9',
      },
      // ── Transitions ───────────────────────────────────────────────────
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
      // ── Letter spacing ────────────────────────────────────────────────
      letterSpacing: {
        'display':  '-.01em',
        'widest2':  '.2em',
        'widest3':  '.3em',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
