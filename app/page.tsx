import { redirect } from 'next/navigation'

// The investor landing page is the entry point. Its bottom CTA is the access
// gate (name/email/fund) that unlocks the story at /investors/story.
export default function Home() {
  redirect('/investors')
}
