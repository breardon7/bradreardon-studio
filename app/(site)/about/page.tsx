import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center py-16 px-9">
      <div className="mx-auto w-full" style={{ maxWidth: '860px' }}>

        {/* Desktop: two columns. Mobile: stacked */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 340px) 1fr',
            gap: '72px',
            alignItems: 'center',
          }}
          className="about-grid"
        >

          {/* Portrait — contained, not touching edges */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3/4',
            }}
          >
            <Image
              src="/images/about/portrait.jpg"
              alt="Brad Reardon"
              fill
              className="object-cover object-top"
              priority
            />
          </div>

          {/* Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              <p style={{ fontSize: '17px', lineHeight: '1.9', color: '#1a1a1a', fontWeight: 300 }}>
                Photographer based in New York City.
              </p>
              <p style={{ fontSize: '14px', lineHeight: '1.9', color: '#999', fontWeight: 300 }}>
                Working across architecture, street, still life, and portraiture.
                <br />
                Available for editorial, brand, and commercial commissions.
              </p>
            </div>
            <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '28px' }}>
              <p style={{ fontSize: '11px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#999', marginBottom: '10px' }}>
                Inquiries
              </p>
              <a
                href="mailto:brad@bradreardon.studio"
                style={{ fontSize: '14px', color: '#1a1a1a', textDecoration: 'none', letterSpacing: '.04em' }}
              >
                brad@bradreardon.studio
              </a>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .about-grid > div:first-child {
            max-width: 260px;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  )
}
