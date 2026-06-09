import Link from 'next/link'
import BookCall from '@/components/CalEmbed'

const HEADLINE = "Ready? Let's see if it's a fit."

export default function InvestorsCTA() {
  return (
    <section id="start" className="hl-light scroll-mt-20 bg-[color:var(--hl-base)]">
      <div className="section-container py-20 text-center md:py-28">
        <h2 className="hl-h2 text-[color:var(--hl-text)]">{HEADLINE}</h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-hardline-800">
          Three quick questions to start. Then straight into the story.
        </p>

        <div className="mt-10 flex flex-col items-center gap-5">
          <Link href="/investors/qualifier" className="btn-primary">
            Start the fit check →
          </Link>

          {/* Warm-investor shortcut — intentionally subordinate to the primary
              CTA. Remove this BookCall block if we decide against it. */}
          <BookCall className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-mint transition-colors hover:text-hardline-900">
            Already know us? Grab a time →
          </BookCall>
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-hardline-800">
          ~5 MIN TOTAL · STOP ANYTIME
        </p>
      </div>
    </section>
  )
}
