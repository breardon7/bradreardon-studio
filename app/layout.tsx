import type { Metadata } from 'next'
import { Libre_Baskerville, Jost } from 'next/font/google'
import { Suspense } from 'react'
import Nav from '@/components/Nav'
import SeriesNav from '@/components/SeriesNav'
import './globals.css'

const baskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-baskerville',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400'],
  variable: '--font-jost',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Brad Reardon',
    default: 'Brad Reardon — Photography',
  },
  description: 'Photography by Brad Reardon. Architecture, street, still life, and abstract. Based in New York City. Available to work.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Brad Reardon',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${baskerville.variable} ${jost.variable}`}>
      <body style={{ backgroundColor: '#ffffff', color: '#1a1a1a' }} className="font-sans antialiased min-h-screen flex flex-col">
        <Nav />
        <Suspense fallback={null}>
          <SeriesNav />
        </Suspense>
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t mt-24 py-8 px-9 flex justify-between items-center" style={{ borderColor: '#e5e5e5' }}>
          <span className="text-xs tracking-widest uppercase" style={{ color: '#999' }}>
            © {new Date().getFullYear()} Brad Reardon. All rights reserved.
          </span>
          <span className="text-xs" style={{ color: '#999' }}>
            All images are registered works. Reproduction prohibited.
          </span>
        </footer>
      </body>
    </html>
  )
}
