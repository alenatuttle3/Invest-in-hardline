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

  // Deep Field, square, hairline bottom rule — the same nav as hardlineapp.com.
  return (
    <header
      className={`hl-dark sticky top-0 z-50 border-b border-[color:var(--rule-dark)] bg-deep-field transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <nav className="section-container flex h-16 items-center">
        <Link href="/" aria-label="Hardline home" className="inline-flex items-center">
          <Image
            src="/hardline-logo.png"
            alt="Hardline"
            width={184}
            height={28}
            priority
            className="h-[28px] w-auto"
          />
        </Link>
      </nav>
    </header>
  )
}
