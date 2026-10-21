const PARAGRAPHS = [
  "We're an AI-first company, which means we pay close attention to the repetitive, tedious work taking hours every month. Fundraising turned out to be exactly that: 10–15 hours a month giving the same intro pitch, just to figure out whether it's worth building a relationship.",
  'So, naturally, we automated it. Go through this at your own pace and if you want to dig in after, grab a time on our calendar.',
]

const SIGNATURE = '— Alena & Karly · Co-founders, Hardline'

export default function WhyWeDoThis() {
  return (
    <section>
      <div className="section-container hl-section">
        <div className="mx-auto max-w-3xl">
          <p className="section-label mb-6">Why we&apos;re doing this</p>

          {/* Solid Forest panel, like the testimonial hero on hardlineapp.com */}
          <figure className="rounded-[4px] bg-forest p-8 md:p-10">
            <div className="space-y-6 text-xl font-semibold leading-relaxed text-paper md:text-2xl md:leading-relaxed">
              {PARAGRAPHS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <figcaption className="mt-8 text-sm font-medium uppercase tracking-[0.08em] text-mint-400 md:text-base">
              {SIGNATURE}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
