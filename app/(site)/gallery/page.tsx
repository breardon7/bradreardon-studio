'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { photos, SERIES } from '@/content/photos'
import { seriesConfig } from '@/content/series'
import type { Photo } from '@/content/photos'
import PhotoLightbox from '@/components/PhotoLightbox'

const ALL = 'All'
const visibleSeries = SERIES.filter(s => seriesConfig[s]?.visible !== false)
const tabs = [ALL, ...visibleSeries]

export default function GalleryPage() {
  const searchParams = useSearchParams()
  const [active, setActive] = useState<string>(ALL)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    const s = searchParams.get('series')
    if (s && (visibleSeries as readonly string[]).includes(s)) setActive(s)
  }, [searchParams])

  const visiblePhotos: Photo[] = active === ALL
    ? photos.filter(p => seriesConfig[p.series]?.visible !== false)
    : photos.filter(p => p.series === active)

  const handlePrev = useCallback(() => {
    setLightboxIndex(i => i !== null ? (i - 1 + visiblePhotos.length) % visiblePhotos.length : null)
  }, [visiblePhotos.length])

  const handleNext = useCallback(() => {
    setLightboxIndex(i => i !== null ? (i + 1) % visiblePhotos.length : null)
  }, [visiblePhotos.length])

  return (
    <div className="flex flex-col flex-1">

      {/* ── Series tabs ── */}
      <div className="flex items-baseline border-b px-9 flex-shrink-0" style={{ borderColor: '#e5e5e5' }}>
        <ul className="flex list-none">
          {tabs.map(tab => (
            <li key={tab}>
              <button
                onClick={() => setActive(tab)}
                className="text-[12px] tracking-[.16em] uppercase pb-[10px] px-4 first:pl-0 border-b-2 -mb-px transition-colors duration-200 cursor-pointer"
                style={{
                  color: active === tab ? '#1a1a1a' : '#999',
                  borderBottomColor: active === tab ? '#1a1a1a' : 'transparent',
                }}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
        <span className="ml-auto text-[11px] tracking-[.1em] pb-[10px]" style={{ color: '#ccc' }}>
          {visiblePhotos.length} images
        </span>
      </div>

      {/* ── Photo grid ── */}
      <div className="flex-1 py-12 px-9">
        <div
          className="grid mx-auto"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            maxWidth: '960px',
          }}
        >
          {visiblePhotos.map((photo, i) => (
            <div
              key={photo.slug}
              className="group relative overflow-hidden cursor-pointer"
              style={{ aspectRatio: photo.aspectRatio, backgroundColor: '#f5f5f5' }}
              onClick={() => setLightboxIndex(i)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, 320px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-[14px]"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}
              >
                <p className="font-serif italic text-[11px] text-white">{photo.title}</p>
                <p className="text-[11px] tracking-[.16em] uppercase mt-[3px] text-white opacity-70">
                  {photo.series} · {photo.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={visiblePhotos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}

    </div>
  )
}
