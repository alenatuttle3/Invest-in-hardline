# Hardline Investor Portal

A gated, async-first investor funnel. Lets inbound investors get to know Hardline on their own time before booking a call with Alena.

## Flow

```
/            Landing — intro + access gate (name, email, fund)
  ↓ (gate unlocks the story)
/story       The story: videos, how it works, traction
  ↓                         ↘ "Follow along" — one-click newsletter opt-in
/book        A couple optional questions, then book a call
```

The story and booking pages are hard-gated: visiting them without completing
the access gate (tracked in `sessionStorage`) redirects back to `/`.
Anyone who finishes the gate can book — there's no hard qualification step.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design system

This portal follows the **Hardline design system** (`DESIGN.md`):

- **Neumorphic (soft-UI)** surfaces — soft extruded shadows on a single-hue
  surface, switched between a dark forest (`#1F3F33`) and light sage (`#DDE6E2`)
  via `.hl-dark` / `.hl-light` token aliases.
- **One accent** — mint (`#59AF8C`) for CTAs, eyebrows, active states, stats.
- **Montserrat only** — loaded in `app/layout.tsx` via `next/font`.
- Tokens, neumorphic components (`.btn-*`, `.card`, `.hl-input`, `.hl-chip`,
  `.icon-neumorph`), and motion live in `styles/globals.css`; the color and
  neumorphic shadow scales live in `tailwind.config.js`.

### File structure

```
app/
  layout.tsx                  Montserrat + theme wiring + noindex metadata
  page.tsx                    Landing page + access gate
  story/page.tsx              The story
  book/page.tsx               Pre-meeting questions + booking
  qa/page.tsx                 Q&A (placeholder)
  api/qualifier/route.ts      Delivers submissions to Slack
lib/qualify.ts                Form types + storage key
lib/tier.ts                   Investor tier (gates the booking CTA)
styles/globals.css            Design tokens + neumorphic components
```

## Deploying

This is a Next.js app. Recommended: deploy to Vercel and point a subdomain at it (e.g. `invest.hardlineapp.com`). The funnel serves from the root, so the landing page is just `invest.hardlineapp.com`.

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
