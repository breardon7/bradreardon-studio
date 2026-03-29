import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { photos, SERIES } from '@/content/photos'
import { seriesConfig } from '@/content/series'

export const metadata: Metadata = {
  title: 'Brad Reardon — Photography',
}

const visibleSeries = SERIES.filter(s => seriesConfig[s]?.visible !== false)

const covers = visibleSeries.map(series => ({
  series,
  photo: photos.find(p => p.series === series && p.cover) ?? photos.find(p => p.series === series),
})).filter(c => c.photo)

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1">

      {/* ── Series cover grid ── */}
      <div className="w-full flex justify-center">
        <div
          className="grid grid-cols-2 md:grid-cols-3"
          style={{ gap: '2px', maxWidth: '1700px', width: '100%' }}
        >
          {covers.map(({ series, photo }, i) => {
            if (!photo) return null
            const tall = i % 3 === 1
            return (
              <Link
                key={series}
                href={`/gallery?series=${encodeURIComponent(series)}`}
                className="group relative overflow-hidden block"
                style={{ aspectRatio: tall ? '3/4' : '4/5', backgroundColor: '#f5f5f5' }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 280px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  priority={i < 3}
                />
                <div
                  className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)' }}
                >
                  <p className="text-[10px] tracking-[.2em] uppercase text-white" style={{ fontWeight: 300 }}>
                    {series}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── View all link ── */}
      <div className="px-9 py-8 border-t" style={{ borderColor: '#e5e5e5' }}>
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
