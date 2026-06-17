import type { Metadata } from 'next'
import Story from '@/components/investors/story/Story'

export const metadata: Metadata = {
  title: 'Hardline — The Story',
  description:
    'Why we built Hardline: the founding story, how the three-layer product works, and why it’s different.',
  robots: 'noindex, nofollow', // Investor-only — keep out of search results
}

export default function StoryPage() {
  return <Story />
}
