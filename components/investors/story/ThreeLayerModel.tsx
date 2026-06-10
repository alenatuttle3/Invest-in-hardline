'use client'

import { Fragment, useEffect, useRef, useState, type ComponentType } from 'react'
import { RadioTower, Route, Waypoints, type LucideProps } from 'lucide-react'

type Motif = 'wave' | 'map' | 'sync'

type Layer = {
  index: string
  title: string
  body: string
  Icon: ComponentType<LucideProps>
  motif: Motif
}

const LAYERS: Layer[] = [
  {
    index: '01',
    title: 'Passive capture layer',
    body: 'Hardline passively captures inbound and outbound calls, on-site meetings, photos, and video — captured without recording or a new phone number. Time-to-value under 5 minutes, the only app in the field that does this. Live on iOS and Android, in beta on Meta glasses and walkie-talkies.',
    Icon: RadioTower,
    motif: 'wave',
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
          className="hl-wave-bar hl-glow-line h-full w-[3px] rounded-full bg-mint"
          style={{ animationDelay: `${(i % 11) * 0.08}s`, opacity: 0.85 }}
        />
      ))}
    </div>
  )
}

// Layer 02 — analysis into a personalized knowledge map: a glowing constellation.
const MAP_NODES = [
  { cx: 92, cy: 60, r: 5.5, d: 0 }, // 0 — center
  { cx: 38, cy: 28, r: 4, d: 0.5 }, // 1 — top-left
  { cx: 148, cy: 26, r: 4, d: 0.9 }, // 2 — top-right
  { cx: 156, cy: 86, r: 4, d: 1.3 }, // 3 — bottom-right
  { cx: 94, cy: 104, r: 4, d: 0.7 }, // 4 — bottom
  { cx: 32, cy: 90, r: 4, d: 1.1 }, // 5 — bottom-left
]
// [from, to, animationDelay] — center spokes + an outer mesh, like the reference.
const MAP_LINKS: [number, number, number][] = [
  [0, 1, 0.1], [0, 2, 0.4], [0, 3, 0.7], [0, 4, 1.0], [0, 5, 1.3],
  [1, 2, 0.3], [2, 3, 0.6], [3, 4, 0.9], [4, 5, 1.2], [5, 1, 1.5],
]
function KnowledgeMapMotif() {
  return (
    <div className="rounded-xl bg-hardline-950 p-3 shadow-[inset_0_1px_4px_rgba(0,0,0,0.55)] ring-1 ring-black/20">
      <svg aria-hidden="true" viewBox="0 0 188 120" className="h-[104px] w-[188px] max-w-full" fill="none">
        <g className="hl-glow-line" stroke="#6FC49F" strokeWidth="1.4">
          {MAP_LINKS.map(([a, b, d], i) => (
            <line
              key={i}
              className="hl-link"
              x1={MAP_NODES[a].cx}
              y1={MAP_NODES[a].cy}
              x2={MAP_NODES[b].cx}
              y2={MAP_NODES[b].cy}
              style={{ animationDelay: `${d}s` }}
            />
          ))}
        </g>
        <g className="hl-glow-node" fill="#6FC49F">
          {MAP_NODES.map((n, i) => (
            <circle key={i} className="hl-node" cx={n.cx} cy={n.cy} r={n.r} style={{ animationDelay: `${n.d}s` }} />
          ))}
        </g>
        {/* bright cores */}
        <g fill="#EAF7F0">
          {MAP_NODES.map((n, i) => (
            <circle
              key={`core-${i}`}
              className="hl-node"
              cx={n.cx}
              cy={n.cy}
              r={Math.max(1.4, n.r * 0.45)}
              style={{ animationDelay: `${n.d}s` }}
            />
          ))}
        </g>
      </svg>
    </div>
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
              className="hl-flow-dot-x hl-glow-dot absolute -top-[3px] left-0 h-1.5 w-1.5 rounded-full bg-mint"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          </span>
          <span className="inline-flex flex-1 items-center gap-1.5 rounded-full bg-[color:var(--hl-base)] px-3 py-1 text-xs font-medium text-[color:var(--hl-text)] shadow-neu-sm">
            <span
              className="hl-node hl-glow-dot h-1.5 w-1.5 rounded-full bg-mint"
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

            </div>

            {i < LAYERS.length - 1 && (
              <div className="flex flex-col items-center py-2" aria-hidden="true">
                {/* w-1.5 wrapper == dot width, so dots center without an x-transform
                    (the flow animation owns `transform`, so we can't rely on it). */}
                <div className="relative h-9 w-1.5">
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[color:var(--hl-hairline)]">
                    <span
                      className="hl-glow-line absolute inset-0 origin-top bg-mint transition-transform duration-500 ease-out"
                      style={{
                        transform: revealed ? 'scaleY(1)' : 'scaleY(0)',
                        transitionDelay: `${delay(i * STAGGER + STAGGER / 2)}ms`,
                      }}
                    />
                  </span>
                  {/* data points flowing down into the next stage */}
                  {revealed && !reduce && (
                    <>
                      <span className="hl-flow-dot hl-glow-dot absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-mint" />
                      <span
                        className="hl-flow-dot hl-glow-dot absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-mint"
                        style={{ animationDelay: '0.9s' }}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </Fragment>
        )
      })}
    </div>
  )
}
