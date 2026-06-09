import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hardline — Q&A',
  description: 'The questions every investor asks us — answered in our words.',
  robots: 'noindex, nofollow', // Investor-only — keep out of search results
}

// TODO (Stage 3): build out the Q&A — moat, pricing, GTM — answered in our
// words, then hand off into booking. This is a minimal placeholder so the
// Stage 2 "Ask us anything →" CTA resolves cleanly.
export default function QAPage() {
  return (
    <main className="hl-light min-h-screen bg-[color:var(--hl-base)]">
      <div className="mx-auto w-full max-w-[720px] px-6 py-14 md:py-16">
        <header className="flex items-end justify-between gap-4">
          <span className="section-label inline-block border-b-2 border-mint pb-2">
            Stage 3 of 3 · Q&amp;A
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-hardline-800">
            ~5 min
          </span>
        </header>
        <div className="mt-3 border-b border-[color:var(--hl-hairline)]" />

        <div className="pt-14 text-center">
          <h1 className="hl-h2 text-[color:var(--hl-text)]">Ask us anything</h1>
          <p className="mx-auto mt-4 max-w-md text-[color:var(--hl-text)]">
            The ones every investor asks us — moat, pricing, GTM — are on their way here.
          </p>

          <div className="mt-10 flex flex-col items-center gap-5">
            <Link href="/investors/story" className="btn-primary">
              ← Back to the story
            </Link>
            <a
              href="mailto:alena@hardlineapp.com?subject=Hardline%20investor%20question"
              className="text-sm font-medium text-hardline-800 underline-offset-4 transition-colors hover:text-mint hover:underline"
            >
              have a question now? email us
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
