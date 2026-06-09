export default function Footer() {
  return (
    <footer className="spec-bar flex flex-col gap-3 text-[12px] sm:flex-row sm:items-center sm:justify-between">
      <span className="mono uppercase tracking-wider text-[color:var(--muted)]">
        © {new Date().getFullYear()} Hardline
      </span>
      <div className="mono flex gap-5 uppercase tracking-wider">
        <a
          href="mailto:info@hardlineapp.com"
          className="text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
        >
          info@hardlineapp.com
        </a>
        <a
          href="https://www.hardlineapp.com"
          className="text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
        >
          hardlineapp.com
        </a>
      </div>
    </footer>
  )
}
