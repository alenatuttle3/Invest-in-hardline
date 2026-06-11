'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  // Header shows at the top of the page and slides away once you scroll.
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Flat #0c1a12 (the rich surface's edge color) so the header reads as one
  // seamless band with the hero — the soft glow only appears once, below.
  return (
    <header
      className={`hl-dark sticky top-0 z-50 bg-[#0c1a12] transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <nav className="section-container flex h-16 items-center">
        <Link href="/" aria-label="Hardline home" className="inline-flex items-center">
          <Image
            src="/hardline-logo.png"
            alt="Hardline"
            width={150}
            height={23}
            priority
            className="h-[23px] w-auto"
          />
        </Link>
      </nav>
    </header>
  )
}
