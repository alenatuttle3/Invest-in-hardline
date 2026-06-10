// Investor qualifier tier, carried over from Stage 1 (the fit check).
//
// `strong` / `soft` investors are invited to book a call; `park` investors are
// kept warm with investor updates instead of a calendar link.
export type InvestorTier = 'strong' | 'soft' | 'park'

export function normalizeTier(raw: string | null | undefined): InvestorTier {
  switch ((raw ?? '').trim().toLowerCase()) {
    case 'park':
      return 'park'
    case 'strong':
      return 'strong'
    case 'soft':
      return 'soft'
    default:
      // Unknown / not set yet — default to showing the booking link so we never
      // wrongly hide the calendar from a real investor.
      return 'soft'
  }
}

/**
 * Reads the investor's tier on the client. Priority:
 *   1. `?tier=` query param (lets us link investors straight to a treatment)
 *   2. `investorTier` persisted in sessionStorage
 *
 * TODO: Stage 1 (lib/qualify.ts + Qualifier) should compute and persist the
 *       tier to sessionStorage('investorTier') so this carries over automatically.
 */
export function readInvestorTier(): InvestorTier {
  if (typeof window === 'undefined') return 'soft'
  const fromQuery = new URLSearchParams(window.location.search).get('tier')
  const fromSession = window.sessionStorage.getItem('investorTier')
  return normalizeTier(fromQuery ?? fromSession)
}
