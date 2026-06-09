import type { Metadata } from 'next'
import { Montserrat, JetBrains_Mono } from 'next/font/google'
import '../styles/globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--hl-font',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--hl-mono',
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
    <html lang="en" className={`${montserrat.variable} ${jetbrainsMono.variable}`}>
      <body className="spec">{children}</body>
    </html>
  )
}
