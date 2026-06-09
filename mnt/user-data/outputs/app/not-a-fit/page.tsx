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
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F2ED] flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6">
        <p className="text-xs text-[#8A8A8A] uppercase tracking-widest">Hardline AI</p>
        <h1 className="text-2xl font-semibold leading-snug">
          Probably not the right fit right now
        </h1>
        {reason && (
          <p className="text-[#8A8A8A] text-sm leading-relaxed">{reason}</p>
        )}
        {followUpDate && (
          <p className="text-[#8A8A8A] text-sm">
            Check back in {followUpDate} — things move fast.
          </p>
        )}
        <p className="text-[#4A4A4A] text-xs leading-relaxed">
          This isn't a hard no forever. If the timing or parameters change, reach out directly to{' '}
          <a href="mailto:alena@hardlineapp.com" className="text-[#E85A1B] hover:underline">
            alena@hardlineapp.com
          </a>
        </p>
        <Link
          href="https://hardlineapp.com"
          className="inline-block text-xs text-[#8A8A8A] hover:text-[#F5F2ED] transition-colors mt-4"
        >
          ← Back to hardlineapp.com
        </Link>
      </div>
    </main>
  )
}
