import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prints, getPrint } from '@/content/prints'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return prints.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const print = getPrint(params.slug)
  if (!print) return {}
  return { title: print.title }
}

export default function PrintPage({ params }: Props) {
  const print = getPrint(params.slug)
  if (!print) notFound()

  return (
    <div className="grid flex-1" style={{ gridTemplateColumns: '1fr 1px 1fr' }}>

      {/* Image */}
      <div className="relative min-h-[520px] bg-gradient-to-br from-bg3 to-bg">
        {/* <Image src={`/images/prints/${print.photoSlug}.jpg`} fill className="object-cover" /> */}
      </div>

      <div className="bg-edge" />

      {/* Details + inquiry */}
      <div className="flex flex-col justify-between px-12 py-11">
        <div>
          <Link
            href="/shop"
            className="text-[8px] tracking-[.18em] uppercase text-dim
                       hover:text-muted transition-colors duration-200 mb-8 block"
          >
            ← All prints
          </Link>

          <h1 className="font-serif text-[22px] font-normal italic text-white leading-snug">
            {print.title}
          </h1>
          <p className="text-[10px] tracking-[.12em] uppercase text-dim mt-2">
            {print.medium}
          </p>

          <p className="text-[12px] leading-[1.8] text-muted mt-5 max-w-[40ch]">
            {print.description}
          </p>

          <div className="w-5 h-px bg-edge my-6" />

          {/* Size + price table */}
          <div className="flex flex-col gap-0">
            {print.sizes.map(size => (
              <div
                key={size.label}
                className="flex justify-between items-baseline py-[9px]
                           border-b border-edge first:border-t text-[11px]"
              >
                <span className="text-text">{size.label}</span>
                <span className="text-[8px] tracking-[.12em] uppercase text-dim">
                  Ed. of {size.edition}
                  {size.sold ? ` · ${size.sold} sold` : ''}
                </span>
                <span className="text-text">${size.price}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 text-[10px] leading-[1.6] text-dim">
            <p>{print.framing}</p>
            <p className="mt-1">{print.shipping}</p>
            {print.certificate && (
              <p className="mt-1">Includes certificate of authenticity.</p>
            )}
          </div>
        </div>

        {/* Inquiry CTA — links to contact with subject pre-filled */}
        <div className="pt-6 border-t border-edge">
          <Link
            href={`/contact?subject=${encodeURIComponent(`Print inquiry — ${print.title}`)}`}
            className="inline-flex items-center gap-4 text-[9px] tracking-[.2em]
                       uppercase text-muted hover:text-white transition-colors duration-200"
          >
            <span
              className="block h-px bg-current transition-[width] duration-300"
              style={{ width: 32 }}
            />
            Inquire about this print
          </Link>
        </div>
      </div>

    </div>
  )
}
