'use client'

import { useState } from 'react'
import { ACCESS_KEY, type InvestorFormData } from '@/lib/qualify'

type State = 'idle' | 'saving' | 'done'

/**
 * One-click "follow along" opt-in. The visitor already gave us their email at
 * the access gate, so this just reuses it — no second form. Confirms inline.
 */
export default function NewsletterSignup({ className }: { className?: string }) {
  const [state, setState] = useState<State>('idle')

  const handleClick = () => {
    if (state !== 'idle') return
    setState('saving')

    let access: Partial<InvestorFormData> = {}
    try {
      access = JSON.parse(sessionStorage.getItem(ACCESS_KEY) ?? '{}')
    } catch {
      access = {}
    }

    void fetch('/api/qualifier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'newsletter', form: access }),
      keepalive: true,
    })
      .catch(() => {})
      .finally(() => setState('done'))
  }

  if (state === 'done') {
    return (
      <span className={`${className ?? ''} cursor-default`} aria-live="polite">
        You’re on the list ✓
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === 'saving'}
      className={className}
    >
      {state === 'saving' ? 'Adding you…' : 'Follow along →'}
    </button>
  )
}
