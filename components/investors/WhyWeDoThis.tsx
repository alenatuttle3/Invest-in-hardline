const PARAGRAPHS = [
  "We're an AI-first company — which means we pay close attention to the repetitive, tedious work nobody should be doing by hand. Fundraising turned out to be exactly that: 10–15 hours a month giving the same intro pitch, just to figure out whether it's worth building a relationship.",
  "So, naturally, we automated it. Go through this at your own pace — and if you want to dig in after, grab a time on our calendar. Let's dig in.",
]

const SIGNATURE = '— Alena & Karly · Co-founders, Hardline'

export default function WhyWeDoThis() {
  return (
    <section className="hl-dark bg-[color:var(--hl-base)]">
      <div className="section-container max-w-3xl py-20 md:py-28">
        <p className="section-label mb-6">Why we&apos;re doing this</p>

        <div className="card-dark border-l-2 border-mint">
          <div className="space-y-5 leading-relaxed text-[color:var(--hl-text)]">
            {PARAGRAPHS.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <p className="mt-8 text-sm uppercase tracking-widest text-[color:var(--hl-text-muted)]">
            {SIGNATURE}
          </p>
        </div>
      </div>
    </section>
  )
}
