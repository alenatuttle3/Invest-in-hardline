'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ACCESS_KEY } from '@/lib/qualify'

// The booking questionnaire is now a pop-up that lives on the story page, so it
// can blur the story behind it. This legacy route just flags the pop-up to open
// and sends visitors to the story.
export default function BookingQuestions() {
  const router = useRouter()

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(ACCESS_KEY)) {
        router.replace('/investors')
        return
      }
      sessionStorage.setItem('openBooking', '1')
    } catch {
      /* sessionStorage unavailable — fail open */
    }
    router.replace('/investors/story')
  }, [router])

  return <main className="hl-light min-h-screen bg-[color:var(--hl-base)]" />
}
