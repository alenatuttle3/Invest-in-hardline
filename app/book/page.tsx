import type { Metadata } from 'next'
import BookingQuestions from '@/components/investors/BookingQuestions'

export const metadata: Metadata = {
  title: 'Hardline — Book a meeting',
  description: 'A couple quick questions, then grab a time on our calendar.',
  robots: 'noindex, nofollow',
}

// Final stage — a couple of optional questions, then scheduling. Reached from
// the "Book a meeting" CTA at the end of the story.
export default function BookPage() {
  return <BookingQuestions />
}
