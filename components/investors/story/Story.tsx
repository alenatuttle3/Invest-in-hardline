'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import NewsletterSignup from '@/components/investors/NewsletterSignup'
import { ACCESS_KEY } from '@/lib/qualify'
import ScrollAnimator from '@/components/ScrollAnimator'
import VideoPlayer from '@/components/investors/story/VideoPlayer'
import HowItWorks from '@/components/investors/story/HowItWorks'
import MoatFlywheel from '@/components/investors/story/MoatFlywheel'
import TeamPhoto from '@/components/investors/story/TeamPhoto'

// --- Copy (kept as constants so JSX text stays free of unescaped entities) ---
const MARKER = 'Stage 2 of 3 · The Story'
const READ_TIME = '~4 min'

const VIDEO_EYEBROW = 'The origin'
const VIDEO_HEADING = 'One phone call. A two-inch change. $100,000 gone.'
const VIDEO_LINE =
  'The field runs on physical presence, visual judgment, and 70 phone calls a day. Not one of those conversations has ever been captured.'

// The bridge — carries the reader from the problem (the video) into the
// solution (the how-it-works scene that follows).
const BRIDGE_PRE = 'Every problem on a jobsite starts the same way: '
const BRIDGE_EM = 'a conversation that disappeared.'
const BRIDGE_TURN = 'We decided that was over.'

const TRACTION_LEAD =
  "It lands the second the user turns Hardline on: phone calls don't need adoption — they already happen."

const TRACTION_STATS = [
  {
    takeaway: ['Scalable', 'growth strategy'],
    value: '~$60',
    label: 'Cost per qualified lead',
    sub: 'Blended CPQL of $59 against a $237 B2B SaaS average, because our ICP finds us first.',
  },
  {
    takeaway: ['Product-market', 'pull'],
    value: '92%',
    label: 'Pipeline from warm channels',
    sub: 'Product-market pull is strong enough that people come find us — not the other way around.',
  },
  {
    takeaway: ['Immediate', 'time to value'],
    value: '86',
    label: 'Calls summarized, day one',
    sub: 'Sam Espinoza · HWA Construction — 164 minutes transcribed in his first 24 hours.',
  },
]

const MOAT_EYEBROW = 'Why this compounds'
const MOAT_LEAD = 'Every call makes it smarter. Every day makes it harder to leave.'

const WHYNOW_EYEBROW = 'Why now'
const WHYNOW_QUOTE =
  'Voice is becoming consensus as the interface of the jobsite. Hands are full, gloves are on, and the work never stops for a keyboard — the field was always going to talk. The technology finally listens.'

const TEAM_EYEBROW = 'Why us'
const TEAM_BACKERS =
  'Backed by Mucker Capital, Suffolk Tech, Nirman Ventures, and StandUp Ventures.'

const CTA_SUB =
  'Want to follow along as we build? Hop on the newsletter. Want to really get to know us? Grab a time and let’s talk.'
const CTA_BOOK = 'Book a meeting →'

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="section-label mb-4">{children}</p>
}

// Slim reading-progress bar. The pinned scroll scenes break the scrollbar as
// a progress meter, so this restores the reader's sense of how much is left.
function ReadingProgress() {
  const [p, setP] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const total = doc.scrollHeight - window.innerHeight
      setP(total > 0 ? Math.min(1, window.scrollY / total) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px]" aria-hidden="true">
      <div
        className="h-full rounded-r-full bg-mint transition-[width] duration-150 ease-out"
        style={{ width: `${(p * 100).toFixed(2)}%` }}
      />
    </div>
  )
}

