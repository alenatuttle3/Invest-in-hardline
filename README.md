# Hardline Investor Portal

A gated, async-first investor funnel. Qualifies inbound investors before they get on a call with Alena.

## Flow

```
/ (Qualifier form, 3 steps)
  ↓ qualified
/portal (Unlocked content — video, traction, FAQ, calendar)
  ↓ not qualified
/not-a-fit (Graceful exit with reason + follow-up timeline)
```

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying

This is a Next.js app. Recommended: deploy to Vercel, set a custom path on hardlineapp.com (e.g. `/raise` or a subdomain `investors.hardlineapp.com`).

The page is `noindex` by default — won't appear in search results.

---

## TODOs (to fill in after Granola review)

### Content
- [ ] 2-sentence company summary (hero section)
- [ ] Founder Loom video (~4 min) — company story, problem, vision
- [ ] Product demo clip (~60-90 sec)
- [ ] Live traction stats (customers, call volume, MRR)
- [ ] FAQ answers — pull from recurring investor call questions:
  - Why now?
  - Why Hardline vs. existing tools?
  - Tech stack / moat?
  - Use of funds?
  - ICP definition?
- [ ] Cal.com / Calendly link for booking

### Routing logic (`lib/qualify.ts`)
- [ ] Define revenue/ARR threshold that disqualifies
- [ ] Define check size floor (too small?)
- [ ] Consider AI-powered routing (send form data to Claude API, get nuanced fit assessment)

### Nice to haves
- [ ] Email notification to Alena when someone completes the form (can use Resend or Formspree)
- [ ] Log qualified investors to Attio automatically
- [ ] Analytics (Plausible or Fathom — privacy-first)
