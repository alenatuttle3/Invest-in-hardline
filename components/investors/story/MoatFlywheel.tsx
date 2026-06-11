'use client'

import { useEffect, useRef, useState } from 'react'

/* Scroll-driven flywheel: four nodes on a circle whose arcs draw in sequence.
   On desktop the wheel pins centered in the viewport while the scroll drives
   the draw, then releases and scrolls off once the loop closes. When the loop
   completes, particles circulate continuously — the wheel feeds itself.
   prefers-reduced-motion renders the completed loop with no particles. */

const STEPS = [
  { n: '01', title: 'Passive capture', body: 'Field data collected with zero behavior change.' },
  {
    n: '02',
    title: 'Immediate value',
    body: 'Most construction tech is built for someone else. Hardline pays off for the user on the first call.',
  },
  { n: '03', title: 'Stickiness', body: 'Every conversation raises the switching cost.' },
  {
    n: '04',
    title: 'Intelligence',
    body: "The knowledge map becomes the job's context store — powering completely touchless project management.",
  },
]

// Card slots clockwise from top-left, matching the node order on the circle.
const CORNERS = [
  'md:top-0 md:left-0',
  'md:top-0 md:right-0',
  'md:bottom-0 md:right-0',
  'md:bottom-0 md:left-0',
]

const C = 220
const R = 150
const GAP = 16 // degrees of clearance around each node
const NODE_DEG = [-135, -45, 45, 135] // clockwise from top-left (SVG y points down)

const rad = (d: number) => (d * Math.PI) / 180
const pt = (deg: number) => ({ x: C + R * Math.cos(rad(deg)), y: C + R * Math.sin(rad(deg)) })
const clamp = (v: number) => Math.min(1, Math.max(0, v))

function arcPath(fromDeg: number, toDeg: number) {
  const a = pt(fromDeg)
  const b = pt(toDeg)
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${R} ${R} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
}

const FULL_CIRCLE = `M ${C + R} ${C} A ${R} ${R} 0 1 1 ${C - R} ${C} A ${R} ${R} 0 1 1 ${C + R} ${C}`

export default function MoatFlywheel() {
  const ref = useRef<HTMLDivElement>(null)
  const [p, setP] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setP(1)
      return
    }
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (rect.height > vh * 1.5) {
        // Pinned (desktop): nothing happens until the wheel is stuck centered,
        // then scroll drives the draw, then it unpins and scrolls off.
        setP(clamp(-rect.top / (rect.height - vh)))
      } else {
        // Stacked (mobile): draw as the wheel crosses the viewport.
        const start = vh * 0.92
        const end = vh * 0.45
        setP(clamp((start - rect.top) / (rect.height + (start - end))))
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Arc i (node i → node i+1) draws over its slice; the loop closes at ~77%
  // of the pinned scroll so the finished, self-feeding wheel holds center
  // stage for a beat before it releases.
  const seg = (i: number) => clamp((p - i * 0.2) / 0.17)
  const nodeOn = (i: number) => (i === 0 ? p > 0.02 : seg(i - 1) > 0.96)
  const done = seg(3) > 0.99

  return (
    <div ref={ref} className="relative mt-8 md:h-[220vh]">
      <div className="md:sticky md:top-0 md:flex md:h-screen md:items-center">
        <div className="relative w-full md:h-[560px]">
          <svg
            viewBox="0 0 440 440"
            aria-hidden="true"
            className="mx-auto block w-[300px] max-w-full md:absolute md:left-1/2 md:top-1/2 md:w-[400px] md:-translate-x-1/2 md:-translate-y-1/2"
          >
            {/* faint full track */}
            <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(31,63,51,0.1)" strokeWidth="1.5" />

            {/* arcs draw clockwise as you scroll */}
            {NODE_DEG.map((d, i) => (
              <path
                key={d}
                d={arcPath(d + GAP, d + 90 - GAP)}
                fill="none"
                stroke="#59af8c"
                strokeWidth="2.5"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - seg(i)}
              />
            ))}

            {/* nodes light up as the loop reaches them */}
            {NODE_DEG.map((d, i) => {
              const { x, y } = pt(d)
              return (
                <g key={d} opacity={nodeOn(i) ? 1 : 0.25} style={{ transition: 'opacity .4s ease' }}>
                  <circle cx={x} cy={y} r={16} fill="rgba(89,175,140,0.15)" />
                  <circle cx={x} cy={y} r={7} fill="#59af8c" />
                  <circle cx={x} cy={y} r={11} fill="none" stroke="#1f3f33" strokeOpacity="0.35" strokeWidth="1" />
                </g>
              )
            })}

            {/* center label */}
            <text x={C} y={C - 12} textAnchor="middle" fontSize="15" fontWeight="700" fill="#1f3f33" letterSpacing="2">
              DATA &amp;
            </text>
            <text x={C} y={C + 10} textAnchor="middle" fontSize="15" fontWeight="700" fill="#1f3f33" letterSpacing="2">
              INTELLIGENCE
            </text>
            <text x={C} y={C + 34} textAnchor="middle" fontSize="11" fontWeight="700" fill="#59af8c" letterSpacing="3">
              THE MOAT
            </text>

            {/* once the loop closes, it feeds itself */}
            <g className="motion-reduce:hidden" style={{ opacity: done ? 1 : 0, transition: 'opacity .6s ease' }}>
              {[0, 1, 2].map(k => (
                <circle key={k} r="3.5" fill="#59af8c">
                  <animateMotion dur="9s" repeatCount="indefinite" begin={`${k * 3}s`} path={FULL_CIRCLE} />
                </circle>
              ))}
            </g>
          </svg>

          {/* step cards — circle corners on desktop, stacked on mobile */}
          <div className="mt-6 grid gap-4 md:mt-0 md:block">
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className={`card md:absolute md:w-[230px] ${CORNERS[i]}`}
                style={{ opacity: nodeOn(i) ? 1 : 0.4, transition: 'opacity .4s ease' }}
              >
                <p className="text-xs font-bold text-mint">{s.n}</p>
                <p className="mt-1.5 text-base font-bold text-[color:var(--hl-text)]">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-hardline-800">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
