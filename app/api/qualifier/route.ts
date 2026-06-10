import { NextResponse } from 'next/server'
import type { InvestorFormData } from '@/lib/qualify'

// Delivers fit-check submissions to Slack via an incoming webhook — the most
// lightweight share target (one env var, no SDK). Set SLACK_WEBHOOK_URL to the
// webhook of the channel that should receive submissions.

type Submission = {
  form: Partial<InvestorFormData>
  result: string
}

const FIELDS: [keyof InvestorFormData, string][] = [
  ['name', 'Name'],
  ['firm', 'Firm'],
  ['email', 'Email'],
  ['stage', 'Q1 · First-check stage'],
  ['checkSize', 'Q2 · Typical check size'],
  ['evaluation', 'Q3 · How they evaluate seed-stage companies'],
  ['whyHardline', 'Q4 · Why Hardline looks like a fit'],
  ['role', 'Q5 · Lead capability'],
  ['valueAdd', 'Q6 · What they contribute beyond the check'],
]

export async function POST(req: Request) {
  let payload: Submission
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const webhook = process.env.SLACK_WEBHOOK_URL
  if (!webhook) {
    // Don't fail the visitor's flow over a missing config — log so it's
    // visible in server logs and move on.
    console.warn('[qualifier] SLACK_WEBHOOK_URL not set — submission not delivered:', payload)
    return NextResponse.json({ ok: false, error: 'Delivery not configured' })
  }

  const answers = FIELDS.flatMap(([field, label]) => {
    const value = payload.form?.[field]
    const text = (Array.isArray(value) ? value.join(', ') : value)?.trim()
    return text ? [`*${label}*\n${text}`] : []
  })

  const verdict =
    payload.result === 'qualified' ? 'Qualified ✅' : `Routed: ${payload.result || 'unknown'}`
  const text = [`:incoming_envelope: *New investor fit check* — ${verdict}`, ...answers].join(
    '\n\n',
  )

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
