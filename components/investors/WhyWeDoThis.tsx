const PARAGRAPHS = [
  "We're an AI-first company — which means we pay close attention to the repetitive, tedious work nobody should be doing by hand. Fundraising turned out to be exactly that: 10–15 hours a month giving the same intro pitch, just to figure out whether it's worth building a relationship.",
  "So, naturally, we automated it. Go through this at your own pace — and if you want to dig in after, grab a time on our calendar. Let's dig in.",
]

const SIGNATURE = '— Alena & Karly · Co-founders, Hardline'

export default function WhyWeDoThis() {
  return (
    <section className="spec-frame">
      <span className="spec-marker hidden sm:block">③ Why we’re doing this</span>

      <p className="eyebrow mb-6">Why we’re doing this</p>

      <div className="max-w-2xl space-y-4 leading-relaxed text-[color:var(--text-2)]">
        {PARAGRAPHS.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <p className="mono mt-7 text-[12px] tracking-wider text-[color:var(--muted)]">{SIGNATURE}</p>
    </section>
  )
}
