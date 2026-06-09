// Types for the investor qualifier form

export type InvestorFormData = {
  // Identity
  name: string
  firm: string
  email: string

  // Thesis
  constructionThesis: string         // Free text — what's their lens on construction tech?
  whyHardline: string                // Why did they reach out specifically?

  // Check mechanics
  role: 'lead' | 'follow' | 'either'
  checkSize: string                  // e.g. "$500K–$1M", "$1M–$3M"
  stage: string[]                    // pre-seed, seed, series-a

  // Hard requirements
  revenueRequirement: string         // Free text — do they need ARR, # of customers, etc.
  hardNos: string                    // Free text — anything that would disqualify
}

// Routing decision returned after form submission
export type QualificationResult =
  | { status: 'qualified'; message: string }
  | { status: 'not_a_fit'; reason: string; followUpDate?: string }
  | { status: 'maybe'; clarificationNeeded: string }

// Hardcoded routing rules — will be replaced with AI-driven logic later
export function qualifyInvestor(data: InvestorFormData): QualificationResult {
  // Hard no: too large a check size expectation for seed
  if (data.checkSize === '$5M+') {
    return {
      status: 'not_a_fit',
      reason: "We're raising a seed round and your typical check size is above our target range.",
      followUpDate: '12 months',
    }
  }

  // Hard no: won't lead
  if (data.role === 'follow') {
    return {
      status: 'not_a_fit',
      reason: "We're actively looking for a lead investor for this round.",
      followUpDate: '6 months',
    }
  }

  // Hard no: has specific revenue requirements we can't meet
  // TODO: add logic once revenue requirements are known

  // Default: qualified
  return {
    status: 'qualified',
    message: "You're a fit. Here's more about Hardline — then let's find time to talk.",
  }
}
