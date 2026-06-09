const SUBCOPY =
  "We're Hardline — the voice-first layer for construction. Rather than give the same intro pitch for the hundredth time, we built it once. This is our first call, made interactive — you drive."

const META = ['Self-paced', '~5 minutes', 'Seed', 'Construction AI']

export default function Hero() {
  return (
    <section className="spec-frame">
      <span className="spec-marker hidden sm:block">① Hero</span>

      <p className="eyebrow mb-5">For prospective investors</p>

      <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[color:var(--text)] md:text-5xl">
        Want 30 minutes with us?
        <br />
        Spend 5 here first.
      </h1>

      <p className="mt-5 max-w-2xl leading-relaxed text-[color:var(--text-2)]">{SUBCOPY}</p>

      <div className="mt-7 flex flex-wrap gap-2.5">
        {META.map(m => (
          <span key={m} className="spec-pill">
            {m}
          </span>
        ))}
      </div>
    </section>
  )
}
