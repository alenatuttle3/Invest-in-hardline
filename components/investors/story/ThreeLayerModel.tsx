'use client'

import { Fragment, useEffect, useRef, useState, type ComponentType } from 'react'
import { ChevronDown, RadioTower, Route, Waypoints, type LucideProps } from 'lucide-react'

type DevicePill = { label: string; status: 'live' | 'beta' }

type Layer = {
  index: string
  title: string
  body: string
  Icon: ComponentType<LucideProps>
  pills?: DevicePill[]
}

const LAYERS: Layer[] = [
  {
    index: '01',
    title: 'Passive capture layer',
    body: 'No recording, no new phone number. Time-to-value under 5 minutes for the end user — the only app in the world that does this.',
    Icon: RadioTower,
    pills: [
      { label: 'iOS · live', status: 'live' },
      { label: 'Android · live', status: 'live' },
      { label: 'iPad & Mac', status: 'live' },
      { label: 'Meta glasses · beta', status: 'beta' },
      { label: 'Walkie-talkies · beta', status: 'beta' },
    ],
  },
  {
    index: '02',
    title: 'Analysis & knowledge map',
    body: 'Voice, photos, and video — analyzed into a personalized knowledge map for every user. Data that never existed before, and the moat that compounds.',
    Icon: Waypoints,
  },
  {
    index: '03',
    title: 'Downstream automation',
    body: 'Daily logs, tasks, and RFIs draft themselves and sync where the work lives — Procore, Autodesk, Fieldwire. The system updates itself.',
    Icon: Route,
  },
]

const STAGGER = 150 // ms between each layer reveal

function DevicePillRow({ pills }: { pills: DevicePill[] }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {pills.map(pill =>
        pill.status === 'live' ? (
          <span
            key={pill.label}
            className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--hl-base)] px-3 py-1 text-xs font-medium text-[color:var(--hl-text)] shadow-neu-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-mint" aria-hidden="true" />
            {pill.label}
          </span>
        ) : (
          <span
            key={pill.label}
            className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-mint/60 px-3 py-1 text-xs font-medium text-hardline-800"
          >
            <span className="h-1.5 w-1.5 rounded-full ring-1 ring-inset ring-mint/70" aria-hidden="true" />
            {pill.label}
          </span>
        ),
      )}
    </div>
  )
}

export default function ThreeLayerModel() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduce(true)
      setActive(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setActive(true)
          obs.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const revealed = reduce || active
  const delay = (n: number) => (reduce ? 0 : n)

  return (
    <div ref={ref} className="relative">
      {LAYERS.map((layer, i) => {
        const { Icon } = layer
        return (
          <Fragment key={layer.index}>
            <div
              className={`card transition-all duration-500 ease-out ${
                revealed ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}
              style={{ transitionDelay: `${delay(i * STAGGER)}ms` }}
            >
              <div className="flex items-start justify-between gap-4">
                <span className="icon-neumorph shrink-0">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-sm font-semibold tracking-widest text-hardline-800">
                  {layer.index}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-[color:var(--hl-text)]">{layer.title}</h3>
              <p className="mt-1.5 leading-relaxed text-[color:var(--hl-text)]">{layer.body}</p>

              {layer.pills && <DevicePillRow pills={layer.pills} />}
            </div>

            {i < LAYERS.length - 1 && (
              <div className="flex flex-col items-center py-2" aria-hidden="true">
                <span className="relative h-9 w-px overflow-hidden bg-[color:var(--hl-hairline)]">
                  <span
                    className="absolute inset-0 origin-top bg-mint transition-transform duration-500 ease-out"
                    style={{
                      transform: revealed ? 'scaleY(1)' : 'scaleY(0)',
                      transitionDelay: `${delay(i * STAGGER + STAGGER / 2)}ms`,
                    }}
                  />
                </span>
                <ChevronDown
                  className="-mt-1 h-4 w-4 text-mint transition-opacity duration-500"
                  style={{
                    opacity: revealed ? 1 : 0,
                    transitionDelay: `${delay((i + 1) * STAGGER)}ms`,
                  }}
                />
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
