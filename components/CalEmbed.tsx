'use client'

import { useEffect } from 'react'
import { CAL_LINK } from '@/lib/cal'

declare global {
  interface Window {
    Cal?: { (...args: unknown[]): void; loaded?: boolean; ns?: Record<string, unknown>; q?: unknown[] }
  }
}

// Loads the official Cal.com embed script once and initializes it. The script
// uses event delegation, so any element carrying `data-cal-link` (added before
// or after load) opens the booking modal on click.
let calInitialized = false

function useCalEmbed() {
  useEffect(() => {
    if (typeof window === 'undefined' || calInitialized) return
    calInitialized = true

    /* eslint-disable */
    // @ts-nocheck — vendored Cal.com loader snippet
    ;(function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) {
        a.q.push(ar)
      }
      const d = C.document
      C.Cal =
        C.Cal ||
        function () {
          const cal = C.Cal
          const ar = arguments
          if (!cal.loaded) {
            cal.ns = {}
            cal.q = cal.q || []
            d.head.appendChild(d.createElement('script')).src = A
            cal.loaded = true
          }
          if (ar[0] === L) {
            const api: any = function () {
              p(api, arguments)
            }
            const namespace = ar[1]
            api.q = api.q || []
            if (typeof namespace === 'string') {
              cal.ns[namespace] = cal.ns[namespace] || api
              p(cal.ns[namespace], ar)
              p(cal, ['initNamespace', namespace])
            } else {
              p(cal, ar)
            }
            return
          }
          p(cal, ar)
        }
    })(window, 'https://app.cal.com/embed/embed.js', 'init')
    /* eslint-enable */

    window.Cal?.('init', { origin: 'https://cal.com' })
  }, [])
}

type BookCallProps = {
  className?: string
  children: React.ReactNode
}

/**
 * Opens the Cal.com booking modal on click. Reuse this anywhere a "book a call"
 * action is needed so the booking integration stays in one place.
 */
export default function BookCall({ className, children }: BookCallProps) {
  useCalEmbed()
  return (
    <button
      type="button"
      className={className}
      data-cal-link={CAL_LINK}
      data-cal-config='{"layout":"month_view"}'
    >
      {children}
    </button>
  )
}
