const CARDS = [
  {
    n: '1',
    title: 'Quick fit check',
    duration: '~90 SEC',
    body: 'A few questions, both directions. We make sure we’re a real fit before either of us blocks 30 minutes.',
  },
  {
    n: '2',
    title: 'The story',
    duration: '~4 MIN',
    body: 'Short videos: why we built this, what it actually does, and the traction behind it. No 40-slide deck to sit through.',
  },
  {
    n: '3',
    title: 'Ask anything',
    duration: 'SELF-PACED',
    body: 'The questions every investor asks us — moat, pricing, GTM — answered. Dig into whatever you’d grill us on live.',
  },
]

export default function WhatToExpect() {
  return (
    <section className="spec-frame">
      <span className="spec-marker hidden sm:block">② What to expect</span>

      <p className="eyebrow mb-6">What to expect</p>

      <div className="grid gap-4 md:grid-cols-3">
        {CARDS.map(c => (
          <div key={c.n} className="spec-card flex flex-col gap-3">
            <span className="spec-num">{c.n}</span>
            <div>
              <h3 className="font-semibold text-[color:var(--text)]">{c.title}</h3>
              <p className="mono mt-1 text-[11px] tracking-wider text-[color:var(--muted)]">
                {c.duration}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-[color:var(--text-2)]">{c.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
