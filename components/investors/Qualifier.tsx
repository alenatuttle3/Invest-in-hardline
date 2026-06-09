'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { InvestorFormData } from '@/lib/qualify'
import { qualifyInvestor } from '@/lib/qualify'

const SUBHEAD =
  "A few questions, both directions — so neither of us spends 30 minutes finding out we're not a fit."

type TapField = 'stage' | 'checkSize' | 'role'
type OpenField = 'evaluation' | 'whyHardline' | 'valueAdd'

type Question =
  | { n: string; tag: string; type: 'tap'; field: TapField; q: string; help?: string; options: string[] }
  | { n: string; tag: string; type: 'open'; field: OpenField; q: string; help?: string }

const QUESTIONS: Question[] = [
  {
    n: '01',
    tag: 'Stage gate',
    type: 'tap',
    field: 'stage',
    q: 'What stage do you usually write your first check at?',
    options: ['Pre-seed', 'Seed', 'Series A', 'Later'],
  },
  {
    n: '02',
    tag: 'Check size',
    type: 'tap',
    field: 'checkSize',
    q: "What's your typical check size in a round like this?",
    options: ['Under $250K', '$250K–$500K', '$500K–$1M', '$1M+'],
  },
  {
    n: '03',
    tag: 'Their bar',
    type: 'open',
    field: 'evaluation',
    q: 'How do you typically evaluate seed-stage companies?',
    help: 'e.g. revenue, customer count, growth rate, team, design partners — what matters most to you?',
  },
  {
    n: '04',
    tag: 'Homework signal',
    type: 'open',
    field: 'whyHardline',
    q: 'Based on your thesis, why does Hardline look like a fit?',
    help: 'A portfolio company, an LP, the wedge, the market — whatever drew you in.',
  },
  {
    n: '05',
    tag: 'Lead capability',
    type: 'tap',
    field: 'role',
    q: 'On a round like ours, do you typically…',
    options: ['Lead', 'Co-lead', 'Follow a lead', 'Depends'],
  },
  {
    n: '06',
    tag: 'Value-add',
    type: 'open',
    field: 'valueAdd',
    q: 'How would one of your portfolio companies describe what you actually contribute?',
    help: 'Beyond the check — intros, network, operating help, etc.',
  },
]

export default function Qualifier() {
  const router = useRouter()
  const [form, setForm] = useState<Partial<InvestorFormData>>({})

  const update = (key: keyof InvestorFormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    const result = qualifyInvestor(form as InvestorFormData)
    sessionStorage.setItem('qualification', JSON.stringify(result))
    sessionStorage.setItem('investorForm', JSON.stringify(form))

    if (result.status === 'qualified') {
      router.push('/portal')
    } else {
      router.push('/not-a-fit')
    }
  }

  return (
    <main className="hl-dark min-h-screen px-6 py-16">
      <div className="mx-auto w-full max-w-2xl animate-fade-up">

        {/* Header */}
        <div className="mb-3 flex items-end justify-between gap-4">
          <span className="section-label inline-block border-b-2 border-mint pb-2">The fit check</span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--hl-text-muted)]">
            ~90 sec · 6 questions
          </span>
        </div>
        <div className="border-b border-[color:var(--hl-hairline)]" />
        <p className="hl-body mt-5 mb-10 text-sm">{SUBHEAD}</p>

        {/* Questions */}
        <div className="space-y-5">
          {QUESTIONS.map(item => (
            <div key={item.n} className="card-dark">
              <div className="flex items-start justify-between gap-4">
                <span className="text-sm font-bold text-mint">{item.n}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--hl-text-muted)]">
                  {item.type === 'tap' ? 'Tap' : 'Open'} · {item.tag}
                </span>
              </div>

              <h3 className="hl-h3 mt-3 text-[1.15rem] text-[color:var(--hl-text)]">{item.q}</h3>
              {item.help && <p className="hl-body mt-1.5 text-sm">{item.help}</p>}

              {item.type === 'tap' ? (
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {item.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => update(item.field, opt)}
                      data-active={form[item.field] === opt}
                      className="hl-chip px-4 py-2.5 text-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea
                  placeholder="Type your answer…"
                  value={form[item.field] ?? ''}
                  onChange={e => update(item.field, e.target.value)}
                  rows={2}
                  className="hl-input mt-4 resize-none"
                />
              )}
            </div>
          ))}
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
