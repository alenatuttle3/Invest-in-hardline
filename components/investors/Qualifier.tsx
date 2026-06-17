'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { InvestorFormData } from '@/lib/qualify'
import { qualifyInvestor } from '@/lib/qualify'
import RangeSlider from '@/components/investors/RangeSlider'

// Check-size range slider config
const CHECK_MIN = 0
const CHECK_MAX = 5_000_000
const CHECK_STEP = 500_000
const CHECK_LOW_DEFAULT = 500_000
const CHECK_HIGH_DEFAULT = 1_500_000

const formatCheck = (v: number) =>
  v <= 0
    ? '$0'
    : v >= CHECK_MAX
      ? '$5M+'
      : v >= 1_000_000
        ? `$${(v / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`
        : `$${Math.round(v / 1000)}K`

const formatRange = (low: number, high: number) => `${formatCheck(low)} – ${formatCheck(high)}`

type Question =
  | { n: string; tag: string; type: 'multi'; field: 'stage'; q: string; help?: string; options: string[] }
  | { n: string; tag: string; type: 'tap'; field: 'role'; q: string; help?: string; options: string[] }
  | { n: string; tag: string; type: 'range'; field: 'checkSize'; q: string; help?: string }
  | { n: string; tag: string; type: 'open'; field: 'evaluation' | 'whyHardline' | 'valueAdd'; q: string; help?: string }

const QUESTIONS: Question[] = [
  {
    n: '01',
    tag: 'Stage gate',
    type: 'multi',
    field: 'stage',
    q: 'What stage do you usually write your first check at?',
    help: 'Select all that apply.',
    options: ['Pre-seed', 'Seed', 'Series A', 'Later'],
  },
  {
    n: '02',
    tag: 'Check size',
    type: 'range',
    field: 'checkSize',
    q: "What's your typical check size in a round like this?",
    help: 'Drag to set your range.',
  },
  {
    n: '03',
    tag: 'Their bar',
    type: 'open',
    field: 'evaluation',
    q: 'How do you typically evaluate seed-stage companies?',
    help: "What matters most — and do you have any hard revenue or ARR requirements before you'll invest? (e.g. customer count, growth rate, team, design partners.)",
  },
  {
    n: '04',
    tag: 'Homework signal',
    type: 'open',
    field: 'whyHardline',
    q: 'Based on your thesis, why does Hardline look like a fit?',
    help: 'A portfolio company, an LP, the wedge, the market — whatever drew you in. (Backed something like ServiceTitan, Procore, Fireflies, or Granola? Tell us.)',
  },
  {
    n: '05',
    tag: 'Lead capability',
    type: 'tap',
    field: 'role',
    q: 'On a round like ours, do you typically…',
    options: ['Lead', 'Co-lead', 'Follow a lead', 'Depends — can do both'],
  },
  {
    n: '06',
    tag: 'Value-add',
    type: 'open',
    field: 'valueAdd',
    q: 'How would one of your portfolio companies describe what you contribute?',
    help: 'Beyond the check — intros, network, operating help, etc.',
  },
]

const Check = () => (
  <svg
    viewBox="0 0 16 16"
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 8.5l3.5 3.5L13 4" />
  </svg>
)

