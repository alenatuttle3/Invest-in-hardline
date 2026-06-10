import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <header className="hl-dark hl-dark-rich sticky top-0 z-50 border-b border-[color:var(--hl-hairline)]">
      <nav className="section-container flex h-16 items-center">
        <Link href="/" aria-label="Hardline home" className="inline-flex items-center">
          <Image src="/hardline-logo.svg" alt="Hardline" width={30} height={30} priority />
        </Link>
      </nav>
    </header>
  )
}
