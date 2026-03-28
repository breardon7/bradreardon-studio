import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
}

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-12 py-24 text-center">
      <div className="flex flex-col gap-6">
        <p className="text-[20px] leading-[1.85] text-muted whitespace-nowrap">
          Available to work.
        </p>
        <div>
          <p className="text-[15px] tracking-[.22em] uppercase text-dim mb-3">
            Contact
          </p>
          <a href="mailto:bradreardonstudio@gmail.com" className="text-[20px] text-muted hover:text-white transition-colors duration-200">brad@bradreardon.studio</a>
        </div>
      </div>
    </div>
  )
}