'use client'

import { useState } from 'react'

// Group shot lives at public/investors/team/founders.png; each `pin` is
// percent coords (x from left / y from top) of the dot floating above that
// person's head.
const PHOTO: string | null = '/investors/team/founders.png'
const PHOTO_ALT = 'Karly, Kimball, and Alena — the Hardline founding team'

// Fades the photo's top and side edges fully out so it dissolves into the
// page background; the bottom edge stays crisp so we aren't cut off at the
// knees. Two gradients (one per axis) intersected, because a single radial
// mask can't hit zero alpha at the edge midpoints without swallowing the
// whole photo.
const PHOTO_MASK =
  'linear-gradient(to right, transparent, #000 22%, #000 78%, transparent), ' +
  'linear-gradient(to bottom, transparent, #000 18%, #000)'

type Member = {
  name: string
  role: string
  tag: string // their clause of the section heading
  bio: string
  pin: { x: number; y: number }
}

// Ordered to read like the heading: construction → voice AI → exit.
const TEAM: Member[] = [
  {
    name: 'Karly Heffernan',
    role: 'Co-founder · COO',
    tag: 'Built construction.',
    bio: 'Built a commercial GC from $0 to $20M in revenue. Operations & strategy at Rex.',
    pin: { x: 50, y: 25 },
  },
  {
    name: 'Kimball Hill',
    role: 'CTO',
    tag: 'Built voice AI.',
    bio: 'Took an agentic enterprise platform from 0 to $8M ARR in under a year. 7 years scaling AI products.',
    pin: { x: 29.5, y: 21 },
  },
  {
    name: 'Alena Tuttle',
    role: 'Co-founder · CEO',
    tag: 'Built to exit.',
    bio: '8+ years GTM, strategy, and product. Scaled OpenInvest to a $200M+ exit.',
    pin: { x: 68, y: 27 },
  },
]

// One photo of the three of us, tagged like a photo of friends — not a row of
// corporate headshots. The heading clauses, the dots above our heads, and the
// blurbs all point at the same person: hover (or tap) any one of them and the
// other two light up.
export default function TeamPhoto() {
  const [active, setActive] = useState<number | null>(null)

  const bind = (i: number) => ({
    onMouseEnter: () => setActive(i),
    onMouseLeave: () => setActive(a => (a === i ? null : a)),
    onFocus: () => setActive(i),
    onBlur: () => setActive(a => (a === i ? null : a)),
    onClick: () => setActive(a => (a === i ? null : i)),
  })

  return (
    <div>
      {/* Heading — each clause belongs to one person */}
      <h2 className="hl-h3 text-[color:var(--hl-text)]">
        {TEAM.map((m, i) => (
          <button
            key={m.name}
            type="button"
            {...bind(i)}
            aria-label={`${m.tag} — ${m.name}`}
            className={`mr-[0.4em] cursor-pointer transition-colors duration-200 ${
              active === i ? 'text-mint' : active !== null ? 'opacity-50' : ''
            }`}
          >
            {m.tag}
          </button>
        ))}
      </h2>

      {/* Photo + blurbs — breaks out wider than the reading column. The 9fr/5fr
          split plus the xl breakout renders the photo ~30% wider than the old
          7fr/5fr · -mx-28 layout while the blurb column keeps its width. */}
      <div className="mt-8 grid gap-8 lg:-mx-28 lg:grid-cols-[9fr_5fr] lg:items-center xl:-mx-48">
        {/* The photo, with a dot floating above each of us */}
        <div className="relative">
          {PHOTO ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={PHOTO}
              alt={PHOTO_ALT}
              className="block aspect-[4/3] w-full object-cover"
              style={{
                WebkitMaskImage: PHOTO_MASK,
                maskImage: PHOTO_MASK,
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
              }}
            />
          ) : (
            <div className="flex aspect-[4/3] w-full items-end justify-center rounded-card bg-[color:var(--hl-base)] pb-6 shadow-neu-inset">
              <p className="px-6 text-center text-xs font-semibold uppercase tracking-widest text-[color:var(--hl-text-muted)]">
                Group photo goes here · public/investors/team/founders.png
              </p>
            </div>
          )}

          {TEAM.map((m, i) => (
            <button
              key={m.name}
              type="button"
              {...bind(i)}
              aria-label={m.name}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-2"
              style={{ left: `${m.pin.x}%`, top: `${m.pin.y}%` }}
            >
              <span
                className={`block h-3 w-3 rounded-full bg-mint transition-all duration-200 ${
                  active === i
                    ? 'scale-150 shadow-[0_0_0_6px_rgba(89,175,140,0.25)]'
                    : active !== null
                      ? 'opacity-40 shadow-[0_0_0_4px_rgba(89,175,140,0.15)]'
                      : 'shadow-[0_0_0_4px_rgba(89,175,140,0.2)]'
                }`}
              />
              <span
                className={`pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-mint px-3 py-1 text-[11px] font-bold text-white transition-opacity duration-200 ${
                  active === i ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {m.name.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>

        {/* The blurbs */}
        <ul className="space-y-3">
          {TEAM.map((m, i) => (
            <li key={m.name}>
              <button
                type="button"
                {...bind(i)}
                className={`w-full rounded-card px-5 py-4 text-left transition-all duration-200 ${
                  active === i ? 'bg-[color:var(--hl-base)] shadow-neu' : ''
                }`}
              >
                <p className="text-[11px] font-bold uppercase tracking-widest text-mint">{m.tag}</p>
                <p className="mt-1.5 text-base font-bold text-[color:var(--hl-text)]">
                  {m.name}
                  <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-hardline-800">
                    {m.role}
                  </span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-hardline-800">{m.bio}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
