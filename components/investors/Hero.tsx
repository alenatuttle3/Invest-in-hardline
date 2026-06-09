const SUBCOPY =
  "We're Hardline, the first voice operations platform for the field. Rather than give the same intro pitch for the hundredth time, we built it once."

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
      </div>
    </section>
  )
}
