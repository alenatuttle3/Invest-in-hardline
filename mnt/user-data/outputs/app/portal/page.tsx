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
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F2ED]">

      {/* Nav */}
      <nav className="px-8 py-5 flex items-center justify-between border-b border-[#1A1A1A]">
        <p className="text-sm font-semibold tracking-tight">Hardline AI</p>
        <span className="text-xs text-[#8A8A8A]">Investor Portal — Confidential</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-20">

        {/* Hero */}
        <section>
          {investorName && (
            <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-4">
              Welcome, {investorName}
            </p>
          )}
          <h1 className="text-4xl font-semibold leading-tight mb-6">
            Construction runs on phone calls.<br />
            We capture what happens on them.
          </h1>
          <p className="text-[#8A8A8A] leading-relaxed max-w-xl">
            {/* TODO: 2-sentence company summary from Granola/pitch calls */}
            [TODO: Pull 2-sentence company summary — what Hardline does, who it's for, why it matters now]
          </p>
        </section>

        {/* Founder video */}
        <section>
          <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-4">From the founder</p>
          <div className="w-full aspect-video bg-[#141414] border border-[#2A2A2A] rounded-lg flex items-center justify-center">
            {/* TODO: Drop Loom embed here */}
            <p className="text-[#4A4A4A] text-sm">[Founder video — Loom embed goes here]</p>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-3">~4 minutes — company story, problem, and where we're going</p>
        </section>

        {/* Traction */}
        <section>
          <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-6">Traction</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRACTION_STATS.map(stat => (
              <div key={stat.label} className="bg-[#141414] border border-[#2A2A2A] rounded-lg p-5">
                <p className="text-2xl font-semibold text-[#E85A1B]">{stat.value}</p>
                <p className="text-xs text-[#8A8A8A] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Product demo */}
        <section>
          <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-4">Product</p>
          <div className="w-full aspect-video bg-[#141414] border border-[#2A2A2A] rounded-lg flex items-center justify-center">
            {/* TODO: Drop product demo video here */}
            <p className="text-[#4A4A4A] text-sm">[Product demo — 60-90 second clip goes here]</p>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <p className="text-xs text-[#8A8A8A] uppercase tracking-widest mb-6">Common questions</p>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="border border-[#2A2A2A] rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center hover:bg-[#141414] transition-colors"
                >
                  <span className="text-sm font-medium">{item.q}</span>
                  <span className="text-[#8A8A8A] text-lg">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-[#8A8A8A] leading-relaxed border-t border-[#2A2A2A] pt-4">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[#2A2A2A] pt-12">
          <h2 className="text-xl font-semibold mb-3">Ready to connect?</h2>
          <p className="text-[#8A8A8A] text-sm mb-6">
            Book a 30-minute call with Alena. Come with questions — I'll come with numbers.
          </p>
          {/* TODO: Replace with Calendly/Cal.com embed */}
          <a
            href="https://cal.com/alena-hardline" // TODO: update link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#E85A1B] text-white px-8 py-3 rounded text-sm font-medium hover:bg-[#d14e14] transition-colors"
          >
            Book a call →
          </a>
        </section>

      </div>
    </main>
  )
}
