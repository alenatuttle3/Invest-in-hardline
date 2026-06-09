'use client'

import { Fragment, useEffect, useRef, useState, type ComponentType } from 'react'
import { ChevronDown, RadioTower, Route, Waypoints, type LucideProps } from 'lucide-react'

type DevicePill = { label: string; status: 'live' | 'beta' }
type Motif = 'wave' | 'map' | 'sync'

type Layer = {
  index: string
  title: string
  body: string
  Icon: ComponentType<LucideProps>
  motif: Motif
  pills?: DevicePill[]
}

const LAYERS: Layer[] = [
  {
    index: '01',
    title: 'Passive capture layer',
    body: 'No recording, no new phone number. Time-to-value under 5 minutes for the end user — the only app in the world that does this.',
    Icon: RadioTower,
    motif: 'wave',
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
    motif: 'map',
  },
  {
    index: '03',
    title: 'Downstream automation',
    body: 'Daily logs, tasks, and RFIs draft themselves and sync where the work lives — Procore, Autodesk, Fieldwire. The system updates itself.',
    Icon: Route,
    motif: 'sync',
  },
]

const STAGGER = 150 // ms between each layer reveal

/* --- Stage motifs (decorative; the live "data flow" demo) ----------------- */

// Layer 01 — a live phone call, captured: an audio waveform.
function WaveformMotif() {
  return (
    <div aria-hidden="true" className="flex h-14 w-[168px] max-w-full items-center justify-center gap-[3px]">
      {Array.from({ length: 22 }).map((_, i) => (
        <span
          key={i}
          className="hl-wave-bar h-full w-[3px] rounded-full bg-mint"
          style={{ animationDelay: `${(i % 11) * 0.08}s`, opacity: 0.85 }}
        />
      ))}
    </div>
  )
}

// Layer 02 — analysis into a personalized knowledge map: a constellation.
const MAP_NODES = [
  { cx: 90, cy: 60, r: 5.5, d: 0 },
  { cx: 38, cy: 30, r: 4, d: 0.5 },
  { cx: 144, cy: 28, r: 4, d: 0.9 },
  { cx: 152, cy: 84, r: 4, d: 1.3 },
  { cx: 92, cy: 102, r: 4, d: 0.7 },
  { cx: 34, cy: 88, r: 4, d: 1.1 },
]
function KnowledgeMapMotif() {
  const [center, ...spokes] = MAP_NODES
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 180 120"
      className="h-[112px] w-[180px] max-w-full"
      fill="none"
    >
      <g stroke="var(--hl-mint)" strokeWidth="1.5">
        {spokes.map((n, i) => (
          <line
            key={i}
            className="hl-link"
            x1={center.cx}
            y1={center.cy}
            x2={n.cx}
            y2={n.cy}
            style={{ animationDelay: `${n.d}s` }}
          />
        ))}
      </g>
      <g fill="var(--hl-mint)">
        {MAP_NODES.map((n, i) => (
          <circle
            key={i}
            className="hl-node"
            cx={n.cx}
            cy={n.cy}
            r={n.r}
            style={{ animationDelay: `${n.d}s` }}
          />
        ))}
      </g>
    </svg>
  )
}

// Layer 03 — data points flowing into systems of record.
const SYSTEMS = ['Procore', 'Autodesk', 'Fieldwire']
function SyncMotif() {
  return (
    <div aria-hidden="true" className="flex w-[180px] max-w-full flex-col gap-2.5">
      {SYSTEMS.map((name, i) => (
        <div key={name} className="flex items-center gap-2">
          <span className="relative h-px w-7 bg-[color:var(--hl-hairline)]">
            <span
              className="hl-flow-dot-x absolute -top-[3px] left-0 h-1.5 w-1.5 rounded-full bg-mint"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          </span>
          <span className="inline-flex flex-1 items-center gap-1.5 rounded-full bg-[color:var(--hl-base)] px-3 py-1 text-xs font-medium text-[color:var(--hl-text)] shadow-neu-sm">
            <span
              className="hl-node h-1.5 w-1.5 rounded-full bg-mint"
              style={{ animationDelay: `${i * 0.5 + 0.4}s` }}
            />
            {name}
          </span>
        </div>
      ))}
    </div>
  )
}

function StageMotif({ motif }: { motif: Motif }) {
  if (motif === 'wave') return <WaveformMotif />
  if (motif === 'map') return <KnowledgeMapMotif />
  return <SyncMotif />
}

function DevicePillRow({ pills }: { pills: DevicePill[] }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
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

              <div className="mt-4 grid items-center gap-6 md:grid-cols-[1fr_auto]">
                <div>
                  <h3 className="text-lg font-bold text-[color:var(--hl-text)]">{layer.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-[color:var(--hl-text)]">{layer.body}</p>
                </div>
                <div className="flex justify-center md:justify-end md:pl-2">
                  <StageMotif motif={layer.motif} />
                </div>
              </div>

              {layer.pills && <DevicePillRow pills={layer.pills} />}
            </div>

            {i < LAYERS.length - 1 && (
              <div className="flex flex-col items-center py-2" aria-hidden="true">
                <span className="relative h-9 w-px bg-[color:var(--hl-hairline)]">
                  <span
                    className="absolute inset-0 origin-top bg-mint transition-transform duration-500 ease-out"
                    style={{
                      transform: revealed ? 'scaleY(1)' : 'scaleY(0)',
                      transitionDelay: `${delay(i * STAGGER + STAGGER / 2)}ms`,
                    }}
                  />
                  {/* data points flowing down into the next stage */}
                  {revealed && !reduce && (
                    <>
                      <span className="hl-flow-dot absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-mint" />
                      <span
                        className="hl-flow-dot absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-mint"
                        style={{ animationDelay: '0.9s' }}
                      />
                    </>
                  )}
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
