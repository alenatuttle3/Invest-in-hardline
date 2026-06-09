import { redirect } from 'next/navigation'

// The investor landing page is the entry point. The fit-check questionnaire
// lives at /investors/qualifier, linked from the landing page's bottom CTA.
export default function Home() {
  redirect('/investors')
}
