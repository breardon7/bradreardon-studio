import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { prints } from '@/content/prints'

export const metadata: Metadata = {
  title: 'Prints',
}

export default function ShopPage() {
  return (
    <div className="flex flex-col flex-1">

      {/* ── Header ── */}
      <div className="grid border-b border-edge px-9 pb-6 pt-6"
           style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <h1 className="font-serif text-[20px] font-normal italic text-white">Prints</h1>
        <p className="text-[11px] leading-[1.75] text-muted max-w-[52ch]">
          Archival giclée on Hahnemühle Photo Rag 308gsm. Each print signed,
          numbered, and accompanied by a certificate of authenticity.
          Ships within 7 business days from New York.
        </p>
      </div>

      {/* ── Grid ── */}
      {/*
        FULFILMENT NOTE:
        Self-fulfilment flow — no add-to-cart needed at this stage.
        Clicking a print links to /shop/[slug] where the buyer can
        select a size and submit an inquiry via the contact API.
        You invoice manually (Stripe Payment Link or Wave) and ship
        after confirmation. This keeps overhead minimal while your
        print offering is still small.

        When volume grows, add Stripe Checkout:
        - Each size variant becomes a Stripe Price ID
        - /api/checkout creates a Stripe Checkout Session
        - Buyer lands on Stripe-hosted payment page
        - Webhook at /api/webhook updates order status
      */}
      <div
        className="grid bg-edge flex-1"
        style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px' }}
      >
        {prints.map(print => (
          <Link
            key={print.slug}
            href={`/shop/${print.slug}`}
            className="group bg-bg flex flex-col p-7 hover:bg-bg2
                       transition-colors duration-200"
          >
            {/* Thumbnail */}
            <div className="overflow-hidden mb-[18px]">
              {/* Replace with actual image once available */}
              <div
                className="w-full aspect-[3/4] bg-gradient-to-br from-bg3 to-bg
                           group-hover:scale-[1.02] transition-transform duration-500"
              />
              {/* <Image src={`/images/prints/${print.photoSlug}.jpg`} ... /> */}
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 justify-between">
              <div>
                <h2 className="font-serif text-[12px] italic text-white">{print.title}</h2>
                <p className="text-[8px] tracking-[.14em] uppercase text-dim mt-[5px]">
                  {print.sizes[0].label} – {print.sizes[print.sizes.length - 1].label}
                  {' · '}Ed. of {print.sizes[0].edition}
                </p>
              </div>
              <div className="flex justify-between items-end mt-[14px] pt-[14px] border-t border-edge">
                <span className="text-[13px] text-text tracking-[.02em]">
                  From ${Math.min(...print.sizes.map(s => s.price))}
                </span>
                <span className="text-[8px] tracking-[.12em] uppercase text-dim">
                  Inquire →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Footer note ── */}
      <div className="flex justify-between items-center px-9 py-4 border-t border-edge">
        <span className="text-[8px] tracking-[.14em] uppercase text-dim">
          All prints ship flat · Framing available on request
        </span>
        <Link
          href="/contact"
          className="text-[9px] tracking-[.16em] uppercase text-muted
                     hover:text-white transition-colors duration-200"
        >
          Inquire about custom sizes →
        </Link>
      </div>

    </div>
  )
}
