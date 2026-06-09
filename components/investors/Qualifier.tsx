'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { InvestorFormData } from '@/lib/qualify'
import { qualifyInvestor } from '@/lib/qualify'

const STAGES = ['Pre-seed', 'Seed', 'Series A']

// Check-size slider config
const CHECK_MIN = 25_000
const CHECK_MAX = 5_000_000
const CHECK_STEP = 25_000
const CHECK_DEFAULT = 500_000

const formatCheck = (v: number) =>
  v >= CHECK_MAX
    ? '$5M+'
    : v >= 1_000_000
      ? `$${(v / 1_000_000).toFixed(2).replace(/\.?0+$/, '')}M`
      : `$${Math.round(v / 1000)}K`

export default function Qualifier() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [checkSizeUSD, setCheckSizeUSD] = useState(CHECK_DEFAULT)
  const [form, setForm] = useState<Partial<InvestorFormData>>({
    stage: [],
    checkSize: formatCheck(CHECK_DEFAULT),
  })

  const update = (key: keyof InvestorFormData, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const onCheckChange = (v: number) => {
    setCheckSizeUSD(v)
    update('checkSize', formatCheck(v))
  }

  const toggleStage = (s: string) => {
    const current = form.stage ?? []
    const updated = current.includes(s) ? current.filter(x => x !== s) : [...current, s]
    update('stage', updated)
  }

  const handleSubmit = () => {
    const result = qualifyInvestor(form as InvestorFormData)
    // Store result in sessionStorage so next page can read it
    sessionStorage.setItem('qualification', JSON.stringify(result))
    sessionStorage.setItem('investorForm', JSON.stringify(form))

    if (result.status === 'qualified') {
      router.push('/portal')
    } else {
      router.push('/not-a-fit')
    }
  }

  return (
    <main className="hl-dark min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl animate-fade-up">

        {/* Header */}
        <div className="mb-12">
          <p className="section-label-dark mb-4">Hardline — Investor Portal</p>
          <h1 className="hl-h1 text-3xl md:text-[2.4rem]">
            Before we get on a call,<br />
            let&apos;s make sure it&apos;s worth both our time.
          </h1>
          <p className="hl-body mt-5 text-sm">
            Takes 3 minutes. Helps me show you the right context and decide if we&apos;re a fit for each other.
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-10">
          {[1, 2].map(n => (
            <div
              key={n}
              className={`h-1 flex-1 rounded-full transition-all ${
                n <= step ? 'bg-mint' : 'bg-hardline-950/60'
              }`}
            />
          ))}
        </div>

        {/* Step 1 — Thesis + mechanics */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="hl-h3">Your thesis</h2>

            <div>
              <label className="section-label-dark block mb-2">
                What&apos;s your lens on construction tech?
              </label>
              <textarea
                placeholder="e.g. We focus on labor productivity tools for trade contractors..."
                value={form.constructionThesis ?? ''}
                onChange={e => update('constructionThesis', e.target.value)}
                rows={3}
                className="hl-input resize-none"
              />
            </div>

            <div>
              <label className="section-label-dark block mb-2">
                Do you lead, follow, or either?
              </label>
              <div className="flex gap-3">
                {(['lead', 'follow', 'either'] as const).map(opt => (
                  <button
                    key={opt}
                    onClick={() => update('role', opt)}
                    data-active={form.role === opt}
                    className="hl-chip flex-1 py-2.5 text-sm capitalize"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="section-label-dark block mb-2">
                Typical check size
              </label>
              <div className="card-dark !p-5">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-2xl font-medium text-mint">{formatCheck(checkSizeUSD)}</span>
                  <span className="hl-body text-xs">per check</span>
                </div>
                <input
                  type="range"
                  min={CHECK_MIN}
                  max={CHECK_MAX}
                  step={CHECK_STEP}
                  value={checkSizeUSD}
                  onChange={e => onCheckChange(Number(e.target.value))}
                  className="hl-range"
                  aria-label="Typical check size"
                  aria-valuetext={formatCheck(checkSizeUSD)}
                />
                <div className="flex justify-between mt-2 hl-body text-[11px]">
                  <span>{formatCheck(CHECK_MIN)}</span>
                  <span>$5M+</span>
                </div>
              </div>
            </div>

            <div>
              <label className="section-label-dark block mb-2">
                Stage focus (select all that apply)
              </label>
              <div className="flex gap-2">
                {STAGES.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleStage(s)}
                    data-active={form.stage?.includes(s)}
                    className="hl-chip py-2 px-4 text-xs"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.constructionThesis || !form.role}
              className="btn-primary w-full"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2 — Hard requirements */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="hl-h3">Any hard requirements?</h2>
            <p className="hl-body text-sm">
              Helps us both skip the awkward end-of-call realization.
            </p>

            <div>
              <label className="section-label-dark block mb-2">
                Do you need a minimum revenue or ARR threshold to write a check?
              </label>
              <textarea
                placeholder="e.g. We need $50K ARR, or no hard requirements..."
                value={form.revenueRequirement ?? ''}
                onChange={e => update('revenueRequirement', e.target.value)}
                rows={2}
                className="hl-input resize-none"
              />
            </div>

            <div>
              <label className="section-label-dark block mb-2">
                Anything that would be an automatic pass for you?
              </label>
              <textarea
                placeholder="e.g. We don't do enterprise-only SaaS, or we require US-based team..."
                value={form.hardNos ?? ''}
                onChange={e => update('hardNos', e.target.value)}
                rows={2}
                className="hl-input resize-none"
              />
            </div>

            <div>
              <label className="section-label-dark block mb-2">
                Why Hardline specifically? What caught your attention?
              </label>
              <textarea
                placeholder="e.g. Saw you on LinkedIn, referred by..."
                value={form.whyHardline ?? ''}
                onChange={e => update('whyHardline', e.target.value)}
                rows={2}
                className="hl-input resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-outline-dark">
                Back
              </button>
              <button onClick={handleSubmit} className="btn-primary flex-1">
                Show me Hardline →
              </button>
            </div>
          </div>
        )}

        <p className="mt-8 text-xs text-hardline-300 text-center">
          Your answers are shared only with Alena. This page is not indexed by search engines.
        </p>
      </div>
    </main>
  )
}
