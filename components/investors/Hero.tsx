const SUBCOPY =
  "We're Hardline — the voice-first layer for construction. Rather than give the same intro pitch for the hundredth time, we built it once. This is our first call, made interactive — you drive."

const META = ['Self-paced', '~5 minutes', 'Seed', 'Construction AI']

export default function Hero() {
  return (
    <section className="hl-dark bg-[color:var(--hl-base)]">
      <div className="section-container max-w-3xl py-20 md:py-28 animate-fade-up">
        <p className="section-label mb-5">For prospective investors</p>

        <h1 className="hl-h1 text-4xl md:text-6xl">
          <span className="hl-gradient-text">
            Want 30 minutes with us? Spend 5 here first.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--hl-text)]">
          {SUBCOPY}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {META.map(m => (
            <span
              key={m}
              className="inline-flex items-center rounded-full bg-[color:var(--hl-base)] px-4 py-2 text-xs font-medium text-[color:var(--hl-text)] shadow-neu-sm"
            >
              {m}
            </span>
          ))}
        </div>

        <div className="mt-10">
          <a href="#start" className="btn-primary">
            Start the fit check →
          </a>
        </div>
      </div>
    </section>
  )
}
