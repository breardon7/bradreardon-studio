import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-12 py-24 text-center">
      <div className="flex flex-col gap-6">
        <p className="text-[20px] leading-[1.85] text-muted whitespace-nowrap">
          Brad Reardon is a photographer based in New York City.
        </p>
        <div>
          <p className="text-[15px] tracking-[.22em] uppercase text-dim mb-3">
            Inquiries
          </p>
          <a href="mailto:brad@bradreardon.studio" className="text-[20px] text-muted hover:text-white transition-colors duration-200">brad@bradreardon.studio</a>
        </div>
      </div>
    </div>
  )
}