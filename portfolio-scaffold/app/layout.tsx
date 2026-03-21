import type { Metadata } from 'next'
import { Libre_Baskerville, Jost } from 'next/font/google'
import Nav from '@/components/Nav'
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
  description: 'Photography by Brad Reardon. Architecture, street, still life, and abstract. Based in New York City. Available for commissions.',
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
      <body className="bg-ink text-silver font-sans antialiased">
        <Nav />
        <main>{children}</main>
        <footer className="border-t border-edge mt-24 py-8 px-6 flex justify-between items-center">
          <span className="text-xs tracking-widest text-muted uppercase">
            © {new Date().getFullYear()} Brad Reardon. All rights reserved.
          </span>
          <span className="text-xs text-muted">
            All images are registered works. Reproduction prohibited.
          </span>
        </footer>
      </body>
    </html>
  )
}
