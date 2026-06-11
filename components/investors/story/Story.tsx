'use client'

import Link from 'next/link'
import BookCall from '@/components/CalEmbed'
import ScrollAnimator from '@/components/ScrollAnimator'
import VideoPlayer from '@/components/investors/story/VideoPlayer'
import HowItWorks from '@/components/investors/story/HowItWorks'

// --- Copy (kept as constants so JSX text stays free of unescaped entities) ---
const MARKER = 'Stage 2 of 3 · The Story'
const READ_TIME = '~4 min'

const VIDEO_EYEBROW = 'From us'
const VIDEO_HEADING = 'Why we built Hardline'
const VIDEO_LINE =
  'The two of us, on camera — the founding story, and the $150K phone call that started it.'

const REFRAME_EYEBROW = 'The reframe'
const REFRAME_QUOTE =
  "You've seen the stats — wasted time, unused data, rework everywhere. Those aren't problems. They're symptoms. The real issue: construction runs on conversation, but the tools don't listen."

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
const MOAT_LEAD = 'The knowledge map is the moat.'
const MOAT_SUB =
  'Every conversation makes the map smarter — and the longer Hardline runs, the more expensive it is to leave.'
const MOAT_STEPS = [
  { n: '01', title: 'Passive capture', body: 'Field data collected with zero behavior change.' },
  { n: '02', title: 'Immediate value', body: 'Voice becomes a living knowledge map on day one.' },
  { n: '03', title: 'Stickiness', body: 'Every conversation raises the switching cost.' },
  { n: '04', title: 'Intelligence', body: 'The layer that runs voice-operated jobsites.' },
]
const MOAT_FOOT =
  'Procore, Autodesk, and Fieldwire stay the systems of record. Hardline becomes the gatekeeper of the live field data that feeds them.'

const ICP_EYEBROW = 'Who it’s for'
const ICP_LEAD = 'Anyone who runs the job by phone.'
const ICP_SUB =
  'The wedge is the field leader who lives in coordination — supers, PMs, foremen, owners. And because every side of the job runs on the same conversations, the value lands across trades and GCs alike: one wedge, horizontal across the field.'
const ICP_SEGMENTS = [
  {
    title: 'General contractors',
    body: 'Every sub, schedule change, and decision across the job — captured and pushed to the office.',
  },
  {
    title: 'Specialty trades',
    body: 'Crews, change orders, and client calls documented without anyone breaking stride.',
  },
]

const WHYNOW_EYEBROW = 'Why now'
const WHYNOW_QUOTE =
  'Voice is becoming consensus as the interface of the jobsite. Hands are full, gloves are on, and the work never stops for a keyboard — the field was always going to talk. The technology finally listens.'

const TEAM_EYEBROW = 'Why us'
const TEAM_HEADING = 'Built construction. Built voice AI. Built to exit.'
const TEAM = [
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

const VISION =
  'The phone is the entry point and the highest-leverage UI on a jobsite. Hardline will be the eyes and ears of every jobsite — the source of truth on every build, and the connective tissue that links the job to the office.'

const CTA_SUB =
  "If you believe in what we're building and have questions, let's meet."
const CTA_BOOK = 'Schedule meeting →'

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="section-label mb-4">{children}</p>
}

export default function Story() {
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

        </div>
      </div>

      {/* 3 · How it works — full-bleed, scroll-driven scene */}
      <HowItWorks />

      <div className="mx-auto w-full max-w-[720px] px-6">
        <div className="space-y-20 py-20 md:space-y-28 md:py-28">
          {/* 4 · Why this compounds — the moat */}
          <ScrollAnimator>
            <section>
              <Eyebrow>{MOAT_EYEBROW}</Eyebrow>
              <h2 className="hl-h3 text-[color:var(--hl-text)]">{MOAT_LEAD}</h2>
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-[color:var(--hl-text)]">
                {MOAT_SUB}
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {MOAT_STEPS.map(s => (
                  <div key={s.n} className="card">
                    <p className="text-xs font-bold text-mint">{s.n}</p>
                    <p className="mt-2 text-base font-bold text-[color:var(--hl-text)]">{s.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-hardline-800">{s.body}</p>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm leading-relaxed text-hardline-800">{MOAT_FOOT}</p>
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

          {/* 6 · Who it's for — ICP, horizontal across the field */}
          <ScrollAnimator>
            <section>
              <Eyebrow>{ICP_EYEBROW}</Eyebrow>
              <h2 className="hl-h3 text-[color:var(--hl-text)]">{ICP_LEAD}</h2>
              <p className="mt-3 max-w-xl text-lg leading-relaxed text-[color:var(--hl-text)]">
                {ICP_SUB}
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {ICP_SEGMENTS.map(s => (
                  <div key={s.title} className="card">
                    <p className="text-base font-bold text-[color:var(--hl-text)]">{s.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-hardline-800">{s.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </ScrollAnimator>

          {/* 7 · Why now */}
          <ScrollAnimator>
            <section>
              <Eyebrow>{WHYNOW_EYEBROW}</Eyebrow>
              <blockquote className="border-l-2 border-mint pl-6 text-2xl font-medium leading-snug tracking-tight text-[color:var(--hl-text)] md:text-[1.75rem] md:leading-snug">
                {WHYNOW_QUOTE}
              </blockquote>
            </section>
          </ScrollAnimator>

          {/* 8 · Why us — team */}
          <ScrollAnimator>
            <section>
              <Eyebrow>{TEAM_EYEBROW}</Eyebrow>
              <h2 className="hl-h3 text-[color:var(--hl-text)]">{TEAM_HEADING}</h2>

              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {TEAM.map(m => (
                  <div key={m.name} className="card">
                    <p className="text-base font-bold text-[color:var(--hl-text)]">{m.name}</p>
                    <p className="mt-0.5 text-[11px] font-bold uppercase tracking-widest text-mint">
                      {m.role}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-hardline-800">{m.bio}</p>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm font-semibold text-[color:var(--hl-text)]">
                {TEAM_BACKERS}
              </p>
            </section>
          </ScrollAnimator>

          {/* 9 · Vision line */}
          <ScrollAnimator>
            <blockquote className="border-l-2 border-mint pl-6 text-xl font-medium leading-relaxed text-[color:var(--hl-text)] md:text-2xl md:leading-relaxed">
              {VISION}
            </blockquote>
          </ScrollAnimator>

          {/* 10 · Handoff CTA — booking only */}
          <ScrollAnimator>
            <div className="card text-center">
              <p className="mx-auto max-w-md text-lg leading-relaxed text-[color:var(--hl-text)]">
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
