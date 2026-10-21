# Hardline Investor Portal

A gated, async-first investor funnel. Lets inbound investors get to know Hardline on their own time before booking a call with Alena.

## Flow

```
/investors            Landing — intro + access gate (name, email, fund)
  ↓ (gate unlocks the story)
/investors/story      The story: videos, how it works, traction
  ↓                         ↘ "Follow along" — one-click newsletter opt-in
/investors/book       A couple optional questions, then book a call
```

The story and booking pages are hard-gated: visiting them without completing
the access gate (tracked in `sessionStorage`) redirects back to `/investors`.
Anyone who finishes the gate can book — there's no hard qualification step.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Design system

This portal follows the **Hardline "Field Record" design system**, the same
one hardlineapp.com ships:

- **Flat and printed**: Paper (`#F5F4F1`) in the reading middle, Deep Field
  (`#0B1F17`) at the ends, Forest (`#1F3F33`) for ink and dark panels. 1px
  hairlines instead of shadows; no gradients, glows or blur.
- **4px radius** everywhere; circles only for true dots.
- **Mint** (`#59AF8C`) means documented: the get-started CTA, the selection
  mark, accents on dark. Never small text on light. Forest is the booking CTA.
- **Montserrat only**, self-hosted (`app/fonts/Montserrat-Variable.woff2`, via
  `next/font/local`). Size-led headings at weight 400; nothing below 15px.
- Tokens and the component classes (`.btn-*`, `.card`, `.hl-input`, `.hl-mark`,
  `.section-container` rails, `.hl-section` rhythm) live in `styles/globals.css`;
  the palette, radii and 15px type floor live in `tailwind.config.js`.

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
