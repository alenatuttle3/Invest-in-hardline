'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import BookCall from '@/components/CalEmbed'

/* =============================================================================
   Voice questionnaire — the pre-meeting questions, answered out loud.

   A lightweight pop-up that asks for the mic, then walks the investor through
   the questions one at a time while transcribing live (Web Speech API). On the
   last question it ships the answers to Slack and hands off to booking.

   This is the product, in miniature: the field talks, Hardline writes it down.
   Everything degrades gracefully to typing — unsupported browser, denied mic,
   or anyone who'd simply rather type.
   ============================================================================= */

export type VoiceAnswers = Record<string, string>

type Q = { field: string; n: string; tag: string; q: string; blurb: string }

// Field keys mirror lib/qualify + the Slack labels in /api/qualifier, so the
// spoken answers land under the right headings in the channel.
const QUESTIONS: Q[] = [
  {
    field: 'stage',
    n: '01',
    tag: 'Stage',
    q: 'What stage do you usually write your first check at?',
    blurb: 'Pre-seed, seed, or Series A. Wherever you typically come in.',
  },
  {
    field: 'checkSize',
    n: '02',
    tag: 'Check size',
    q: "What's your typical check size in a round like this?",
    blurb: 'A rough range is perfect.',
  },
  {
    field: 'evaluation',
    n: '03',
    tag: 'Your bar',
    q: 'How do you evaluate seed-stage companies?',
    blurb: "What matters most, and any hard revenue or traction bars before you'll invest.",
  },
  {
    field: 'whyHardline',
    n: '04',
    tag: 'Why us',
    q: 'Why does Hardline look like a fit for your thesis?',
    blurb: 'The wedge, the market, a portfolio parallel, whatever drew you in.',
  },
  {
    field: 'role',
    n: '05',
    tag: 'Lead capability',
    q: 'On a round like ours, do you lead, co-lead, or follow?',
    blurb: 'Just how you usually play it.',
  },
  {
    field: 'valueAdd',
    n: '06',
    tag: 'Value-add',
    q: 'Beyond the check, what do you bring?',
    blurb: 'Intros, network, operating help. How a portfolio company would describe you.',
  },
]

type Phase = 'permission' | 'question' | 'done'
type Permission = 'prompt' | 'granted' | 'denied'

/* eslint-disable @typescript-eslint/no-explicit-any */
const getSpeechRecognition = (): any =>
  typeof window === 'undefined'
    ? null
    : (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

function MicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" />
    </svg>
  )
}

// Equalizer-style waveform. Bars bounce while listening, rest flat when paused.
// Varied heights + staggered delays keep it from looking mechanical.
const WAVE_BARS = [0.5, 0.8, 1, 0.65, 1, 0.8, 0.5]
function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex h-9 items-center gap-[5px]" aria-hidden="true">
      {WAVE_BARS.map((scale, i) => (
        <span
          key={i}
          className={`voice-wave-bar w-[4px] rounded-full bg-mint${active ? ' is-active' : ''}`}
          style={{
            height: `${Math.round(scale * 100)}%`,
            animationDelay: `${i * 0.09}s`,
            animationDuration: `${0.75 + (i % 3) * 0.12}s`,
          }}
        />
      ))}
    </div>
  )
}

type Props = {
  onClose: () => void
  /** Ships the collected answers (e.g. to Slack). Called once, when they finish. */
  onSubmit: (answers: VoiceAnswers) => void
}

