'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { Photo } from '@/content/photos'

interface Props {
  photos: Photo[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function PhotoLightbox({ photos, currentIndex, onClose, onPrev, onNext }: Props) {
  const photo = photos[currentIndex]

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft') onPrev()
    if (e.key === 'ArrowRight') onNext()
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(255,255,255,0.97)' }}
      onClick={onClose}
    >
      {/* Image container */}
      <div
        className="relative"
        style={{ maxWidth: '90vw', maxHeight: '90vh', width: '100%', height: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="90vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Prev button */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        className="fixed left-6 top-1/2 -translate-y-1/2 text-[11px] tracking-[.2em] uppercase transition-colors duration-200"
        style={{ color: '#999' }}
      >
        ←
      </button>

      {/* Next button */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext() }}
        className="fixed right-6 top-1/2 -translate-y-1/2 text-[11px] tracking-[.2em] uppercase transition-colors duration-200"
        style={{ color: '#999' }}
      >
        →
      </button>

      {/* Caption */}
      <div className="fixed bottom-8 left-9">
        <p className="font-serif italic text-[13px]" style={{ color: '#1a1a1a' }}>
          {photo.title}
        </p>
        <p className="text-[10px] tracking-[.18em] uppercase mt-1" style={{ color: '#999' }}>
          {photo.series} · {photo.year}
        </p>
      </div>

      {/* Counter */}
      <div className="fixed bottom-8 right-9">
        <p className="text-[10px] tracking-[.18em]" style={{ color: '#ccc' }}>
          {currentIndex + 1} / {photos.length}
        </p>
      </div>

      {/* Close hint */}
      <div className="fixed top-8 right-9">
        <p className="text-[10px] tracking-[.18em] uppercase" style={{ color: '#ccc' }}>
          Esc to close
        </p>
      </div>
    </div>
  )
}