import Link from 'next/link'

const HEADLINE = "Ready? Let's see if it's a fit."

export default function InvestorsCTA() {
  return (
    <section id="start" className="hl-dark scroll-mt-20 bg-[color:var(--hl-base)]">
      <div className="section-container py-20 text-center md:py-28">
        <h2 className="hl-h2 text-[color:var(--hl-text)]">{HEADLINE}</h2>

        <div className="mt-10 flex justify-center">
          <Link href="/investors/qualifier" className="btn-primary">
            Start the fit check →
          </Link>
        </div>
      </div>
    </section>
  )
}
