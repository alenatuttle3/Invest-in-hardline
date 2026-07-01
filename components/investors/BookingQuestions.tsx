'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BookCall from '@/components/CalEmbed'
import VoiceQuestionnaire, { type VoiceAnswers } from '@/components/investors/VoiceQuestionnaire'
import { ACCESS_KEY, type InvestorFormData } from '@/lib/qualify'

// Small mic glyph reused on the launch button.
function MicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" />
    </svg>
  )
}

export default function BookingQuestions() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Hard gate: booking lives behind the access form, same as the story.
  useEffect(() => {
    try {
      if (!sessionStorage.getItem(ACCESS_KEY)) router.replace('/investors')
    } catch {
      /* sessionStorage unavailable — fail open */
    }
  }, [router])

  // Ships the spoken answers to Slack, merged with whatever the access gate
  // captured. Runs once, when the questionnaire finishes.
  const submitAnswers = (answers: VoiceAnswers) => {
    let access: Partial<InvestorFormData> = {}
    try {
      access = JSON.parse(sessionStorage.getItem(ACCESS_KEY) ?? '{}')
    } catch {
      access = {}
    }

    const full = { ...access, ...answers }
    void fetch('/api/qualifier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'questions', form: full }),
      keepalive: true,
    }).catch(() => {})
  }

  return (
    <main className="hl-dark hl-dark-rich min-h-screen px-6 py-16">
      <div className="mx-auto w-full max-w-2xl animate-fade-up">
        {/* Header */}
        <div className="mb-3 flex items-end justify-between gap-4">
          <span className="section-label inline-block border-b-2 border-mint pb-2">Before we meet</span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--hl-text-muted)]">
            ~90 sec · optional
          </span>
        </div>
        <div className="mb-10 border-b border-[color:var(--hl-hairline)]" />

        {/* Hero — voice-forward */}
        <h1 className="hl-h2 text-[color:var(--hl-text)]">
          Tell us a bit about you — just talk.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--hl-text-muted)]">
          A few quick questions before we meet. Answer them out loud and Hardline transcribes as you
          go — the same way it works on a jobsite. All optional; skip anything you like.
        </p>

        {/* Launch card */}
        <div className="card-dark mt-10 flex flex-col items-center gap-5 py-10 text-center">
          <div className="icon-neumorph-dark h-16 w-16 text-mint">
            <MicIcon className="h-7 w-7" />
          </div>
          <div>
            <p className="text-lg font-bold text-[color:var(--hl-text)]">Answer out loud</p>
            <p className="mt-1.5 text-sm text-[color:var(--hl-text-muted)]">
              Six short questions · about 90 seconds
            </p>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="btn-primary">
            Start · answer out loud →
          </button>
        </div>

        {/* Secondary: skip straight to booking */}
        <div className="mt-10 flex items-center justify-between">
          <Link
            href="/investors/story"
            className="text-xs font-bold uppercase tracking-widest text-[color:var(--hl-text-muted)] transition-colors hover:text-[color:var(--hl-text)]"
          >
            ← Back to the story
          </Link>
          <BookCall className="btn-outline-dark">Skip to booking →</BookCall>
        </div>

        <p className="mt-8 text-center text-xs text-hardline-300">
          Your answers are shared only with Alena. This page is not indexed by search engines.
        </p>
      </div>

      {open && (
        <VoiceQuestionnaire onClose={() => setOpen(false)} onSubmit={submitAnswers} />
      )}
    </main>
  )
}
