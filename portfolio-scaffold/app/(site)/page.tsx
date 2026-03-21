import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { photos, SERIES } from '@/content/photos'

export const metadata: Metadata = {
  title: 'Brad Reardon — Photography',
}

const seriesCounts = SERIES.map((s, i) => ({
  num: String(i + 1).padStart(2, '0'),
  name: s,
  count: photos.filter(p => p.series === s).length,
}))

// Four featured thumbnails for the bottom-right strip
const featured = photos.filter(p => p.featured).slice(0, 4)

export default function HomePage() {
  return (
    <div className="flex flex-col justify-between flex-1 px-9 pb-7 pt-0">

      {/* ── Large name — vertically centred ── */}
      <div className="flex-1 flex items-center py-10">
        <div>
          <h1 className="font-serif text-[clamp(48px,8vw,72px)] font-normal leading-[.92] tracking-[-0.03em] text-white">
            Brad<br /><em>Reardon</em>
          </h1>
          <p className="mt-5 text-[9px] tracking-[.24em] uppercase text-muted flex items-center gap-3">
            <span className="inline-block w-[18px] h-px bg-muted" />
            Photography — New York
          </p>
        </div>
      </div>

      {/* ── Bottom row: series index left, thumbnails right ── */}
      <div className="flex justify-between items-end gap-8">

        {/* Series index */}
        <div className="flex flex-col">
          {seriesCounts.map(({ num, name, count }) => (
            <Link
              key={name}
              href={`/work?series=${encodeURIComponent(name)}`}
              className="group flex items-baseline gap-3 py-[9px] border-b border-edge
                         first:border-t hover:border-muted transition-colors duration-200"
            >
              <span className="text-[8px] tracking-[.12em] text-dim w-[18px] flex-shrink-0">
                {num}
              </span>
              <span className="text-[10px] tracking-[.12em] uppercase text-muted
                               group-hover:text-white transition-colors duration-200 min-w-[110px]">
                {name}
              </span>
              <span className="text-[8px] tracking-[.1em] text-dim ml-auto">
                {count} images
              </span>
            </Link>
          ))}
          <p className="mt-4 text-[8px] tracking-[.16em] uppercase text-dim">
            New York City · © {new Date().getFullYear()}
          </p>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-[3px] items-end flex-shrink-0">
          {featured.map((photo, i) => {
            const heights = [76, 90, 68, 80]
            const h = heights[i] ?? 76
            return (
              <Link
                key={photo.slug}
                href="/work"
                className="overflow-hidden opacity-40 hover:opacity-90 transition-opacity duration-400"
                style={{ width: 58, height: h }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={58}
                  height={h}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                />
              </Link>
            )
          })}
        </div>

      </div>
    </div>
  )
}
