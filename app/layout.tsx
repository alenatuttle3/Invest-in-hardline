import type { Metadata } from 'next'
import { Montserrat, DM_Serif_Display, DM_Sans } from 'next/font/google'
import '../styles/globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--hl-font',
  display: 'swap',
})

// Used by the scroll-driven "How it works" section.
const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--hl-font-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--hl-font-sans-dm',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Hardline — Investor Portal',
  description: 'Learn about Hardline before we connect.',
  robots: 'noindex, nofollow', // Keep this private from search engines
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${montserrat.variable} ${dmSerif.variable} ${dmSans.variable}`}
    >
      <body className="hl-dark">{children}</body>
    </html>
  )
}