export default function Story() {
  const router = useRouter()

  // Hard gate: the story is only reachable after the access form. If there's
  // no captured access in this session, send them back to enter it.
  useEffect(() => {
    try {
      if (!sessionStorage.getItem(ACCESS_KEY)) router.replace('/investors')
    } catch {
      /* sessionStorage unavailable — fail open rather than trap the visitor */
    }
  }, [router])

  return (
    <main className="hl-light min-h-screen bg-[color:var(--hl-base)]">
      <ReadingProgress />
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
                {/* TODO: swap posterSrc for a real still (founders-poster.jpg). */}
                <VideoPlayer
                  posterSrc="/investors/founders-poster.svg"
                  src="https://youtu.be/ul9OjBiW27w"
                />
              </div>
            </section>
          </ScrollAnimator>

          {/* 2 · The bridge — problem video → solution scene */}
          <ScrollAnimator>
            <section className="text-center">
              <p className="mx-auto max-w-2xl text-2xl font-medium leading-snug tracking-tight text-[color:var(--hl-text)] md:text-[1.75rem] md:leading-snug">
                {BRIDGE_PRE}
                <span className="text-mint">{BRIDGE_EM}</span>
              </p>
              <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-hardline-800">
                {BRIDGE_TURN}
              </p>
              <div className="mt-10 flex justify-center" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7 animate-bounce text-mint"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 4v15m0 0l-6-6m6 6l6-6" />
                </svg>
              </div>
            </section>
          </ScrollAnimator>

        </div>
      </div>

      {/* 3 · How it works — full-bleed, scroll-driven scene */}
      <HowItWorks />

      <div className="mx-auto w-full max-w-[720px] px-6">
        <div className="space-y-20 py-20 md:space-y-28 md:py-28">
          {/* 4 · Why this compounds — the moat, as a self-feeding flywheel */}
          <ScrollAnimator>
            <section>
              <Eyebrow>{MOAT_EYEBROW}</Eyebrow>
              <h2 className="hl-h3 text-[color:var(--hl-text)]">{MOAT_LEAD}</h2>

              <MoatFlywheel />
            </section>
          </ScrollAnimator>

          {/* 5 · Traction — hidden
          <ScrollAnimator>
            <section>
              <p className="text-xl font-bold leading-relaxed text-[color:var(--hl-text)]">
                {TRACTION_LEAD}
              </p>

              <div className="mt-10 grid gap-5 sm:grid-cols-3">
                {TRACTION_STATS.map(s => (
                  <div key={s.label} className="flex flex-col gap-4">
                    <p className="whitespace-nowrap text-center text-[15px] font-extrabold uppercase leading-snug tracking-[0.12em] text-mint">
                      {s.takeaway[0]}
                      <br />
                      {s.takeaway[1]}
                    </p>
                    <div className="card flex-1">
                      <p className="text-4xl font-black leading-none text-[color:var(--hl-text)]">
                        {s.value}
                      </p>
                      <p className="mt-3 text-sm font-bold text-[color:var(--hl-text)]">{s.label}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-hardline-800">{s.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </ScrollAnimator>
          */}

          {/* 6 · Why us — one photo of the three of us, tagged like a photo */}
          <ScrollAnimator>
            <section>
              <Eyebrow>{TEAM_EYEBROW}</Eyebrow>
              <TeamPhoto />

              <p className="mt-8 text-sm font-semibold text-[color:var(--hl-text)]">
                {TEAM_BACKERS}
              </p>
            </section>
          </ScrollAnimator>

          {/* 7 · The close — why now and booking, one dark container */}
          <ScrollAnimator>
            <div className="hl-dark hl-dark-rich overflow-hidden rounded-[22px] px-8 py-12 text-center md:px-14 md:py-16">
              <p className="section-label">{WHYNOW_EYEBROW}</p>
              <p className="mx-auto mt-5 max-w-xl text-xl font-medium leading-relaxed text-[color:var(--hl-text)] md:text-2xl md:leading-relaxed">
                {WHYNOW_QUOTE}
              </p>

              <p className="mx-auto mt-8 max-w-md text-base leading-relaxed text-[color:var(--hl-text-muted)]">
                {CTA_SUB}
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/investors/book" className="btn-primary">
                  {CTA_BOOK}
                </Link>
                <NewsletterSignup className="btn-outline-dark" />
              </div>
            </div>
          </ScrollAnimator>

          {/* Footer chrome — continuous with Stage 1 / Stage 3 */}
          <div className="flex items-center justify-between pt-2">
            <Link
              href="/investors"
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
