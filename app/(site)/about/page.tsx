import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1">
      <div
        className="flex flex-col flex-1"
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 3fr',
        }}
      >
        {/* Portrait — fills full left column height */}
        <div className="relative" style={{ minHeight: '600px' }}>
          <Image
            src="/images/about/portrait.jpg"
            alt="Brad Reardon"
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Text — centered vertically */}
        <div
          className="flex flex-col justify-center"
          style={{ padding: '80px 80px 80px 80px', gap: '40px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p
              className="font-serif"
              style={{
                fontSize: '11px',
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: '#999',
              }}
            >
              Brad Reardon
            </p>
            <p
              style={{
                fontSize: '18px',
                lineHeight: '1.85',
                color: '#1a1a1a',
                fontWeight: 300,
              }}
            >
              Photographer based in New York City.
            </p>
            <p
              style={{
                fontSize: '15px',
                lineHeight: '1.85',
                color: '#999',
                fontWeight: 300,
              }}
            >
              Available for editorial, brand, and commercial commissions.
            </p>
          </div>

          <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '32px' }}>
            <p
              style={{
                fontSize: '11px',
                letterSpacing: '.22em',
                textTransform: 'uppercase',
                color: '#999',
                marginBottom: '12px',
              }}
            >
              Inquiries
            </p>
            <a
              href="mailto:brad@bradreardon.studio"
              style={{
                fontSize: '15px',
                color: '#1a1a1a',
                textDecoration: 'none',
                letterSpacing: '.04em',
              }}
            >
              brad@bradreardon.studio
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
