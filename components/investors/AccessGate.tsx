'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ACCESS_KEY, type InvestorFormData } from '@/lib/qualify'

const HEADLINE = 'Get to know us in five minutes.'
const SUB =
  'Name, email, and your fund — then the story is yours. If it clicks, booking a call is one step away.'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AccessGate() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', fund: '' })
  const [error, setError] = useState('')

  const update = (key: 'name' | 'email' | 'fund', value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.fund.trim()) {
      setError('Please add your name, email, and fund.')
      return
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setError('That email doesn’t look quite right.')
      return
    }
    setError('')

    const access: Partial<InvestorFormData> = {
      name: form.name.trim(),
      email: form.email.trim(),
      fund: form.fund.trim(),
    }
    sessionStorage.setItem(ACCESS_KEY, JSON.stringify(access))

    // Fire-and-forget lead capture (shared to Slack). Keepalive so the route
    // change never waits on the network.
    void fetch('/api/qualifier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'access', form: access }),
      keepalive: true,
    }).catch(() => {})

    router.push('/story')
  }

  return (
    <section id="start" className="scroll-mt-20">
      <div className="section-container py-20 text-center md:py-28">
        <h2 className="hl-h2 text-[color:var(--hl-text)]">{HEADLINE}</h2>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-[color:var(--hl-text-muted)]">
          {SUB}
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md space-y-3 text-left">
          <input
            type="text"
            required
            placeholder="Your name *"
            autoComplete="name"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            className="hl-input"
          />
          <input
            type="email"
            required
            placeholder="Email *"
            autoComplete="email"
            value={form.email}
            onChange={e => update('email', e.target.value)}
            className="hl-input"
          />
          <input
            type="text"
            required
            placeholder="Fund / firm *"
            autoComplete="organization"
            value={form.fund}
            onChange={e => update('fund', e.target.value)}
            className="hl-input"
          />

          {error && <p className="text-sm font-semibold text-[#e8a08a]">{error}</p>}

          <button type="submit" className="btn-primary w-full">
            Show me the story →
          </button>
        </form>

        <p className="mx-auto mt-8 max-w-md text-xs text-hardline-300">
          Your details go only to Alena. This page isn’t indexed by search engines.
        </p>
      </div>
    </section>
  )
}
