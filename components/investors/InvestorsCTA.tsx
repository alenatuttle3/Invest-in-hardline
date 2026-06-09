import Link from 'next/link'
import BookCall from '@/components/CalEmbed'

const HEADLINE = "Ready? Let's see if it's a fit."

export default function InvestorsCTA() {
  return (
    <section id="start" className="spec-frame scroll-mt-6 text-center">
      <span className="spec-marker hidden sm:block">④ CTA</span>

      <h2 className="text-2xl font-semibold tracking-tight text-[color:var(--text)] md:text-3xl">
        {HEADLINE}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-[color:var(--text-2)]">
        Three quick questions to start. Then straight into the story.
      </p>

      <div className="mt-7 flex flex-col items-center gap-4">
        <Link href="/investors/qualifier" className="btn-spec">
          Start the fit check →
        </Link>

        {/* Warm-investor shortcut — intentionally subordinate. Remove this
            BookCall block if we decide against it. */}
        <BookCall className="spec-link inline-flex items-center gap-1">
          Already know us? Grab a time →
        </BookCall>
      </div>

      <p className="mono mt-5 text-[11px] tracking-widest text-[color:var(--muted)]">
        ~5 MIN TOTAL · STOP ANYTIME
      </p>
    </section>
  )
}
