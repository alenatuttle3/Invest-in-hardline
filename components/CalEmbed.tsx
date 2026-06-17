'use client'

import { useEffect } from 'react'
import { CAL_LINK, CAL_NAMESPACE } from '@/lib/cal'

declare global {
  interface Window {
    Cal?: {
      (...args: unknown[]): void
      loaded?: boolean
      ns?: Record<string, (...args: unknown[]) => void>
      q?: unknown[]
      config?: Record<string, unknown>
    }
  }
}

// Loads the official Cal.com embed script once and initializes the event's
// namespace. The script uses event delegation, so any element carrying
// `data-cal-link` + `data-cal-namespace` opens the booking modal on click.
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

    window.Cal?.('init', CAL_NAMESPACE, { origin: 'https://app.cal.com' })
    if (window.Cal) {
      // Forward UTM / query params through to the booking, matching the
      // settings on the Cal.com event.
      window.Cal.config = window.Cal.config || {}
      window.Cal.config.forwardQueryParams = true
      window.Cal.ns?.[CAL_NAMESPACE]?.('ui', {
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    }
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
      data-cal-namespace={CAL_NAMESPACE}
      data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
    >
      {children}
    </button>
  )
}
