'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BookCall from '@/components/CalEmbed'
import ScrollAnimator from '@/components/ScrollAnimator'
import VideoPlayer from '@/components/investors/story/VideoPlayer'
import ThreeLayerModel from '@/components/investors/story/ThreeLayerModel'
import { readInvestorTier, type InvestorTier } from '@/lib/tier'

// --- Copy (kept as constants so JSX text stays free of unescaped entities) ---
const MARKER = 'Stage 2 of 3 · The Story'
const READ_TIME = '~3 min'

const VIDEO_EYEBROW = 'From us'
const VIDEO_HEADING = 'Why we built Hardline'
const VIDEO_LINE =
  'The two of us, on camera — the founding story, and the $150K phone call that started it.'

const REFRAME_EYEBROW = 'The reframe'
const REFRAME_QUOTE =
  "You've seen the stats — wasted time, unused data, rework everywhere. Those aren't problems. They're symptoms. The real issue: construction runs on conversation, but the tools don't listen."

const MODEL_EYEBROW = "How it works — and why it's different"
const MODEL_INTRO =
  'Three layers. Everyone else automates data entry — we remove the need for it.'

const ADOPTION_PRE = 'And it lands the day we turn it on: '
const ADOPTION_BOLD = "phone calls don't need adoption — they already happen."
const ADOPTION_MID = ' One super, Sam at HWA, had '
const ADOPTION_POST = ' calls summarized in his first 24 hours.'

const VISION =
  'Today it’s the phone. The vision: every conversation on the jobsite, captured — the system that runs construction.'

const CTA_HEADING = 'Got questions? Good — ask them.'
const CTA_SUB =
  'The ones every investor asks us — moat, pricing, GTM — answered in our words.'
const CTA_PRIMARY = 'Ask us anything →'
const CTA_BOOK = '…seen enough? grab a time on our calendar'
const CTA_UPDATES = 'join our investor updates'

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="section-label mb-4">{children}</p>
}

export default function Story() {
  // Tier governs the secondary CTA. Default to a tier that shows booking, then
  // refine on mount once we can read the query param / session on the client.
  const [tier, setTier] = useState<InvestorTier>('soft')

  useEffect(() => {
    setTier(readInvestorTier())
  }, [])

  const showBooking = tier !== 'park'

  return (
    <main className="hl-light min-h-screen bg-[color:var(--hl-base)]">
      <div className="mx-auto w-full max-w-[720px] px-6 py-14 md:py-16">
        {/* Top marker */}
        <header className="flex items-end justify-between gap-4">
          <span className="section-label inline-block border-b-2 border-mint pb-2">{MARKER}</span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-hardline-800">
            {READ_TIME}
          </span>
        </header>
        <div className="mt-3 border-b border-[color:var(--hl-hairline)]" />

        <div className="space-y-20 pt-12 md:space-y-28 md:pt-16">
          {/* 1 · Founder video */}
          <ScrollAnimator>
            <section>
              <Eyebrow>{VIDEO_EYEBROW}</Eyebrow>
              <h1 className="hl-h2 text-[color:var(--hl-text)]">{VIDEO_HEADING}</h1>
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-[color:var(--hl-text)]">
                {VIDEO_LINE}
              </p>
              <div className="mt-8">
                {/* TODO: swap posterSrc for a real still (founders-poster.jpg) and pass `src`. */}
                <VideoPlayer posterSrc="/investors/founders-poster.svg" />
              </div>
            </section>
          </ScrollAnimator>

          {/* 2 · The reframe */}
          <ScrollAnimator>
            <section>
              <Eyebrow>{REFRAME_EYEBROW}</Eyebrow>
              <blockquote className="border-l-2 border-mint pl-6 text-2xl font-medium leading-snug tracking-tight text-[color:var(--hl-text)] md:text-[1.75rem] md:leading-snug">
                {REFRAME_QUOTE}
              </blockquote>
            </section>
          </ScrollAnimator>

          {/* 3 · How it works — the three-layer model */}
          <ScrollAnimator>
            <section>
              <Eyebrow>{MODEL_EYEBROW}</Eyebrow>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-[color:var(--hl-text)]">
                {MODEL_INTRO}
              </p>
              <ThreeLayerModel />
            </section>
          </ScrollAnimator>

          {/* 4 · Adoption proof */}
          <ScrollAnimator>
            <p className="text-xl leading-relaxed text-[color:var(--hl-text)]">
              {ADOPTION_PRE}
              <strong className="font-bold">{ADOPTION_BOLD}</strong>
              {ADOPTION_MID}
              <span className="font-bold text-mint">86</span>
              {ADOPTION_POST}
            </p>
          </ScrollAnimator>

          {/* 5 · Vision line */}
          <ScrollAnimator>
            <div className="hl-dark rounded-card bg-[color:var(--hl-base)] px-7 py-9 shadow-neu-md md:px-10 md:py-11">
              <p className="border-l-2 border-mint pl-6 text-xl font-medium leading-relaxed text-[color:var(--hl-text)] md:text-2xl md:leading-relaxed">
                {VISION}
              </p>
            </div>
          </ScrollAnimator>

          {/* 6 · Handoff CTA */}
          <ScrollAnimator>
            <div className="card text-center">
              <h2 className="hl-h3 text-[color:var(--hl-text)]">{CTA_HEADING}</h2>
              <p className="mx-auto mt-3 max-w-md text-[color:var(--hl-text)]">{CTA_SUB}</p>

              <div className="mt-8 flex flex-col items-center gap-5">
                <Link href="/investors/qa" className="btn-primary">
                  {CTA_PRIMARY}
                </Link>

                {showBooking ? (
                  <BookCall className="text-sm font-medium text-hardline-800 underline-offset-4 transition-colors hover:text-mint hover:underline">
                    {CTA_BOOK}
                  </BookCall>
                ) : (
                  <a
                    href="mailto:alena@hardlineapp.com?subject=Hardline%20investor%20updates"
                    className="text-sm font-medium text-hardline-800 underline-offset-4 transition-colors hover:text-mint hover:underline"
                  >
                    {CTA_UPDATES}
                  </a>
                )}
              </div>
            </div>
          </ScrollAnimator>

          {/* Footer chrome — continuous with Stage 1 / Stage 3 */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/investors/qualifier"
              className="text-xs font-bold uppercase tracking-widest text-hardline-800 transition-colors hover:text-mint"
            >
              ← Back
            </Link>
            <span className="text-[11px] uppercase tracking-widest text-hardline-800">
              Investor-only · not indexed
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
