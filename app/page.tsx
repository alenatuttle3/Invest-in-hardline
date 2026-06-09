'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { InvestorFormData } from '@/lib/qualify'
import { qualifyInvestor } from '@/lib/qualify'

const CHECK_SIZES = ['Under $250K', '$250K–$500K', '$500K–$1M', '$1M–$3M', '$3M–$5M', '$5M+']
const STAGES = ['Pre-seed', 'Seed', 'Series A']

export default function QualifierPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<Partial<InvestorFormData>>({
    stage: [],
  })

  const update = (key: keyof InvestorFormData, value: unknown) => {
    setForm(prev => ({ ...prev, [key]: value }))
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
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className={`h-1 flex-1 rounded-full transition-all ${
                n <= step ? 'bg-mint' : 'bg-hardline-950/60'
              }`}
            />
          ))}
        </div>

        {/* Step 1 — Who are you */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="hl-h3">Who are you?</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={form.name ?? ''}
                onChange={e => update('name', e.target.value)}
                className="hl-input"
              />
              <input
                type="text"
                placeholder="Firm or fund"
                value={form.firm ?? ''}
                onChange={e => update('firm', e.target.value)}
                className="hl-input"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email ?? ''}
                onChange={e => update('email', e.target.value)}
                className="hl-input"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!form.name || !form.firm || !form.email}
              className="btn-primary mt-2 w-full"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2 — Thesis + mechanics */}
        {step === 2 && (
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
              <div className="grid grid-cols-3 gap-2">
                {CHECK_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => update('checkSize', size)}
                    data-active={form.checkSize === size}
                    className="hl-chip py-2 px-3 text-xs"
                  >
                    {size}
                  </button>
                ))}
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

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-outline-dark">
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.constructionThesis || !form.role || !form.checkSize}
                className="btn-primary flex-1"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Hard requirements */}
        {step === 3 && (
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
              <button onClick={() => setStep(2)} className="btn-outline-dark">
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
