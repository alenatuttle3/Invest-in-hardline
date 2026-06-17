const HEADING = "Here's how the next five minutes go."

const CARDS = [
  {
    n: '1',
    title: 'Tell us who you are',
    duration: '30 seconds',
    body: 'Name, email, and your fund — that’s the whole gate. It unlocks the story.',
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
      <div className="section-container py-20 md:py-28">
        <p className="section-label mb-4">What to expect</p>
        <h2 className="hl-h2 mb-12 max-w-xl text-[color:var(--hl-text)]">{HEADING}</h2>

        <div className="grid gap-6 md:grid-cols-3">
          {CARDS.map(c => (
            <div key={c.n} className="card flex flex-col gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-mint font-semibold text-white shadow-neu-sm">
                {c.n}
              </span>
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="hl-h3 text-[color:var(--hl-text)]">{c.title}</h3>
                {c.duration && (
                  <span className="whitespace-nowrap text-xs font-bold uppercase tracking-widest text-mint">
                    {c.duration}
                  </span>
                )}
              </div>
              <p className="leading-relaxed text-hardline-800">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
