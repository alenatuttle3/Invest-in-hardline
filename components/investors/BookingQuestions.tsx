'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import VoiceQuestionnaire, { type VoiceAnswers } from '@/components/investors/VoiceQuestionnaire'
import { ACCESS_KEY, type InvestorFormData } from '@/lib/qualify'

// The booking route is just a host for the voice questionnaire pop-up. Landing
// here (from the story's "Book a meeting" CTA) opens it straight away — blurb →
// questions → booking — with no intermediate screen. Dismissing returns to the
// story.
export default function BookingQuestions() {
  const router = useRouter()
  // Opens after mount only — keeps the pop-up client-side (it branches on
  // browser mic/speech support, which would otherwise mismatch SSR).
  const [open, setOpen] = useState(false)

  // Hard gate: booking lives behind the access form, same as the story.
  useEffect(() => {
    try {
      if (!sessionStorage.getItem(ACCESS_KEY)) {
        router.replace('/investors')
        return
      }
    } catch {
      /* sessionStorage unavailable — fail open */
    }
    setOpen(true)
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

  const dismiss = () => {
    setOpen(false)
    router.push('/investors/story')
  }

  return (
    <main className="hl-dark hl-dark-rich min-h-screen">
      {open && <VoiceQuestionnaire onClose={dismiss} onSubmit={submitAnswers} />}
    </main>
  )
}
