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
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F2ED] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="mb-12">
          <p className="text-xs tracking-widest text-[#8A8A8A] uppercase mb-4">Hardline AI — Investor Portal</p>
          <h1 className="text-3xl font-semibold leading-snug">
            Before we get on a call,<br />
            let's make sure it's worth both our time.
          </h1>
          <p className="mt-4 text-[#8A8A8A] text-sm leading-relaxed">
            Takes 3 minutes. Helps me show you the right context and decide if we're a fit for each other.
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-10">
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className={`h-0.5 flex-1 transition-all ${n <= step ? 'bg-[#E85A1B]' : 'bg-[#2A2A2A]'}`}
            />
          ))}
        </div>

        {/* Step 1 — Who are you */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Who are you?</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={form.name ?? ''}
                onChange={e => update('name', e.target.value)}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E85A1B] transition-colors"
              />
              <input
                type="text"
                placeholder="Firm or fund"
                value={form.firm ?? ''}
                onChange={e => update('firm', e.target.value)}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E85A1B] transition-colors"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email ?? ''}
                onChange={e => update('email', e.target.value)}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E85A1B] transition-colors"
              />
            </div>
            <button
              onClick={() => setStep(2)}
              disabled={!form.name || !form.firm || !form.email}
              className="mt-2 w-full bg-[#E85A1B] text-white py-3 rounded text-sm font-medium disabled:opacity-30 hover:bg-[#d14e14] transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2 — Thesis + mechanics */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Your thesis</h2>

            <div>
              <label className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-2">
                What's your lens on construction tech?
              </label>
              <textarea
                placeholder="e.g. We focus on labor productivity tools for trade contractors..."
                value={form.constructionThesis ?? ''}
                onChange={e => update('constructionThesis', e.target.value)}
                rows={3}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E85A1B] transition-colors resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-2">
                Do you lead, follow, or either?
              </label>
              <div className="flex gap-3">
                {(['lead', 'follow', 'either'] as const).map(opt => (
                  <button
                    key={opt}
                    onClick={() => update('role', opt)}
                    className={`flex-1 py-2.5 rounded text-sm capitalize border transition-colors ${
                      form.role === opt
                        ? 'bg-[#E85A1B] border-[#E85A1B] text-white'
                        : 'bg-[#141414] border-[#2A2A2A] text-[#8A8A8A] hover:border-[#E85A1B]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-2">
                Typical check size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CHECK_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => update('checkSize', size)}
                    className={`py-2 px-3 rounded text-xs border transition-colors ${
                      form.checkSize === size
                        ? 'bg-[#E85A1B] border-[#E85A1B] text-white'
                        : 'bg-[#141414] border-[#2A2A2A] text-[#8A8A8A] hover:border-[#E85A1B]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-2">
                Stage focus (select all that apply)
              </label>
              <div className="flex gap-2">
                {STAGES.map(s => (
                  <button
                    key={s}
                    onClick={() => toggleStage(s)}
                    className={`py-2 px-4 rounded text-xs border transition-colors ${
                      form.stage?.includes(s)
                        ? 'bg-[#E85A1B] border-[#E85A1B] text-white'
                        : 'bg-[#141414] border-[#2A2A2A] text-[#8A8A8A] hover:border-[#E85A1B]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={!form.constructionThesis || !form.role || !form.checkSize}
              className="w-full bg-[#E85A1B] text-white py-3 rounded text-sm font-medium disabled:opacity-30 hover:bg-[#d14e14] transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3 — Hard requirements */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium">Any hard requirements?</h2>
            <p className="text-[#8A8A8A] text-sm">
              Helps us both skip the awkward end-of-call realization.
            </p>

            <div>
              <label className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-2">
                Do you need a minimum revenue or ARR threshold to write a check?
              </label>
              <textarea
                placeholder="e.g. We need $50K ARR, or no hard requirements..."
                value={form.revenueRequirement ?? ''}
                onChange={e => update('revenueRequirement', e.target.value)}
                rows={2}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E85A1B] transition-colors resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-2">
                Anything that would be an automatic pass for you?
              </label>
              <textarea
                placeholder="e.g. We don't do enterprise-only SaaS, or we require US-based team..."
                value={form.hardNos ?? ''}
                onChange={e => update('hardNos', e.target.value)}
                rows={2}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E85A1B] transition-colors resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-2">
                Why Hardline specifically? What caught your attention?
              </label>
              <textarea
                placeholder="e.g. Saw you on LinkedIn, referred by..."
                value={form.whyHardline ?? ''}
                onChange={e => update('whyHardline', e.target.value)}
                rows={2}
                className="w-full bg-[#141414] border border-[#2A2A2A] rounded px-4 py-3 text-sm focus:outline-none focus:border-[#E85A1B] transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#E85A1B] text-white py-3 rounded text-sm font-medium hover:bg-[#d14e14] transition-colors"
            >
              Show me Hardline →
            </button>
          </div>
        )}

        <p className="mt-8 text-xs text-[#4A4A4A] text-center">
          Your answers are shared only with Alena. This page is not indexed by search engines.
        </p>
      </div>
    </main>
  )
}
