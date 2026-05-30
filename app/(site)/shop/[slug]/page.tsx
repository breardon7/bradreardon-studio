'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { photos } from '@/content/photos'
import { prints } from '@/content/prints'
import type { PrintSize } from '@/content/prints'
import { notFound } from 'next/navigation'

const photoMap = Object.fromEntries(photos.map(p => [p.slug, p]))

function formatPrice(cents: number): string {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })
}

export default function PrintPage({ params }: { params: { slug: string } }) {
  const listing = prints.find(p => p.slug === params.slug && p.visible)
  if (!listing) notFound()
  const photo = photoMap[listing!.slug]
  if (!photo) notFound()

  const availableSizes = listing!.sizes.filter(s => s.available)

  const [selectedSize, setSelectedSize] = useState<PrintSize | null>(
    availableSizes[0] ?? null
  )
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedSize || !name || !email) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message: message || '',
          subject: 'Print inquiry — ' + photo.title + ' (' + selectedSize.label + ')',
          print: {
            title: photo.title,
            slug: listing!.slug,
            size: selectedSize.label,
            price: formatPrice(selectedSize.price),
            edition: selectedSize.edition ?? null,
            medium: listing!.medium,
            paper: listing!.paper,
            finish: listing!.finish,
          },
        }),
      })
      if (!res.ok) throw new Error('Failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 py-16 px-9">
        <div className="mx-auto" style={{ maxWidth: '960px' }}>

          {/* back */}
          <Link
            href="/shop"
            style={{ fontSize: '11px', letterSpacing: '.2em', textTransform: 'uppercase', color: '#999', textDecoration: 'none', display: 'inline-block', marginBottom: '48px' }}
          >
            ← Shop
          </Link>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1px 400px', gap: '0', alignItems: 'start' }}>

            {/* image */}
            <div className="pr-16">
              <div
                className="relative overflow-hidden w-full"
                style={{ aspectRatio: photo.aspectRatio, backgroundColor: '#f5f5f5' }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 560px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* divider */}
            <div style={{ background: '#e5e5e5', alignSelf: 'stretch' }} />

            {/* detail panel */}
            <div className="pl-16">

              {/* title + meta */}
              <p className="font-serif" style={{ fontSize: '22px', fontStyle: 'italic', color: '#1a1a1a', marginBottom: '6px' }}>
                {photo.title}
              </p>
              <p style={{ fontSize: '11px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#999', marginBottom: '32px' }}>
                {photo.series} · {photo.year}
              </p>

              {/* print specs */}
              <div style={{ marginBottom: '32px', borderTop: '1px solid #e5e5e5', paddingTop: '24px' }}>
                {[
                  ['Medium', listing!.medium],
                  ['Paper', listing!.paper],
                  ['Finish', listing!.finish],
                  ...(listing!.notes ? [['Notes', listing!.notes]] : []),
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', letterSpacing: '.16em', textTransform: 'uppercase', color: '#999', width: '72px', flexShrink: 0 }}>
                      {label}
                    </span>
                    <span style={{ fontSize: '13px', color: '#1a1a1a' }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* size selector */}
              {availableSizes.length > 0 ? (
                <div style={{ marginBottom: '32px', borderTop: '1px solid #e5e5e5', paddingTop: '24px' }}>
                  <p style={{ fontSize: '11px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#999', marginBottom: '14px' }}>
                    Size
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {availableSizes.map(size => (
                      <button
                        key={size.label}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          border: '1px solid ' + (selectedSize?.label === size.label ? '#1a1a1a' : '#e5e5e5'),
                          background: 'none',
                          cursor: 'pointer',
                          transition: 'border-color 0.15s',
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ fontSize: '13px', color: '#1a1a1a' }}>
                          {size.label}
                          {size.edition && (
                            <span style={{ fontSize: '11px', color: '#999', marginLeft: '10px', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                              Ed. {size.edition}
                            </span>
                          )}
                        </span>
                        <span style={{ fontSize: '13px', color: '#1a1a1a' }}>
                          {formatPrice(size.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: '#999', marginBottom: '32px' }}>
                  Currently sold out — inquire below to join the waitlist.
                </p>
              )}

              {/* inquiry form */}
              <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: '24px' }}>
                <p style={{ fontSize: '11px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#999', marginBottom: '20px' }}>
                  {status === 'sent' ? 'Inquiry sent' : 'Inquire'}
                </p>

                {status === 'sent' ? (
                  <p style={{ fontSize: '13px', color: '#1a1a1a', lineHeight: 1.7 }}>
                    Thank you. I'll be in touch within 48 hours to confirm your order and arrange payment.
                  </p>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { id: 'name', label: 'Name', value: name, setter: setName, type: 'text' },
                      { id: 'email', label: 'Email', value: email, setter: setEmail, type: 'email' },
                    ].map(({ id, label, value, setter, type }) => (
                      <div key={id}>
                        <label
                          htmlFor={id}
                          style={{ display: 'block', fontSize: '11px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#999', marginBottom: '6px' }}
                        >
                          {label}
                        </label>
                        <input
                          id={id}
                          type={type}
                          value={value}
                          onChange={e => setter(e.target.value)}
                          required
                          style={{
                            width: '100%', background: 'transparent', border: 'none',
                            borderBottom: '1px solid #e5e5e5', fontFamily: 'Jost, sans-serif',
                            fontWeight: 300, fontSize: '14px', color: '#1a1a1a',
                            padding: '6px 0', outline: 'none',
                          }}
                        />
                      </div>
                    ))}
                    <div>
                      <label
                        htmlFor="message"
                        style={{ display: 'block', fontSize: '11px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#999', marginBottom: '6px' }}
                      >
                        Message (optional)
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={3}
                        style={{
                          width: '100%', background: 'transparent', border: 'none',
                          borderBottom: '1px solid #e5e5e5', fontFamily: 'Jost, sans-serif',
                          fontWeight: 300, fontSize: '14px', color: '#1a1a1a',
                          padding: '6px 0', outline: 'none', resize: 'none',
                        }}
                      />
                    </div>

                    {status === 'error' && (
                      <p style={{ fontSize: '12px', color: '#c0392b' }}>
                        Something went wrong — please try again or email directly.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending' || !selectedSize}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontFamily: 'Jost, sans-serif', fontSize: '12px', fontWeight: 300,
                        letterSpacing: '.22em', textTransform: 'uppercase',
                        color: status === 'sending' ? '#ccc' : '#999', padding: '8px 0',
                        transition: 'color 0.2s',
                      }}
                    >
                      <span style={{ display: 'block', height: '1px', width: '32px', background: 'currentColor' }} />
                      {status === 'sending' ? 'Sending...' : 'Send inquiry'}
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
