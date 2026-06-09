import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Hero from '@/components/investors/Hero'
import WhatToExpect from '@/components/investors/WhatToExpect'
import WhyWeDoThis from '@/components/investors/WhyWeDoThis'
import InvestorsCTA from '@/components/investors/InvestorsCTA'

export const metadata: Metadata = {
  title: 'Hardline — A different kind of first call',
  description:
    "We're Hardline — the voice-first layer for construction. Rather than give the same intro pitch for the hundredth time, we built it once. This is our first call, made interactive — you drive.",
  robots: 'noindex, nofollow', // Investor-only — keep out of search results
}

export default function InvestorsPage() {
  return (
    <main className="min-h-screen px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-3xl animate-fade-up space-y-2.5 rounded-[20px] border border-[color:var(--border)] p-2.5 sm:space-y-3.5 sm:p-3.5">
        <Navbar />
        <Hero />
        <WhatToExpect />
        <WhyWeDoThis />
        <InvestorsCTA />
        <Footer />
      </div>
    </main>
  )
}
