import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
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
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatToExpect />
        {/* One shared rich surface so the dark band gets a single soft glow
            instead of one per section. */}
        <div className="hl-dark hl-dark-rich">
          <WhyWeDoThis />
          <InvestorsCTA />
        </div>
      </main>
    </>
  )
}
