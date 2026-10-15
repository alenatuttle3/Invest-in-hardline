import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import '../styles/globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
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
      <body className="hl-dark">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
