import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { photos } from '@/content/photos'
import { prints } from '@/content/prints'

export const metadata: Metadata = {
  title: 'Shop — Brad Reardon',
}

const photoMap = Object.fromEntries(photos.map(p => [p.slug, p]))

const visiblePrints = prints
  .filter(p => p.visible)
  .map(p => ({ listing: p, photo: photoMap[p.slug] }))
  .filter(p => p.photo)

function formatPrice(cents: number): string {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })
}

function lowestPrice(sizes: { price: number; available: boolean }[]): number | null {
  const available = sizes.filter(s => s.available)
  if (!available.length) return null
  return Math.min(...available.map(s => s.price))
}

export default function ShopPage() {
  if (visiblePrints.length === 0) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center">
        <p className="text-[13px] tracking-[.2em] uppercase" style={{ color: '#999' }}>
          No prints available yet
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 py-16 px-9">

        {/* header */}
        <div className="mx-auto mb-16" style={{ maxWidth: '960px' }}>
          <h1
            className="font-serif"
            style={{ fontSize: '13px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#999', fontWeight: 400 }}
          >
            Prints
          </h1>
        </div>

        {/* grid */}
        <div
          className="grid mx-auto"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px 24px', maxWidth: '960px' }}
        >
          {visiblePrints.map(({ listing, photo }) => {
            const price = lowestPrice(listing.sizes)
            return (
              <Link
                key={listing.slug}
                href={'/shop/' + listing.slug}
                className="group block"
                style={{ textDecoration: 'none' }}
              >
                {/* image */}
                <div
                  className="relative overflow-hidden mb-5"
                  style={{ aspectRatio: photo.aspectRatio, backgroundColor: '#f5f5f5' }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>

                {/* meta */}
                <div>
                  <p
                    className="font-serif"
                    style={{ fontSize: '15px', color: '#1a1a1a', marginBottom: '4px', fontStyle: 'italic' }}
                  >
                    {photo.title}
                  </p>
                  <p style={{ fontSize: '11px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#999' }}>
                    {photo.series} · {photo.year}
                  </p>
                  {(listing.priceLine || price !== null) && (
                    <p style={{ fontSize: '12px', letterSpacing: '.08em', color: '#1a1a1a', marginTop: '8px' }}>
                      {listing.priceLine || ('From ' + formatPrice(price!))}
                    </p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </div>
  )
}
