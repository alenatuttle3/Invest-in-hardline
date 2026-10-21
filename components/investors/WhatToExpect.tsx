const HEADING = "Here's how the next five minutes go."

const CARDS = [
  {
    n: '1',
    title: 'Tell us who you are',
    duration: '30 seconds',
    body: 'Name, email, and your fund. That’s the whole gate. It unlocks the story.',
  },
  {
    n: '2',
    title: 'The story',
    duration: '5 min',
    body: 'Short videos: why we built this, what it actually does, and the traction behind it. No 40-slide deck to sit through.',
  },
  {
    n: '3',
    title: 'If it’s a fit, let’s talk',
    duration: '',
    body: 'A couple quick questions so we can get to know you, then grab a time on our calendar.',
  },
]

export default function WhatToExpect() {
  return (
    <section className="hl-light bg-[color:var(--hl-base)]">
      <div className="section-container hl-section">
        <p className="section-label mb-4">What to expect</p>
        <h2 className="hl-h2 mb-12 max-w-xl md:mb-16">{HEADING}</h2>

        {/* Bare hairline grid, not cards: a top rule, columns split by 1px. */}
        <div className="grid border-t border-[color:var(--rule-warm)] md:grid-cols-3">
          {CARDS.map((c, i) => (
            <div
              key={c.n}
              className={`flex flex-col gap-4 border-b border-[color:var(--rule-warm)] py-8 md:border-b-0 md:px-8 md:py-10 ${
                i === 0 ? 'md:pl-0' : 'md:border-l'
              } ${i === CARDS.length - 1 ? 'border-b-0 md:pr-0' : ''}`}
            >
              <span className="hl-mono text-[32px] font-normal leading-none text-deep-field">
                {c.n}
              </span>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[21px] font-semibold leading-snug text-[color:var(--hl-text)]">{c.title}</h3>
                {c.duration && (
                  <span className="hl-mono whitespace-nowrap text-xs font-medium uppercase tracking-[0.12em] text-hardline-300">
                    {c.duration}
                  </span>
                )}
              </div>
              <p className="leading-relaxed text-[color:var(--hl-text)]">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
