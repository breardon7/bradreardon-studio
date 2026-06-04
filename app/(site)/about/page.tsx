import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 px-12 py-24">
      <div
        className="mx-auto w-full"
        style={{ maxWidth: '960px' }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: '2fr 3fr',
            gap: '80px',
            alignItems: 'start',
          }}
        >
          {/* Portrait */}
          <div className="relative w-full" style={{ aspectRatio: '2/3' }}>
            <Image
              src="/images/about/portrait.jpg"
              alt="Brad Reardon"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Text */}
          <div
            className="flex flex-col"
            style={{ paddingTop: '8px', gap: '40px' }}
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
                Brad Reardon is a photographer based in New York City.
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
    </div>
  )
}