export default function VoiceQuestionnaire({ onClose, onSubmit }: Props) {
  const supported = !!getSpeechRecognition()

  const [phase, setPhase] = useState<Phase>('permission')
  const [permission, setPermission] = useState<Permission>('prompt')
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<VoiceAnswers>({})
  const [interim, setInterim] = useState('')
  const [listening, setListening] = useState(false)

  // Refs the recognition callbacks read so the single long-lived instance always
  // routes speech to the question that's currently on screen.
  const recRef = useRef<any>(null)
  const wantRef = useRef(false)
  const idxRef = useRef(0)
  const answersRef = useRef<VoiceAnswers>({})
  const interimRef = useRef('')
  const submittedRef = useRef(false)

  useEffect(() => {
    idxRef.current = idx
  }, [idx])
  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  // --- Speech recognition: one instance for the modal's life ---------------
  useEffect(() => {
    const SR = getSpeechRecognition()
    if (!SR) return
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (e: any) => {
      let interimStr = ''
      let finalStr = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) finalStr += r[0].transcript
        else interimStr += r[0].transcript
      }
      if (finalStr) {
        const field = QUESTIONS[idxRef.current].field
        const prev = answersRef.current[field] ?? ''
        const next = `${prev} ${finalStr}`.replace(/\s+/g, ' ').trim()
        answersRef.current = { ...answersRef.current, [field]: next }
        setAnswers(answersRef.current)
      }
      interimRef.current = interimStr
      setInterim(interimStr)
    }

    rec.onerror = (e: any) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        wantRef.current = false
        setPermission('denied')
        setListening(false)
      }
      // 'no-speech' / 'aborted' fall through to onend, which restarts if wanted.
    }

    rec.onend = () => {
      if (wantRef.current) {
        try {
          rec.start()
        } catch {
          /* already starting — ignore */
        }
      } else {
        setListening(false)
      }
    }

    recRef.current = rec
    return () => {
      wantRef.current = false
      try {
        rec.abort()
      } catch {
        /* noop */
      }
      recRef.current = null
    }
  }, [])

  const startListening = useCallback(() => {
    const rec = recRef.current
    if (!rec) return
    wantRef.current = true
    try {
      rec.start()
      setListening(true)
    } catch {
      /* start() throws if already running — that's fine */
    }
  }, [])

  // Fold any still-interim words into the saved answer for the current question,
  // so nothing spoken is lost when the mic pauses or we move on.
  const commitInterim = useCallback(() => {
    const add = interimRef.current.trim()
    if (add) {
      const field = QUESTIONS[idxRef.current].field
      const prev = answersRef.current[field] ?? ''
      const next = `${prev} ${add}`.replace(/\s+/g, ' ').trim()
      answersRef.current = { ...answersRef.current, [field]: next }
      setAnswers(answersRef.current)
    }
    interimRef.current = ''
    setInterim('')
  }, [])

  const stopListening = useCallback(() => {
    wantRef.current = false
    try {
      recRef.current?.stop()
    } catch {
      /* noop */
    }
    setListening(false)
    commitInterim()
  }, [commitInterim])

  // --- Modal chrome: lock scroll, close on Escape --------------------------
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  // --- Flow ----------------------------------------------------------------
  const enableMic = async () => {
    if (!supported) {
      // No speech engine — just let them type.
      setPhase('question')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(t => t.stop()) // recognition opens its own
      setPermission('granted')
      setPhase('question')
      startListening()
    } catch {
      setPermission('denied')
      setPhase('question')
    }
  }

  const setAnswer = (field: string, value: string) => {
    answersRef.current = { ...answersRef.current, [field]: value }
    setAnswers(answersRef.current)
  }

  const goTo = (dest: number) => {
    commitInterim() // save the current question's spoken tail before switching
    setIdx(dest)
  }

  const finish = () => {
    stopListening()
    if (!submittedRef.current) {
      submittedRef.current = true
      onSubmit(answersRef.current)
    }
    setPhase('done')
  }

  const next = () => {
    if (idx < QUESTIONS.length - 1) goTo(idx + 1)
    else finish()
  }

  const back = () => {
    if (idx > 0) goTo(idx - 1)
  }

  const toggleMic = () => {
    if (listening) stopListening()
    else startListening()
  }

  const q = QUESTIONS[idx]
  const progress = ((idx + 1) / QUESTIONS.length) * 100
  const canVoice = supported && permission === 'granted'

  // The box shows the live transcript inline (committed words + the not-yet-final
  // tail) and stays editable — type, edit, or delete anytime. Editing folds any
  // pending interim into the saved answer so nothing is lost or duplicated.
  const committed = answers[q?.field] ?? ''
  const boxValue = listening && interim ? `${committed}${committed ? ' ' : ''}${interim}` : committed

  const onEdit = (value: string) => {
    if (interimRef.current) {
      interimRef.current = ''
      setInterim('')
    }
    setAnswer(q.field, value)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="A few questions before we meet"
    >
      {/* Backdrop — just blur the page behind, no dark fill */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[rgba(12,26,18,0.06)] backdrop-blur-md"
      />

      {/* Card */}
      <div className="hl-dark hl-dark-rich animate-modal-in relative w-full max-w-lg overflow-hidden rounded-[22px] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:p-9">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 text-[color:var(--hl-text-muted)] transition-colors hover:text-[color:var(--hl-text)]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {phase === 'permission' && (
          <div className="flex flex-col items-center text-center">
            <div className="icon-neumorph-dark h-16 w-16 text-mint">
              <MicIcon className="h-7 w-7" />
            </div>
            <h2 className="hl-h3 mt-6 text-[color:var(--hl-text)]">
              A few quick questions. Just talk.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[color:var(--hl-text-muted)]">
              {supported ? (
                <>
                  We&apos;ll ask six short questions. Answer out loud and Hardline transcribes as you
                  go, the same way it works on site. Takes about 90 seconds.
                </>
              ) : (
                <>
                  Your browser doesn&apos;t support live transcription, so you can type your answers
                  instead. Six short questions, about 90 seconds.
                </>
              )}
            </p>

            <button type="button" onClick={enableMic} className="btn-primary mt-7 w-full sm:w-auto">
              {supported ? 'Enable microphone & start' : 'Start'}
            </button>
            <p className="mt-4 text-xs text-hardline-300">
              {supported
                ? 'Your browser will ask for mic access. Answers go only to Alena.'
                : 'Answers go only to Alena.'}
            </p>

            <BookCall
              className="mt-6 text-xs font-bold uppercase tracking-widest text-[color:var(--hl-text-muted)] transition-colors hover:text-[color:var(--hl-text)]"
            >
              Skip and just book a time →
            </BookCall>
          </div>
        )}

        {phase === 'question' && (
          <div>
            {/* Progress */}
            <div className="text-[11px] font-bold uppercase tracking-widest text-[color:var(--hl-text-muted)]">
              <span className="text-mint">{q.n}</span> / 0{QUESTIONS.length}
            </div>
            <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-[color:var(--hl-hairline)]">
              <div
                className="h-full rounded-full bg-mint transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Question */}
            <h2 className="hl-h3 mt-6 text-[1.3rem] text-[color:var(--hl-text)]">{q.q}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--hl-text-muted)]">{q.blurb}</p>

            {/* Answer box — live transcript appears inline; always editable. */}
            <div className="mt-5">
              <textarea
                value={boxValue}
                onChange={e => onEdit(e.target.value)}
                rows={3}
                placeholder={canVoice ? 'Start speaking, or type your answer…' : 'Type your answer…'}
                className="hl-input resize-none text-[0.95rem] leading-relaxed"
              />
            </div>

            {/* Listening indicator — a passive waveform with a pause control on
                the side, so nothing reads as a button you must press to talk. */}
            {canVoice ? (
              <div className="mt-5 flex items-center justify-center gap-4">
                <Waveform active={listening} />
                <button
                  type="button"
                  onClick={toggleMic}
                  aria-label={listening ? 'Pause' : 'Resume'}
                  aria-pressed={!listening}
                  className="icon-neumorph-dark flex h-11 w-11 items-center justify-center rounded-full text-mint"
                >
                  {listening ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                      <rect x="6" y="5" width="4" height="14" rx="1.5" />
                      <rect x="14" y="5" width="4" height="14" rx="1.5" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5z" />
                    </svg>
                  )}
                </button>
              </div>
            ) : (
              permission === 'denied' && (
                <p className="mt-1 rounded-input bg-[rgba(255,255,255,0.04)] px-4 py-3 text-xs leading-relaxed text-hardline-300">
                  Microphone access is off, so go ahead and type. To use voice, allow mic access in
                  your browser and reopen this.
                </p>
              )
            )}

            {/* Controls */}
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={back}
                disabled={idx === 0}
                className="text-xs font-bold uppercase tracking-widest text-[color:var(--hl-text-muted)] transition-colors enabled:hover:text-[color:var(--hl-text)] disabled:opacity-30"
              >
                ← Back
              </button>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={next}
                  className="text-xs font-bold uppercase tracking-widest text-[color:var(--hl-text-muted)] transition-colors hover:text-[color:var(--hl-text)]"
                >
                  Skip
                </button>
                <button type="button" onClick={next} className="btn-primary">
                  {idx === QUESTIONS.length - 1 ? 'Done →' : 'Next →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === 'done' && (
          <div className="flex flex-col items-center text-center">
            <div className="icon-neumorph-dark h-16 w-16 text-mint">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 12.5l5 5L20 6" />
              </svg>
            </div>
            <h2 className="hl-h3 mt-6 text-[color:var(--hl-text)]">Got it. Thank you.</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[color:var(--hl-text-muted)]">
              Your answers are on their way to Alena. Grab a time and we&apos;ll make the call count.
            </p>
            <BookCall className="btn-primary mt-7 w-full sm:w-auto">
              Book a time →
            </BookCall>
          </div>
        )}
      </div>
    </div>
  )
}
