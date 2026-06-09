import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hardline — Fit check',
  description: 'A quick fit check before we connect.',
  robots: 'noindex, nofollow',
}

// Placeholder for Stage 1 of the interactive first-call experience.
// The full qualifier, story, and Q&A stages are built next.
export default function QualifierPlaceholderPage() {
  return (
    <main className="hl-dark flex min-h-screen items-center justify-center bg-[color:var(--hl-base)] px-6">
      <div className="max-w-md space-y-6 text-center animate-fade-up">
        <p className="section-label">Stage 1 — Fit check</p>
        <h1 className="hl-h2 text-[color:var(--hl-text)]">Coming soon.</h1>
        <p className="leading-relaxed text-[color:var(--hl-text)]">
          The fit check is being built. In the meantime, head back and read the overview.
        </p>
        <div className="pt-2">
          <Link href="/investors" className="btn-primary">
            ← Back to overview
          </Link>
        </div>
      </div>
    </main>
  )
}
