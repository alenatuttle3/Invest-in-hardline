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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Post to the Slack webhook, retrying transient failures (network errors, rate
// limits, 5xx). A single attempt used to drop a lead permanently on any blip —
// these submissions are rare and high-value, so it's worth a few retries.
async function deliverToSlack(webhook: string, text: string): Promise<{ ok: true } | { ok: false; detail: string }> {
  const MAX_ATTEMPTS = 3
  let lastDetail = 'unknown error'

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      if (res.ok) return { ok: true }

      lastDetail = `${res.status} ${await res.text().catch(() => '')}`.trim()
      // 4xx other than 429 won't get better on retry — give up immediately.
      if (res.status < 500 && res.status !== 429) break
    } catch (err) {
      lastDetail = err instanceof Error ? err.message : String(err)
    }

    if (attempt < MAX_ATTEMPTS) await sleep(300 * attempt) // 300ms, then 600ms
  }

  return { ok: false, detail: lastDetail }
}

export async function POST(req: Request) {
  let payload: Submission
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const type: SubmissionType = payload.type ?? 'access'

  // Durable backstop: log every submission in full, up front, so the answers are
  // always recoverable from server logs even if Slack delivery later fails.
  console.log('[qualifier] submission received:', JSON.stringify({ type, form: payload.form }))

  const fields =
    type === 'questions' ? [...IDENTITY_FIELDS, ...QUESTION_FIELDS] : IDENTITY_FIELDS

  const answers = fields.flatMap(([field, label]) => {
    const value = payload.form?.[field]
    const text = (Array.isArray(value) ? value.join(', ') : value)?.trim()
    return text ? [`*${label}*\n${text}`] : []
  })

  const text = [HEADERS[type] ?? HEADERS.access, ...answers].join('\n\n')

  const webhook = process.env.SLACK_WEBHOOK_URL?.trim()
  if (!webhook) {
    // Missing config would otherwise drop the lead silently. Log the full
    // submission at error level so it's recoverable from server logs, and
    // return a 500 so the failure is visible to callers/monitoring.
    console.error('[qualifier] SLACK_WEBHOOK_URL not set — submission NOT delivered:', JSON.stringify(payload))
    return NextResponse.json({ ok: false, error: 'Delivery not configured' }, { status: 500 })
  }

  const result = await deliverToSlack(webhook, text)
  if (!result.ok) {
    // Delivery failed after retries. Log the full submission so the lead can be
    // recovered from logs, not just the failure status.
    console.error(
      '[qualifier] Slack delivery failed after retries:',
      result.detail,
      '— submission:',
      JSON.stringify(payload),
    )
    return NextResponse.json({ ok: false, error: 'Delivery failed' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
