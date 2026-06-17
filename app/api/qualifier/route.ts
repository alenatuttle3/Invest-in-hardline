import { NextResponse } from 'next/server'
import type { InvestorFormData, SubmissionType } from '@/lib/qualify'

// Delivers investor submissions to Slack via an incoming webhook — the most
// lightweight share target (one env var, no SDK). Set SLACK_WEBHOOK_URL to the
// webhook of the channel that should receive submissions.
//
// Three kinds of submission flow through here:
//   access     — someone entered name/email/fund to unlock the story
//   questions  — pre-meeting answers, sent right before booking a call
//   newsletter — someone opted into follow-along updates

type Submission = {
  type?: SubmissionType
  form: Partial<InvestorFormData>
}

const IDENTITY_FIELDS: [keyof InvestorFormData, string][] = [
  ['name', 'Name'],
  ['email', 'Email'],
  ['fund', 'Fund'],
]

const QUESTION_FIELDS: [keyof InvestorFormData, string][] = [
  ['stage', 'Q1 · First-check stage'],
  ['checkSize', 'Q2 · Typical check size'],
  ['evaluation', 'Q3 · How they evaluate seed-stage companies'],
  ['whyHardline', 'Q4 · Why Hardline looks like a fit'],
  ['role', 'Q5 · Lead capability'],
  ['valueAdd', 'Q6 · What they contribute beyond the check'],
]

const HEADERS: Record<SubmissionType, string> = {
  access: ':wave: *New investor unlocked the story*',
  questions: ':calendar: *Investor is booking a call — pre-meeting answers*',
  newsletter: ':newspaper: *Investor joined the newsletter*',
}

export async function POST(req: Request) {
  let payload: Submission
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const type: SubmissionType = payload.type ?? 'access'

  const fields =
    type === 'questions' ? [...IDENTITY_FIELDS, ...QUESTION_FIELDS] : IDENTITY_FIELDS

  const webhook = process.env.SLACK_WEBHOOK_URL
  if (!webhook) {
    // Don't fail the visitor's flow over a missing config — log so it's
    // visible in server logs and move on.
    console.warn('[qualifier] SLACK_WEBHOOK_URL not set — submission not delivered:', payload)
    return NextResponse.json({ ok: false, error: 'Delivery not configured' })
  }

  const answers = fields.flatMap(([field, label]) => {
    const value = payload.form?.[field]
    const text = (Array.isArray(value) ? value.join(', ') : value)?.trim()
    return text ? [`*${label}*\n${text}`] : []
  })

  const text = [HEADERS[type] ?? HEADERS.access, ...answers].join('\n\n')

  const res = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  if (!res.ok) {
    console.error('[qualifier] Slack webhook failed:', res.status, await res.text())
    return NextResponse.json({ ok: false, error: 'Delivery failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
