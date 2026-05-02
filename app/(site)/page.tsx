import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { photos } from '@/content/photos'
import { featuredOrder } from '@/content/series'

export const metadata: Metadata = {
  title: 'Brad Reardon — Photography',
}

const photoMap = Object.fromEntries(photos.map(p => [p.slug, p]))

const homepagePhotos = (() => {
  const seen = new Set<string>()
  const result = []
  for (const slug of featuredOrder) {
    if (photoMap[slug] && !seen.has(slug) && !photoMap[slug].hidden) {
      seen.add(slug)
      result.push(photoMap[slug])
    }
  }
  for (const p of photos) {
    if (p.featured && !p.hidden && !seen.has(p.slug)) {
      seen.add(p.slug)
      result.push(p)
    }
  }
  return result
})()

function parseRatio(ratio: string): number {
  if (!ratio) return 1
  const parts = ratio.split('/')
  if (parts.length === 2) return parseFloat(parts[0]) / parseFloat(parts[1])
  return parseFloat(ratio) || 1
}

const COL_WIDTH = 467
const ROW_UNIT = 4

function getSpan(aspectRatio: string): number {
  const ratio = parseRatio(aspectRatio)
  const heightPx = COL_WIDTH / ratio
  return Math.ceil(heightPx / ROW_UNIT)
}

export default function HomePage() {
  if (homepagePhotos.length === 0) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <p className="text-[13px] tracking-[.2em] uppercase" style={{ color: '#999' }}>
          No featured photos yet
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">

      {/* ── Mobile grid (1 column, no span logic) ── */}
      <div className="md:hidden flex flex-col" style={{ gap: '2px' }}>
        {homepagePhotos.map((photo, i) => (
          <Link
            key={photo.slug}
            href={`/gallery?series=${encodeURIComponent(photo.series)}`}
            className="group relative overflow-hidden block"
            style={{ backgroundColor: '#f5f5f5' }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={800}
              height={0}
              sizes="100vw"
              className="w-full h-auto block"
              priority={i < 3}
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
            <div
              className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }}
            >
              <p className="text-[10px] tracking-[.2em] uppercase text-white" style={{ fontWeight: 300 }}>
                {photo.series}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Desktop masonry grid (3 columns, span logic) ── */}
      <div className="hidden md:flex" style={{ justifyContent: 'center' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridAutoRows: ROW_UNIT + 'px',
            columnGap: '2px',
            rowGap: '0px',
            width: '100%',
            maxWidth: '1400px',
          }}
        >
          {homepagePhotos.map((photo, i) => {
            const span = getSpan(photo.aspectRatio)
            return (
              <Link
                key={photo.slug}
                href={`/gallery?series=${encodeURIComponent(photo.series)}`}
                className="group relative overflow-hidden block"
                style={{
                  gridRow: 'span ' + span,
                  marginBottom: '2px',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={800}
                  height={0}
                  sizes="467px"
                  className="w-full h-auto block"
                  priority={i < 4}
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
                <div
                  className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }}
                >
                  <p className="text-[10px] tracking-[.2em] uppercase text-white" style={{ fontWeight: 300 }}>
                    {photo.series}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── View all link ── */}
      <div className="px-6 md:px-9 py-8 border-t" style={{ borderColor: '#e5e5e5' }}>
        <Link
          href="/gallery"
          className="text-[9px] tracking-[.2em] uppercase transition-colors duration-200"
          style={{ color: '#999' }}
        >
          View all work →
        </Link>
      </div>

    </div>
  )
}
