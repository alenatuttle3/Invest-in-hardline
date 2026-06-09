import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="spec-bar flex items-center justify-between">
      <Link href="/investors" className="flex items-center gap-2.5">
        <span className="h-5 w-5 rounded-[6px] border border-[color:var(--border)] bg-[color:var(--keycap)]" />
        <span className="font-semibold text-[color:var(--text)]">Hardline</span>
      </Link>
      <span className="mono text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted)]">
        First call · v0
      </span>
    </header>
  )
}
