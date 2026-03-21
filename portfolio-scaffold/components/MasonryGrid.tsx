import Image from 'next/image'
import type { Photo } from '@/content/photos'

interface MasonryGridProps {
  photos: Photo[]
  activeSeries?: string | null
}

export default function MasonryGrid({ photos, activeSeries }: MasonryGridProps) {
  const visible = activeSeries
    ? photos.filter(p => p.series === activeSeries)
    : photos

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-0.5 px-6">
      {visible.map((photo) => (
        <div
          key={photo.slug}
          className="group relative break-inside-avoid mb-0.5 overflow-hidden bg-surface cursor-pointer"
          style={{ aspectRatio: photo.aspectRatio }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Cinematic overlay */}
          <div className="photo-overlay">
            <p className="font-serif text-base italic text-paper leading-tight">
              {photo.title}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-gold mt-1">
              {photo.series}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
