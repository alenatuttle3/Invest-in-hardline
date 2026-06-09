export default function Footer() {
  return (
    <footer className="hl-dark bg-[color:var(--hl-base)] border-t border-[color:var(--hl-hairline)]">
      <div className="section-container flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-base font-semibold text-[color:var(--hl-text)]">Hardline</p>
          <p className="mt-2 text-sm text-[color:var(--hl-text)]">
            Just talk. We&apos;ll do the rest.
          </p>
        </div>
        <div className="flex flex-col gap-1.5 text-sm md:items-end">
          <a href="mailto:info@hardlineapp.com" className="text-mint hover:underline">
            info@hardlineapp.com
          </a>
          <a
            href="https://www.hardlineapp.com"
            className="text-[color:var(--hl-text)] transition-colors hover:text-mint"
          >
            www.hardlineapp.com
          </a>
        </div>
      </div>
      <div className="section-container pb-8 text-xs text-[color:var(--hl-text-muted)]">
        © {new Date().getFullYear()} Hardline. All rights reserved.
      </div>
    </footer>
  )
}
