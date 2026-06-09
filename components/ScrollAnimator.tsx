'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type ScrollAnimatorProps = {
  children: ReactNode
  className?: string
  /** Stagger this reveal relative to siblings (ms). */
  delay?: number
  /** How much of the element must be visible before it reveals (0–1). */
  threshold?: number
}

/**
 * Reveals its children with the shared `.fade-up` → `.visible` transition once
 * they scroll into view. Uses IntersectionObserver (no animation library) to
 * stay consistent with the rest of the codebase. `prefers-reduced-motion` is
 * honored two ways: we reveal immediately here, and globals.css disables the
 * transition under the reduce query — so content is never hidden from anyone.
 */
export default function ScrollAnimator({
  children,
  className = '',
  delay = 0,
  threshold = 0.15,
}: ScrollAnimatorProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      className={`fade-up ${visible ? 'visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
