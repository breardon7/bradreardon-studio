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

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    // Don't lock body scroll — drawer is a fixed overlay so no scroll trap needed
    // Locking body scroll breaks sticky positioning on some mobile browsers
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
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

          {/* Mobile toggle — fixed position so always visible */}
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
      </header>

      {/* Mobile drawer — fixed overlay, always visible regardless of scroll */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-[60]"
            style={{ backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setOpen(false)}
          />
          {/* Menu panel — fixed below the nav bar */}
          <div
            className="md:hidden fixed left-0 right-0 z-[60] border-t border-b"
            style={{
              top: '80px',
              backgroundColor: '#ffffff',
              borderColor: '#e5e5e5',
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
        </>
      )}
    </>
  )
}
