'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BookCall from '@/components/CalEmbed'
import ScrollAnimator from '@/components/ScrollAnimator'
import VideoPlayer from '@/components/investors/story/VideoPlayer'
import HowItWorks from '@/components/investors/story/HowItWorks'
import MoatFlywheel from '@/components/investors/story/MoatFlywheel'

// --- Copy (kept as constants so JSX text stays free of unescaped entities) ---
const MARKER = 'Stage 2 of 3 · The Story'
const READ_TIME = '~4 min'

const VIDEO_EYEBROW = 'From us'
const VIDEO_HEADING = 'Why we built Hardline'
const VIDEO_LINE =
  'The two of us, on camera: a two-inch change, communicated over the phone, $150,000 in rework — and why that happens on every job, every day.'

// The bridge — carries the reader from the problem (the video) into the
// solution (the how-it-works scene that follows).
const BRIDGE_PRE = "That $150K call wasn't rare. Every problem on a jobsite starts the same way — "
const BRIDGE_EM = 'as a conversation the tools never heard.'
const BRIDGE_TURN = 'So we built the one that listens. Watch what happens when the field talks.'

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
const MOAT_LEAD = 'The data & intelligence is the moat.'
const MOAT_SUB =
  'Every conversation makes the map smarter — and the longer Hardline runs, the more expensive it is to leave.'

const WHYNOW_EYEBROW = 'Why now'
const WHYNOW_QUOTE =
  'Voice is becoming consensus as the interface of the jobsite. Hands are full, gloves are on, and the work never stops for a keyboard — the field was always going to talk. The technology finally listens.'

const TEAM_EYEBROW = 'Why us'
const TEAM_HEADING = 'Built construction. Built voice AI. Built to exit.'
// TODO: set `photo` to e.g. '/investors/team/alena.jpg' once headshots are
// uploaded to public/investors/team/ — cards show initials until then.
const TEAM: { name: string; role: string; bio: string; photo?: string }[] = [
  {
    name: 'Alena Tuttle',
    role: 'Co-founder · CEO',
    bio: '8+ years GTM, strategy, and product. Scaled OpenInvest to a $200M+ exit.',
  },
  {
    name: 'Karly Heffernan',
    role: 'Co-founder · COO',
    bio: 'Built a commercial GC from $0 to $20M in revenue. Operations & strategy at Rex.',
  },
  {
    name: 'Kimball Hill',
    role: 'CTO',
    bio: 'Took an agentic enterprise platform from 0 to $8M ARR in under a year. 7 years scaling AI products.',
  },
]
const TEAM_BACKERS =
  'Backed by Mucker Capital, Suffolk Tech, Nirman Ventures, and StandUp Ventures.'

const CTA_SUB =
  "If you believe in what we're building and have questions, let's meet."
const CTA_BOOK = 'Schedule meeting →'

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

// Hover (or tap) flips the card from the person to their track record.
function TeamFlipCard({ name, role, bio, photo }: (typeof TEAM)[number]) {
  const [flipped, setFlipped] = useState(false)
  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')

  return (
    <button
      type="button"
      onClick={() => setFlipped(f => !f)}
      aria-pressed={flipped}
      aria-label={`About ${name}`}
      className="hl-flip h-[280px] w-full cursor-pointer text-left"
    >
      <div className={`hl-flip-inner${flipped ? ' is-flipped' : ''}`}>
        <div className="hl-flip-face card flex flex-col items-center justify-center text-center">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={name}
              className="h-28 w-28 rounded-full object-cover shadow-neu-sm"
            />
          ) : (
            <span className="flex h-28 w-28 items-center justify-center rounded-full bg-[color:var(--hl-base)] text-2xl font-bold text-mint shadow-neu-sm">
              {initials}
            </span>
          )}
          <p className="mt-4 text-base font-bold text-[color:var(--hl-text)]">{name}</p>
          <p className="mt-0.5 text-[11px] font-bold uppercase tracking-widest text-mint">{role}</p>
        </div>

        <div className="hl-flip-face hl-flip-back hl-dark hl-dark-rich flex flex-col items-center justify-center rounded-[18px] px-6 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-mint">{role}</p>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--hl-text)]">{bio}</p>
        </div>
      </div>
    </button>
  )
}

export default function Story() {
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
                {/* TODO: swap posterSrc for a real still (founders-poster.jpg) and pass `src`. */}
                <VideoPlayer posterSrc="/investors/founders-poster.svg" />
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
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-[color:var(--hl-text)]">
                {MOAT_SUB}
              </p>

              <MoatFlywheel />
            </section>
          </ScrollAnimator>

          {/* 5 · Traction */}
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

          {/* 6 · Why us — team flip cards (hover/tap for the track record) */}
          <ScrollAnimator>
            <section>
              <Eyebrow>{TEAM_EYEBROW}</Eyebrow>
              <h2 className="hl-h3 text-[color:var(--hl-text)]">{TEAM_HEADING}</h2>

              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {TEAM.map(m => (
                  <TeamFlipCard key={m.name} {...m} />
                ))}
              </div>

              <p className="mt-6 text-sm font-semibold text-[color:var(--hl-text)]">
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

              <div className="mt-8 flex justify-center">
                <BookCall className="btn-primary">{CTA_BOOK}</BookCall>
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
