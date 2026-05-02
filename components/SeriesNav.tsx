'use client'

import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { SERIES } from '@/content/photos'
import { seriesConfig } from '@/content/series'

const visibleSeries = SERIES.filter(s => seriesConfig[s]?.visible !== false)

export default function SeriesNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const isGallery = pathname === '/gallery'
  const activeSeries = searchParams.get('series') ?? ''

  function handleClick(series: string) {
    router.push('/gallery?series=' + encodeURIComponent(series))
  }

  return (
    <div
      className="flex-shrink-0 sticky z-40 bg-white border-b"
      style={{ borderColor: '#e5e5e5', top: '80px' }}
    >
      {/* Horizontal scroll container — fades out on the right on mobile */}
      <div
        className="relative"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
          maskImage: 'linear-gradient(to right, black 85%, transparent 100%)',
        }}
      >
        <ul
          className="flex list-none overflow-x-auto px-6 md:px-9"
          style={{
            scrollbarWidth: 'none',       /* Firefox */
            msOverflowStyle: 'none',      /* IE */
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {visibleSeries.map(series => {
            const isActive = isGallery && activeSeries === series
            return (
              <li key={series} className="flex-shrink-0">
                <button
                  onClick={() => handleClick(series)}
                  className="text-[12px] tracking-[.16em] uppercase pb-[10px] pt-[10px] px-3 md:px-4 first:pl-0 border-b-2 -mb-px transition-colors duration-200 cursor-pointer whitespace-nowrap"
                  style={{
                    color: isActive ? '#1a1a1a' : '#999',
                    borderBottomColor: isActive ? '#1a1a1a' : 'transparent',
                  }}
                >
                  {series}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
