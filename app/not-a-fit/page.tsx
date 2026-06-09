'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function NotAFitPage() {
  const [reason, setReason] = useState('')
  const [followUpDate, setFollowUpDate] = useState('')

  useEffect(() => {
    const raw = sessionStorage.getItem('qualification')
    if (raw) {
      const result = JSON.parse(raw)
      setReason(result.reason ?? '')
      setFollowUpDate(result.followUpDate ?? '')
    }
  }, [])

  return (
    <main className="hl-dark min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6 animate-fade-up">
        <p className="section-label-dark">Hardline</p>
        <h1 className="hl-h2 !text-2xl">
          Probably not the right fit right now
        </h1>
        {reason && (
          <p className="hl-body text-sm">{reason}</p>
        )}
        {followUpDate && (
          <p className="hl-body text-sm">
            Check back in {followUpDate} — things move fast.
          </p>
        )}
        <p className="text-hardline-300 text-xs leading-relaxed">
          This isn&apos;t a hard no forever. If the timing or parameters change, reach out directly to{' '}
          <a href="mailto:alena@hardlineapp.com" className="text-mint hover:underline">
            alena@hardlineapp.com
          </a>
        </p>
        <Link
          href="https://hardlineapp.com"
          className="inline-block text-xs text-hardline-300 hover:text-[color:var(--hl-text)] transition-colors mt-4"
        >
          ← Back to hardlineapp.com
        </Link>
      </div>
    </main>
  )
}
