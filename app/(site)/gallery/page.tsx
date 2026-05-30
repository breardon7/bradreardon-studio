'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { photos, SERIES } from '@/content/photos'
import { seriesConfig, seriesOrder } from '@/content/series'
import type { Photo } from '@/content/photos'
import PhotoLightbox from '@/components/PhotoLightbox'

const visibleSeries = SERIES.filter(s => seriesConfig[s]?.visible !== false)

interface MediaItem extends Photo {
  vimeoUrl?: string
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return match ? match[1] : null
}

function getOrderedPhotos(seriesName: string, allPhotos: MediaItem[]): MediaItem[] {
  const order = seriesOrder[seriesName]
  if (!order || order.length === 0) return allPhotos
  const photoMap = Object.fromEntries(allPhotos.map(p => [p.slug, p]))
  const ordered: MediaItem[] = []
  const seen = new Set<string>()
  for (const slug of order) {
    if (photoMap[slug]) { ordered.push(photoMap[slug]); seen.add(slug) }
  }
  for (const p of allPhotos) { if (!seen.has(p.slug)) ordered.push(p) }
  return ordered
}

function GalleryContent() {
  const searchParams = useSearchParams()
  const [active, setActive] = useState<string>(visibleSeries[0] ?? '')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    const s = searchParams.get('series')
    if (s && (visibleSeries as readonly string[]).includes(s)) setActive(s)
  }, [searchParams])

  const seriesPhotos = (photos as MediaItem[]).filter(p => p.series === active && !p.hidden)
  const visiblePhotos = getOrderedPhotos(active, seriesPhotos)
  const lightboxPhotos = visiblePhotos.filter(p => !p.vimeoUrl)

  const handlePrev = useCallback(() => {
    setLightboxIndex(i => i !== null ? (i - 1 + lightboxPhotos.length) % lightboxPhotos.length : null)
  }, [lightboxPhotos.length])

  const handleNext = useCallback(() => {
    setLightboxIndex(i => i !== null ? (i + 1) % lightboxPhotos.length : null)
  }, [lightboxPhotos.length])

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 py-12 px-9">
        <div
          className="grid mx-auto"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            maxWidth: '960px',
          }}
        >
          {visiblePhotos.map((item) => {
            const vimeoId = item.vimeoUrl ? getVimeoId(item.vimeoUrl) : null

            if (vimeoId) {
              return (
                <div
                  key={item.slug}
                  className="relative overflow-hidden"
                  style={{ aspectRatio: item.aspectRatio || '16/9', backgroundColor: '#f5f5f5' }}
                >
                  <iframe
                    src={'https://player.vimeo.com/video/' + vimeoId + '?title=0&byline=0&portrait=0&badge=0&dnt=1'}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={item.title}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 p-[14px] pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}
                  >
                    <p className="font-serif italic text-[11px] text-white">{item.title}</p>
                    <p className="text-[11px] tracking-[.16em] uppercase mt-[3px] text-white opacity-70">
                      {item.series} · {item.year}
                    </p>
                  </div>
                </div>
              )
            }

            const lightboxIdx = lightboxPhotos.findIndex(p => p.slug === item.slug)
            return (
              <div
                key={item.slug}
                className="group relative overflow-hidden cursor-pointer"
                style={{ aspectRatio: item.aspectRatio, backgroundColor: '#f5f5f5' }}
                onClick={() => lightboxIdx !== -1 && setLightboxIndex(lightboxIdx)}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-[14px]"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}
                >
                  <p className="font-serif italic text-[11px] text-white">{item.title}</p>
                  <p className="text-[11px] tracking-[.16em] uppercase mt-[3px] text-white opacity-70">
                    {item.series} · {item.year}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={lightboxPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  )
}

export default function GalleryPage() {
  return (
    <Suspense fallback={null}>
      <GalleryContent />
    </Suspense>
  )
}
