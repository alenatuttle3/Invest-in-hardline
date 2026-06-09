import type { Metadata } from 'next'
import Qualifier from '@/components/investors/Qualifier'

export const metadata: Metadata = {
  title: 'Hardline — Fit check',
  description: 'A quick fit check before we connect.',
  robots: 'noindex, nofollow',
}

// Stage 1 of the interactive first-call experience — linked from the
// "Start the fit check" CTA on /investors.
export default function QualifierPage() {
  return <Qualifier />
}
