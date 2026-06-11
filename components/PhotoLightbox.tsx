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
        aria-label="Previous photo"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#1a1a1a',
        }}
      >
        <span style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.9)',
          boxShadow: '0 1px 12px rgba(0,0,0,0.12)',
          fontSize: '18px',
          lineHeight: 1,
        }}>
          ←
        </span>
      </button>

      {/* Next button */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="Next photo"
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#1a1a1a',
        }}
      >
        <span style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.9)',
          boxShadow: '0 1px 12px rgba(0,0,0,0.12)',
          fontSize: '18px',
          lineHeight: 1,
        }}>
          →
        </span>
      </button>

      {/* Close button — top right, always tappable */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        aria-label="Close"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.9)',
          boxShadow: '0 1px 12px rgba(0,0,0,0.12)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          color: '#1a1a1a',
        }}
      >
        ×
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
    </div>
  )
}
