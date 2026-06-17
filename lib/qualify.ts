// Types for the investor flow.
//
// The flow has two capture points:
//   1. Access gate  — name, email, fund — unlocks the story.
//   2. Pre-meeting   — the deeper questions, collected right before booking.
// Both post to /api/qualifier; there is no hard qualification anymore — anyone
// who wants to book can book.

export type InvestorFormData = {
  // Access gate (all three required to unlock the story)
  name?: string
  email?: string
  fund?: string

  // Pre-meeting questions (optional — collected before booking a call)
  stage?: string[]       // Q1 — stage(s) they write their first check at (multi)
  checkSize?: string     // Q2 — typical check size range
  evaluation?: string    // Q3 — how they evaluate seed-stage companies (open)
  whyHardline?: string   // Q4 — why Hardline looks like a fit (open)
  role?: string          // Q5 — lead capability
  valueAdd?: string      // Q6 — what they contribute beyond the check (open)
}

// What the visitor was doing when the payload was sent.
export type SubmissionType = 'access' | 'questions' | 'newsletter'

// sessionStorage key holding the access-gate answers (name/email/fund). Its
// presence is what unlocks the gated pages (story, booking).
export const ACCESS_KEY = 'investorAccess'
