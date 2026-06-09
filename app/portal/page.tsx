'use client'

import { useEffect, useState } from 'react'

// Placeholder sections — fill in after Granola review
const FAQ_ITEMS = [
  {
    q: 'Why now?',
    a: '[TODO: Granola — pull the "why now" narrative from investor calls]',
  },
  {
    q: 'Why Hardline vs. existing tools?',
    a: '[TODO: Granola — pull differentiation framing from customer/investor calls]',
  },
  {
    q: "What's the tech stack and moat?",
    a: '[TODO: Kimball to contribute a paragraph here]',
  },
  {
    q: "What does the $XM get you?",
    a: '[TODO: Fill in use of funds after round sizing confirmed]',
  },
  {
    q: "Who's the target customer?",
    a: '[TODO: Granola — pull ICP definition from sales calls]',
  },
]

const TRACTION_STATS = [
  { label: 'Customers', value: '[X]' },
  { label: 'Monthly calls captured', value: '[X]K' },
  { label: 'Pre-seed raised', value: '$2M' },
  { label: 'Integrations live', value: '3' },
]

export default function PortalPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [investorName, setInvestorName] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('investorForm')
    if (raw) {
      const data = JSON.parse(raw)
      setInvestorName(data.name?.split(' ')[0] ?? '')
    }
  }, [])

  return (
    <main className="hl-dark min-h-screen">

      {/* Nav */}
      <nav className="px-8 py-5 flex items-center justify-between border-b border-[color:var(--hl-hairline)]">
        <p className="text-sm font-semibold tracking-tight">Hardline</p>
        <span className="section-label-dark">Investor Portal — Confidential</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-20">

        {/* Hero */}
        <section className="animate-fade-up">
          {investorName && (
            <p className="section-label-dark mb-4">Welcome, {investorName}</p>
          )}
          <h1 className="hl-h1 text-4xl md:text-5xl mb-6">
            <span className="hl-gradient-text">Construction runs on phone calls.</span>
            <br />
            We capture what happens on them.
          </h1>
          <p className="hl-body max-w-xl">
            {/* TODO: 2-sentence company summary from Granola/pitch calls */}
            [TODO: Pull 2-sentence company summary — what Hardline does, who it&apos;s for, why it matters now]
          </p>
        </section>

        {/* Founder video */}
        <section>
          <p className="section-label-dark mb-4">From the founder</p>
          <div className="w-full aspect-video card-dark flex items-center justify-center">
            {/* TODO: Drop Loom embed here */}
            <p className="text-hardline-300 text-sm">[Founder video — Loom embed goes here]</p>
          </div>
          <p className="hl-body text-xs mt-3">~4 minutes — company story, problem, and where we&apos;re going</p>
        </section>

        {/* Traction */}
        <section>
          <p className="section-label-dark mb-6">Traction</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRACTION_STATS.map(stat => (
              <div key={stat.label} className="card-dark p-5">
                <p className="text-2xl font-medium text-mint">{stat.value}</p>
                <p className="hl-body text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Product demo */}
        <section>
          <p className="section-label-dark mb-4">Product</p>
          <div className="w-full aspect-video card-dark flex items-center justify-center">
            {/* TODO: Drop product demo video here */}
            <p className="text-hardline-300 text-sm">[Product demo — 60-90 second clip goes here]</p>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <p className="section-label-dark mb-6">Common questions</p>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="card-dark !p-0 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center"
                >
                  <span className="text-sm font-medium">{item.q}</span>
                  <span className="text-mint text-lg leading-none">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 hl-body text-sm border-t border-[color:var(--hl-hairline)] pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[color:var(--hl-hairline)] pt-12">
          <h2 className="hl-h3 mb-3">Ready to connect?</h2>
          <p className="hl-body text-sm mb-6">
            Book a 30-minute call with Alena. Come with questions — I&apos;ll come with numbers.
          </p>
          {/* TODO: Replace with Calendly/Cal.com embed */}
          <a
            href="https://cal.com/alena-hardline" // TODO: update link
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Book a call →
          </a>
        </section>

      </div>
    </main>
  )
}
