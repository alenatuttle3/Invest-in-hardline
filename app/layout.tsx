import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '../styles/globals.css'

// Self-hosted Montserrat variable (100–900), the same file hardlineapp.com ships.
const montserrat = localFont({
  src: './fonts/Montserrat-Variable.woff2',
  weight: '100 900',
  variable: '--hl-font',
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
    <html lang="en" data-theme="dark" className={montserrat.variable}>
      <body className="hl-dark">{children}</body>
    </html>
  )
}
