// Types for the investor qualifier form

export type InvestorFormData = {
  // Identity (gate removed for testing — re-add later)
  name?: string
  firm?: string
  email?: string

  // The fit check (6 questions)
  stage: string          // Q1 — stage they write their first check at
  checkSize: string      // Q2 — typical check size
  evaluation: string     // Q3 — how they evaluate seed-stage companies (open)
  whyHardline: string    // Q4 — why Hardline looks like a fit (open)
  role: string           // Q5 — lead capability
  valueAdd: string       // Q6 — what they actually contribute (open)
}

// Routing decision returned after form submission
export type QualificationResult =
  | { status: 'qualified'; message: string }
  | { status: 'not_a_fit'; reason: string; followUpDate?: string }
  | { status: 'maybe'; clarificationNeeded: string }

// Hardcoded routing rules — will be replaced with AI-driven logic later
export function qualifyInvestor(data: InvestorFormData): QualificationResult {
  // Hard no: won't lead — we're looking for a lead for this round
  if (data.role === 'Follow a lead') {
    return {
      status: 'not_a_fit',
      reason: "We're actively looking for a lead investor for this round.",
      followUpDate: '6 months',
    }
  }

  // Default: qualified
  return {
    status: 'qualified',
    message: "You're a fit. Here's the story — then let's find time to talk.",
  }
}
