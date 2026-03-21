'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const services = [
  'Architectural & interior photography',
  'Editorial & fashion (in development)',
  'Brand & product still life',
  'Fine art print sales',
]

function ContactForm() {
  const searchParams = useSearchParams()
  const [subject, setSubject] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  useEffect(() => {
    const s = searchParams.get('subject')
    if (s) setSubject(s)
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-0">

      {[
        { name: 'name',    label: 'Name',    type: 'text',  placeholder: 'Your name' },
        { name: 'email',   label: 'Email',   type: 'email', placeholder: 'your@email.com' },
      ].map(field => (
        <div key={field.name} className="mb-[22px]">
          <label className="block text-[8px] tracking-[.2em] uppercase text-dim mb-[9px]">
            {field.label}
          </label>
          <input
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            required
            className="w-full bg-transparent border-0 border-b border-edge
                       text-white font-light text-[13px] py-[6px]
                       placeholder:text-dim outline-none
                       focus:border-muted transition-colors duration-200"
          />
        </div>
      ))}

      <div className="mb-[22px]">
        <label className="block text-[8px] tracking-[.2em] uppercase text-dim mb-[9px]">
          Subject
        </label>
        <input
          name="subject"
          type="text"
          placeholder="Commission, print inquiry, general…"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className="w-full bg-transparent border-0 border-b border-edge
                     text-white font-light text-[13px] py-[6px]
                     placeholder:text-dim outline-none
                     focus:border-muted transition-colors duration-200"
        />
      </div>

      <div className="mb-[22px]">
        <label className="block text-[8px] tracking-[.2em] uppercase text-dim mb-[9px]">
          Message
        </label>
        <textarea
          name="message"
          placeholder="Tell me about your project"
          required
          rows={4}
          className="w-full bg-transparent border-0 border-b border-edge
                     text-white font-light text-[13px] py-[6px]
                     placeholder:text-dim outline-none resize-none leading-[1.65]
                     focus:border-muted transition-colors duration-200"
        />
      </div>

      {status === 'sent' ? (
        <p className="text-[9px] tracking-[.18em] uppercase text-muted mt-2">
          Message sent — I'll be in touch within 48 hours.
        </p>
      ) : (
        <button
          type="submit"
          disabled={status === 'sending'}
          className="flex items-center gap-[14px] text-[9px] tracking-[.22em]
                     uppercase text-muted hover:text-white
                     transition-colors duration-200 mt-2 disabled:opacity-50"
        >
          <span className="block h-px w-8 bg-current" />
          {status === 'sending' ? 'Sending…' : 'Send'}
        </button>
      )}

      {status === 'error' && (
        <p className="text-[9px] tracking-[.14em] uppercase text-red-400 mt-2">
          Something went wrong — please email directly.
        </p>
      )}

    </form>
  )
}

export default function ContactPage() {
  return (
    <div className="grid flex-1" style={{ gridTemplateColumns: '1fr 1px 1fr' }}>

      {/* Left */}
      <div className="flex flex-col justify-between px-12 py-11">
        <div>
          <h1 className="font-serif text-[34px] font-normal leading-[1.1]
                         tracking-[-0.02em] text-white">
            Let&apos;s<br /><em>work</em><br />together.
          </h1>
          <p className="text-[12px] leading-[1.8] text-muted mt-[14px] max-w-[38ch]">
          Available to work — editorial, commercial, architectural, brand and
            product, and fine art print sales. Response within 48 hours.
          </p>
          <div className="flex flex-col gap-0 mt-6">
            {services.map(s => (
              <div
                key={s}
                className="flex items-center gap-3 py-[8px] border-b border-edge
                           first:border-t text-[10px] tracking-[.06em] text-muted"
              >
                <span className="w-[4px] h-[4px] rounded-full bg-dim flex-shrink-0" />
                {s}
              </div>
            ))}
          </div>
        </div>
        <p className="text-[8px] tracking-[.16em] uppercase text-dim">
          New York City · brad@bradreardon.studio
        </p>
      </div>

      <div className="bg-edge" />

      {/* Right */}
      <div className="px-12 py-11">
        <Suspense>
          <ContactForm />
        </Suspense>
      </div>

    </div>
  )
}
