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
    <header className="flex-shrink-0 border-b" style={{ borderColor: '#e5e5e5', backgroundColor: '#ffffff' }}>
      <nav className="px-9 h-[80px] flex items-baseline justify-between pt-[32px]">

        {/* Wordmark */}
        <Link
          href="/"
          className="font-serif text-[22px] tracking-[.01em] transition-colors duration-200"
          style={{ color: '#1a1a1a' }}
        >
          BRAD REARDON
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-baseline gap-10 list-none">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-[13px] uppercase tracking-[.22em] pb-[3px] border-b transition-colors duration-200"
                style={{
                  color: pathname === href ? '#1a1a1a' : '#666',
                  borderBottomColor: pathname === href ? '#1a1a1a' : 'transparent',
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden transition-colors p-1"
          style={{ color: '#666' }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-[5px]">
            <span className={"block h-px bg-current transition-all duration-200 " + (open ? 'rotate-45 translate-y-[6px]' : '')} />
            <span className={"block h-px bg-current transition-all duration-200 " + (open ? 'opacity-0' : '')} />
            <span className={"block h-px bg-current transition-all duration-200 " + (open ? '-rotate-45 -translate-y-[6px]' : '')} />
          </div>
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t py-5 px-9" style={{ borderColor: '#e5e5e5' }}>
          <ul className="flex flex-col gap-5 list-none">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="text-[13px] uppercase tracking-[.22em] transition-colors duration-200"
                  style={{ color: pathname === href ? '#1a1a1a' : '#666' }}
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
