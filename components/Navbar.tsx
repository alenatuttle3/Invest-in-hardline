import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="hl-dark sticky top-0 z-50 bg-[color:var(--hl-base)] border-b border-[color:var(--hl-hairline)]">
      <nav className="section-container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-[color:var(--hl-text)]"
        >
          Hardline
        </Link>
        <Link
          href="/investors"
          className="text-sm font-semibold text-[color:var(--hl-text)] transition-colors hover:text-mint"
        >
          For investors
        </Link>
      </nav>
    </header>
  )
}
