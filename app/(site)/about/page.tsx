import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <div className="grid flex-1" style={{ gridTemplateColumns: '1fr 1px 1fr' }}>

      {/* ── Left: portrait placeholder ── */}
      {/* Replace the div below with an <Image> once you have a photo */}
      <div className="relative min-h-[520px] bg-gradient-to-br from-bg3 to-bg overflow-hidden">
        {/* <Image src="/images/about/portrait.jpg" alt="Brad Reardon" fill className="object-cover" /> */}
        <p className="absolute bottom-5 left-5 text-[8px] tracking-[.18em] uppercase text-muted opacity-70">
          New York, 2024
        </p>
      </div>

      {/* ── Divider ── */}
      <div className="bg-edge" />

      {/* ── Right: text ── */}
      <div className="flex flex-col justify-between px-12 py-11">
        <div>
          <p className="text-[8px] tracking-[.22em] uppercase text-dim mb-4">
            Photographer — New York City
          </p>
          <h1 className="font-serif text-[26px] font-normal leading-[1.2] tracking-[-0.01em] text-white">
            Drawn to structures<br />that resist <em>easy</em> reading.
          </h1>
          <p className="text-[12px] leading-[1.85] text-muted mt-5 max-w-[40ch]">
            I work across architecture, street, still life, and abstract — interested
            in light that complicates rather than flatters, and forms that ask to be
            looked at more than once.
          </p>
          <p className="text-[12px] leading-[1.85] text-muted mt-3 max-w-[40ch]">
            Currently moving toward portrait and editorial work in fashion and
            high-end interiors. Available to work.
          </p>

          <div className="w-5 h-px bg-edge my-6" />

          <dl className="flex flex-col gap-[9px]">
            {[
              ['Equipment', 'Sony A7 IV · 35mm f/1.4 · occasional medium format'],
              ['Process',   'Digital capture, analog-informed post-processing'],
              ['Prints',    'Archival giclée, signed and numbered, certificate of authenticity'],
              ['Available', 'Editorial, commercial, architectural, brand and product work'],
            ].map(([label, value]) => (
              <div key={label} className="text-[10px] leading-[1.5] text-dim">
                <span className="text-muted font-normal tracking-[.04em]">{label}</span>
                {'  '}{value}
              </div>
            ))}
          </dl>
        </div>

        <div className="flex justify-between items-end pt-7 border-t border-edge">
          <Link
            href="/contact"
            className="text-[9px] tracking-[.18em] uppercase text-muted
                       hover:text-white transition-colors duration-200"
          >
            Get in touch →
          </Link>
          <span className="text-[8px] tracking-[.14em] text-dim">New York City</span>
        </div>
      </div>

    </div>
  )
}
