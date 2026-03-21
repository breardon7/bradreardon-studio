'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { photos, SERIES } from '@/content/photos'
import type { Photo } from '@/content/photos'

const ALL = 'All'
const tabs = [ALL, ...SERIES]

export default function WorkPage() {
  const searchParams = useSearchParams()
  const [active, setActive] = useState<string>(ALL)

  // Allow deep-linking from homepage series index rows
  useEffect(() => {
    const s = searchParams.get('series')
    if (s && (SERIES as readonly string[]).includes(s)) setActive(s)
  }, [searchParams])

  const visible: Photo[] = active === ALL
    ? photos
    : photos.filter(p => p.series === active)

  return (
    <div className="flex flex-col flex-1">

      {/* ── Series tabs ── */}
      <div className="flex items-baseline border-b border-edge px-9 flex-shrink-0">
        <ul className="flex list-none">
          {tabs.map(tab => (
            <li key={tab}>
              <button
                onClick={() => setActive(tab)}
                className={[
                  'text-[9px] tracking-[.16em] uppercase pb-[10px] px-4 first:pl-0',
                  'border-b-2 -mb-px transition-colors duration-200 cursor-pointer',
                  active === tab
                    ? 'text-white border-white'
                    : 'text-muted border-transparent hover:text-white hover:border-white',
                ].join(' ')}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
        <span className="ml-auto text-[8px] tracking-[.1em] text-dim pb-[10px]">
          {visible.length} images
        </span>
      </div>

      {/* ── Photo grid ── */}
      <div
        className="grid gap-[2px] bg-edge flex-1"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
      >
        {visible.map(photo => (
          <div
            key={photo.slug}
            className="group relative overflow-hidden bg-bg2 cursor-pointer"
            style={{ aspectRatio: photo.aspectRatio }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700
                         group-hover:scale-[1.04]"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                            transition-opacity duration-300 flex flex-col justify-end p-[14px]
                            bg-gradient-to-t from-bg/80 to-transparent">
              <p className="font-serif italic text-[11px] text-white">{photo.title}</p>
              <p className="text-[8px] tracking-[.16em] uppercase text-muted mt-[3px]">
                {photo.series} · {photo.year}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
