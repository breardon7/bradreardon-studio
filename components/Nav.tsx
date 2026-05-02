'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const links = [
  { href: '/gallery', label: 'Work' },
  { href: '/about',   label: 'About' },
  { href: '/shop',    label: 'Shop' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close drawer on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header
      className="flex-shrink-0 border-b sticky top-0 z-50"
      style={{ borderColor: '#e5e5e5', backgroundColor: '#ffffff' }}
    >
      <nav className="px-6 md:px-9 h-[80px] flex items-center justify-between">

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
          style={{ color: '#1a1a1a' }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <div className="w-5 flex flex-col gap-[5px]">
            <span
              className="block h-px bg-current transition-all duration-300 origin-center"
              style={{ transform: open ? 'translateY(6px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block h-px bg-current transition-all duration-300"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              className="block h-px bg-current transition-all duration-300 origin-center"
              style={{ transform: open ? 'translateY(-6px) rotate(-45deg)' : 'none' }}
            />
          </div>
        </button>
      </nav>

      {/* Mobile drawer — animated */}
      <div
        className="md:hidden border-t overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          borderColor: '#e5e5e5',
          maxHeight: open ? '300px' : '0px',
          opacity: open ? 1 : 0,
        }}
      >
        <ul className="flex flex-col list-none px-6 py-7 gap-6">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-[13px] uppercase tracking-[.22em] transition-colors duration-200"
                style={{ color: pathname === href ? '#1a1a1a' : '#666' }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
