'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/gallery', label: 'Work' },
  { href: '/about',   label: 'About' },
  { href: '/shop',    label: 'Shop' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="flex-shrink-0 border-b border-edge bg-bg2">
      <nav className="px-9 h-[57px] flex items-baseline justify-between pt-[22px]">

        {/* Wordmark */}
        <Link
          href="/"
          className="font-serif text-[13px] text-white tracking-[.01em]
                     hover:text-text transition-colors duration-200"
        >
          Brad <em>Reardon.</em>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-baseline gap-7 list-none">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={[
                  'text-[9px] uppercase tracking-[.18em] pb-[3px] border-b',
                  'transition-colors duration-200',
                  pathname === href
                    ? 'text-white border-white'
                    : 'text-muted border-transparent hover:text-white hover:border-white',
                ].join(' ')}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-muted hover:text-white transition-colors p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-[5px]">
            <span className={`block h-px bg-current transition-all duration-200
                             ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block h-px bg-current transition-all duration-200
                             ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-px bg-current transition-all duration-200
                             ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-edge py-5 px-9">
          <ul className="flex flex-col gap-5 list-none">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={[
                    'text-[9px] uppercase tracking-[.18em]',
                    pathname === href ? 'text-white' : 'text-muted',
                  ].join(' ')}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