export default function Qualifier() {
  const router = useRouter()
  const identityRef = useRef<HTMLDivElement>(null)
  const [identityError, setIdentityError] = useState(false)
  const [checkLow, setCheckLow] = useState(CHECK_LOW_DEFAULT)
  const [checkHigh, setCheckHigh] = useState(CHECK_HIGH_DEFAULT)
  const [form, setForm] = useState<Partial<InvestorFormData>>({
    stage: [],
    checkSize: formatRange(CHECK_LOW_DEFAULT, CHECK_HIGH_DEFAULT),
  })

  const update = (key: keyof InvestorFormData, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const toggleStage = (s: string) => {
    const current = form.stage ?? []
    const updated = current.includes(s) ? current.filter(x => x !== s) : [...current, s]
    update('stage', updated)
  }

  const onRangeChange = (low: number, high: number) => {
    setCheckLow(low)
    setCheckHigh(high)
    update('checkSize', formatRange(low, high))
  }

  const handleSubmit = () => {
    if (!form.name?.trim() || !form.firm?.trim()) {
      setIdentityError(true)
      identityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setIdentityError(false)

    const result = qualifyInvestor(form as InvestorFormData)
    sessionStorage.setItem('qualification', JSON.stringify(result))
    sessionStorage.setItem('investorForm', JSON.stringify(form))

    // Deliver answers to the backend (shared to Slack). Fire-and-forget with
    // keepalive so routing to the next page never waits on the network.
    void fetch('/api/qualifier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form, result: result.status }),
      keepalive: true,
    }).catch(() => {})

    if (result.status === 'qualified') {
      router.push('/investors/story')
    } else {
      router.push('/not-a-fit')
    }
  }

  return (
    <main className="hl-dark hl-dark-rich min-h-screen px-6 py-16">
      <div className="mx-auto w-full max-w-2xl animate-fade-up">

        {/* Header */}
        <div className="mb-3 flex items-end justify-between gap-4">
          <span className="section-label inline-block border-b-2 border-mint pb-2">The fit check</span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--hl-text-muted)]">
            ~90 sec · 6 questions
          </span>
        </div>
        <div className="mb-10 border-b border-[color:var(--hl-hairline)]" />

        {/* Identity — required before the questions */}
        <div ref={identityRef} className="card-dark mb-5">
          <div className="flex items-start justify-between gap-4">
            <span className="text-sm font-bold text-mint">00</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--hl-text-muted)]">
              Required · About you
            </span>
          </div>

          <h3 className="hl-h3 mt-3 text-[1.15rem] text-[color:var(--hl-text)]">
            First — who are we talking to?
          </h3>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              required
              placeholder="Your name *"
              autoComplete="name"
              value={form.name ?? ''}
              onChange={e => update('name', e.target.value)}
              className="hl-input"
            />
            <input
              type="text"
              required
              placeholder="Firm / company *"
              autoComplete="organization"
              value={form.firm ?? ''}
              onChange={e => update('firm', e.target.value)}
              className="hl-input"
            />
          </div>

          {identityError && (
            <p className="mt-3 text-sm font-semibold text-[#e8a08a]">
              Please add your name and company before submitting.
            </p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-5">
          {QUESTIONS.map(item => {
            const typeLabel =
              item.type === 'range' ? 'Slider' : item.type === 'open' ? 'Open' : 'Tap'

            return (
              <div key={item.n} className="card-dark">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-bold text-mint">{item.n}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--hl-text-muted)]">
                    {typeLabel} · {item.tag}
                  </span>
                </div>

                <h3 className="hl-h3 mt-3 text-[1.15rem] text-[color:var(--hl-text)]">{item.q}</h3>
                {item.help && <p className="hl-body mt-1.5 text-sm">{item.help}</p>}

                {item.type === 'multi' && (
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {item.options.map(opt => {
                      const active = form.stage?.includes(opt)
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleStage(opt)}
                          data-active={active}
                          className="hl-chip inline-flex items-center gap-1.5 px-4 py-2.5 text-sm"
                        >
                          {active && <Check />}
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                )}

                {item.type === 'tap' && (
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {item.options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => update(item.field, opt)}
                        data-active={form.role === opt}
                        className="hl-chip px-4 py-2.5 text-sm"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {item.type === 'range' && (
                  <div className="mt-5">
                    <RangeSlider
                      min={CHECK_MIN}
                      max={CHECK_MAX}
                      step={CHECK_STEP}
                      low={checkLow}
                      high={checkHigh}
                      onChange={onRangeChange}
                      format={formatCheck}
                    />
                  </div>
                )}

                {item.type === 'open' && (
                  <textarea
                    placeholder="Type your answer…"
                    value={form[item.field] ?? ''}
                    onChange={e => update(item.field, e.target.value)}
                    rows={2}
                    className="hl-input mt-4 resize-none"
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 flex items-center justify-between">
          <Link
            href="/investors"
            className="text-xs font-bold uppercase tracking-widest text-[color:var(--hl-text-muted)] transition-colors hover:text-[color:var(--hl-text)]"
          >
            ← Back
          </Link>
          <button onClick={handleSubmit} className="btn-primary">
            See the story →
          </button>
        </div>

        <p className="mt-8 text-xs text-hardline-300 text-center">
          Your answers are shared only with Alena. This page is not indexed by search engines.
        </p>
      </div>
    </main>
  )
}
