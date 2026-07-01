'use client'

import { useEffect, useRef } from 'react'

/* =============================================================================
   Scroll-driven "How it works" scene.
   Self-contained: all CSS scoped under .hl-howitworks, all animation runs on a
   single canvas driven by this section's scroll position. An IntersectionObserver
   only runs the rAF loop while the section is on screen. prefers-reduced-motion
   freezes the ambient motion (pulse / particles) but keeps the
   scroll-mapped stages so the story still reads.

   Three scroll stages:
     1 Capture      — a live call; nodes scatter in.
     2 Intelligence — nodes settle into a cross-linked knowledge map.
     3 Automation   — the map collapses into a top-down hierarchy: Hardline at
                      the apex, the tech stack downstream. Hardline authors; the
                      tools run on what it captures.
   ============================================================================= */

type Cat = 'project' | 'phase' | 'person' | 'issue' | 'decision' | 'workflow'

type NodeDef = {
  id: string
  cat: Cat
  imp: 1 | 2 | 3
  x: number // % of map width
  y: number // % of map height
  label: string
  dest?: 'procore' | 'acc' | 'fieldwire'
  color?: string
}

// Brand-tonal palette: one hue family (forest → mint → sage) so the map reads
// as part of the light neumorphic system used across the site.
const CAT_COLOR: Record<Cat, string> = {
  project: '#1f3f33',
  phase: '#2c5a45',
  person: '#7e908c',
  issue: '#59af8c',
  decision: '#6fc49f',
  workflow: '#59af8c',
}
const CAT_RANK: Record<Cat, number> = {
  project: 6,
  phase: 5,
  person: 4,
  issue: 3,
  decision: 2,
  workflow: 1,
}

const NODES: NodeDef[] = [
  { id: 'proj_a', cat: 'project', imp: 3, x: 30, y: 18, label: 'Tower A — 22F' },
  { id: 'proj_b', cat: 'project', imp: 3, x: 70, y: 25, label: 'Parking Structure' },
  { id: 'proj_c', cat: 'project', imp: 2, x: 50, y: 82, label: 'Lobby Renovation' },
  { id: 'foundation', cat: 'phase', imp: 2, x: 14, y: 30, label: 'Foundation' },
  { id: 'steel', cat: 'phase', imp: 2, x: 42, y: 10, label: 'Structural Steel' },
  { id: 'mep', cat: 'phase', imp: 2, x: 78, y: 12, label: 'MEP Rough-In' },
  { id: 'envelope', cat: 'phase', imp: 1, x: 90, y: 38, label: 'Building Envelope' },
  { id: 'finishes', cat: 'phase', imp: 1, x: 82, y: 62, label: 'Finishes' },
  { id: 'closeout', cat: 'phase', imp: 1, x: 38, y: 90, label: 'Closeout' },
  { id: 'foreman', cat: 'person', imp: 2, x: 12, y: 52, label: 'Mike — Foreman' },
  { id: 'elec', cat: 'person', imp: 2, x: 88, y: 50, label: 'Allied Electric' },
  { id: 'plumb', cat: 'person', imp: 2, x: 86, y: 74, label: 'Visco Plumbing' },
  { id: 'owner', cat: 'person', imp: 2, x: 16, y: 70, label: 'Owner Rep' },
  { id: 'inspector', cat: 'person', imp: 1, x: 32, y: 72, label: 'City Inspector' },
  { id: 'iss_steel', cat: 'issue', imp: 2, x: 44, y: 28, label: 'Steel delivery delay' },
  { id: 'iss_mep', cat: 'issue', imp: 2, x: 72, y: 42, label: 'MEP coord. gap' },
  { id: 'iss_permit', cat: 'issue', imp: 2, x: 28, y: 55, label: 'Permit hold — Lvl 8' },
  { id: 'iss_crack', cat: 'issue', imp: 1, x: 20, y: 82, label: 'Slab crack — Grid C4' },
  { id: 'dec_pour', cat: 'decision', imp: 2, x: 36, y: 42, label: 'Pour date: Tue 7am' },
  { id: 'dec_sub', cat: 'decision', imp: 1, x: 60, y: 70, label: 'Sub swap approved' },
  { id: 'dec_rfi', cat: 'decision', imp: 2, x: 60, y: 18, label: 'RFI #47 resolved' },
  { id: 'wf_log', cat: 'workflow', dest: 'procore', color: '#59af8c', imp: 3, x: 34, y: 32, label: 'Daily Log' },
  { id: 'wf_rfi', cat: 'workflow', dest: 'procore', color: '#59af8c', imp: 2, x: 54, y: 38, label: 'RFI' },
  { id: 'wf_task', cat: 'workflow', dest: 'procore', color: '#59af8c', imp: 2, x: 46, y: 58, label: 'Task' },
  { id: 'wf_draw', cat: 'workflow', dest: 'acc', color: '#3c7a64', imp: 2, x: 68, y: 30, label: 'Drawing Rev' },
  { id: 'wf_model', cat: 'workflow', dest: 'acc', color: '#3c7a64', imp: 1, x: 76, y: 52, label: 'Model Conflict' },
  { id: 'wf_punch', cat: 'workflow', dest: 'fieldwire', color: '#1f3f33', imp: 2, x: 42, y: 74, label: 'Punch Item' },
  { id: 'wf_insp', cat: 'workflow', dest: 'fieldwire', color: '#1f3f33', imp: 1, x: 58, y: 86, label: 'Inspection' },
]

const EDGES: [string, string][] = [
  ['proj_a', 'foundation'], ['proj_a', 'steel'], ['proj_a', 'mep'], ['proj_a', 'envelope'],
  ['proj_b', 'mep'], ['proj_b', 'finishes'], ['proj_b', 'envelope'],
  ['proj_c', 'finishes'], ['proj_c', 'closeout'],
  ['proj_a', 'foreman'], ['proj_a', 'elec'], ['proj_a', 'owner'],
  ['proj_b', 'plumb'], ['proj_b', 'elec'],
  ['proj_c', 'inspector'], ['proj_c', 'owner'],
  ['steel', 'iss_steel'], ['mep', 'iss_mep'], ['foundation', 'iss_crack'], ['proj_a', 'iss_permit'],
  ['elec', 'iss_mep'], ['foreman', 'iss_steel'], ['inspector', 'iss_permit'],
  ['foreman', 'dec_pour'], ['owner', 'dec_sub'], ['inspector', 'dec_rfi'],
  ['iss_steel', 'dec_pour'], ['iss_mep', 'dec_sub'], ['iss_permit', 'dec_rfi'],
  ['dec_pour', 'wf_log'], ['dec_pour', 'wf_task'], ['dec_rfi', 'wf_rfi'], ['dec_rfi', 'wf_draw'],
  ['dec_sub', 'wf_task'], ['iss_crack', 'wf_punch'], ['iss_mep', 'wf_log'], ['iss_mep', 'wf_model'],
  ['steel', 'wf_rfi'], ['mep', 'wf_task'], ['mep', 'wf_model'], ['closeout', 'wf_punch'],
  ['closeout', 'wf_insp'], ['inspector', 'wf_insp'],
  ['proj_a', 'proj_b'], ['elec', 'foundation'],
]

// The downstream tech stack. In stage 3 each becomes a tier-1 node under the
// Hardline apex, with its authored artifacts (group) hanging below it.
type Integration = {
  key: 'procore' | 'acc' | 'fieldwire'
  name: string
  dot: string
  group: string[]
}
const INTEGRATIONS: Integration[] = [
  { key: 'procore', name: 'Procore', dot: '#59af8c', group: ['wf_log', 'wf_rfi', 'wf_task'] },
  { key: 'acc', name: 'Autodesk ACC', dot: '#3c7a64', group: ['wf_draw', 'wf_model'] },
  { key: 'fieldwire', name: 'Fieldwire', dot: '#1f3f33', group: ['wf_punch', 'wf_insp'] },
]

const STEPS = [
  {
    tag: '01 / Capture',
    title: 'The field already talks. We made it count.',
    body: "Hardline is the eyes and ears of the jobsite. Every call, site walk, and conversation, captured passively with whatever's already in hand. Works with your phone, smart glasses, walkie-talkies, and security feeds. If it happens on site, Hardline hears it.",
  },
  {
    tag: '02 / Intelligence',
    title: 'Every job, finally with a memory.',
    body: 'Projects, phases, subcontractors, issues, and decisions, all cross-linked in real time. The institutional knowledge that used to walk out the door when someone quit. Now it stays.',
  },
  {
    tag: '03 / Automation',
    title: 'Hardline holds the authoring pen. Every tool on the job runs on what we capture.',
    body: "The field conversation is where every decision is made. Hardline captures it first and writes it into every system the project depends on. Not just an integration, the source of truth for the field. And users don't need to lift a finger.",
  },
]

const S1_END = 0.34
const S2_END = 0.67

export default function HowItWorks() {
  const rootRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stepEls = Array.from(root.querySelectorAll<HTMLElement>('.hiw-step'))
    const dotEls = Array.from(root.querySelectorAll<HTMLElement>('.hiw-dot'))
    const labelEls = Array.from(root.querySelectorAll<HTMLElement>('.hiw-nodelabel'))
    const ghostEl = root.querySelector<HTMLElement>('.hiw-ghostnum')
    const phoneEl = root.querySelector<HTMLElement>('.hiw-phone')

    // ---- math helpers ----
    const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
    const easeOut5 = (t: number) => 1 - Math.pow(1 - t, 5)
    const rng = (seed: number) => {
      const x = Math.sin(seed) * 43758.5453
      return x - Math.floor(x)
    }
    const bez = (p0: number, p1: number, p2: number, p3: number, t: number) => {
      const u = 1 - t
      return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
    }

    const idx = new Map(NODES.map((n, i) => [n.id, i]))

    // mutable per-node runtime state
    const nodes = NODES.map((n, i) => ({
      def: n,
      color: n.color ?? CAT_COLOR[n.cat],
      r: n.imp === 3 ? 7 : n.imp === 2 ? 5 : 3.5,
      sx: 0, sy: 0, // scatter start (px)
      tx: 0, ty: 0, // map target (px)
      px: 0, py: 0, // current (px)
      hx: 0, hy: 0, // stage-3 hierarchy target (px)
      seed: i + 1,
    }))

    let W = 0
    let H = 0
    let dpr = 1
    let narrow = false
    let apexPos = { x: 0, y: 0 }
    let apexR = 13
    const platPos: Record<string, { x: number; y: number; color: string; name: string }> = {}

    function layout() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas!.clientWidth
      H = canvas!.clientHeight
      canvas!.width = Math.round(W * dpr)
      canvas!.height = Math.round(H * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      narrow = W < 760
      apexR = narrow ? 10 : 13

      for (const n of nodes) {
        n.tx = W * 0.02 + (n.def.x / 100) * W * 0.96
        n.ty = H * 0.02 + (n.def.y / 100) * H * 0.96
        n.sx = (0.38 + rng(n.seed * 12.9898) * (0.9 - 0.38)) * W
        n.sy = (0.08 + rng(n.seed * 78.233 + 1) * (0.92 - 0.08)) * H
      }

      // Stage-3 hierarchy. On desktop it lives in the right column, clear of the
      // text panel; on mobile it centers and drops below the top-anchored text.
      const cx = narrow ? W * 0.5 : W * 0.72
      const apexY = narrow ? H * 0.42 : H * 0.12
      const t1Y = narrow ? H * 0.63 : H * 0.45
      const t2Y = narrow ? H * 0.85 : H * 0.74
      const platGap = narrow ? Math.min(W * 0.28, 200) : Math.min(W * 0.15, 210)
      // Tight, unlabeled cluster of authored artifacts under each platform.
      const childGap = narrow ? Math.min(W * 0.05, 44) : Math.min(W * 0.032, 40)

      apexPos = { x: cx, y: apexY }
      INTEGRATIONS.forEach((integ, ci) => {
        const px = cx + (ci - 1) * platGap
        platPos[integ.key] = { x: px, y: t1Y, color: integ.dot, name: integ.name }
        const k = integ.group.length
        integ.group.forEach((id, j) => {
          const node = nodes[idx.get(id)!]
          node.hx = px + (j - (k - 1) / 2) * childGap
          node.hy = t2Y
        })
      })
    }

    function scrollProgress() {
      const rect = root!.getBoundingClientRect()
      const total = root!.offsetHeight - window.innerHeight
      return clamp(total > 0 ? -rect.top / total : 0)
    }

    // DOM state we only touch on change
    let domStage = -1
    function updateDom(stage: number) {
      if (stage === domStage) return
      domStage = stage
      stepEls.forEach((el, i) => el.classList.toggle('is-active', i === stage))
      dotEls.forEach((el, i) => el.classList.toggle('is-active', i === stage))
      if (ghostEl) ghostEl.textContent = `0${stage + 1}`
    }

    // ---- drawing ----
    let animT = 0

    function draw() {
      const p = scrollProgress()
      let s1: number
      let s2: number
      let phoneAlpha: number
      if (p < S1_END) {
        const t = p / S1_END
        phoneAlpha = 1 - easeInOut(clamp(t * 1.3))
        s1 = easeInOut(t) * 0.2
        s2 = 0
      } else if (p < S2_END) {
        const t = (p - S1_END) / (S2_END - S1_END)
        phoneAlpha = 0
        s1 = 0.2 + easeInOut(t) * 0.8
        s2 = 0
      } else {
        const t = (p - S2_END) / (1 - S2_END)
        phoneAlpha = 0
        s1 = 1
        s2 = easeInOut(t)
      }
      const stage = p < S1_END ? 0 : p < S2_END ? 1 : 2
      updateDom(stage)

      ctx!.clearRect(0, 0, W, H)

      // Node positions + alphas. Stage 1–2: scatter → map. Stage 3: the workflow
      // nodes slide from the map into the hierarchy (tier 2); everything that
      // isn't authored output fades away, leaving Hardline and the stack.
      const blackout = easeInOut(clamp(s2 * 1.4))
      const toHier = easeInOut(clamp(s2))
      const alphas: number[] = []
      nodes.forEach((n, i) => {
        const form = easeOut5(clamp((s1 - (i / nodes.length) * 0.12) / 0.88))
        let px = lerp(n.sx, n.tx, form)
        let py = lerp(n.sy, n.ty, form)
        if (toHier > 0 && n.def.cat === 'workflow') {
          px = lerp(px, n.hx, toHier)
          py = lerp(py, n.hy, toHier)
        }
        n.px = px
        n.py = py
        let a = clamp(form * 1.4)
        if (n.def.cat !== 'workflow') a *= 1 - blackout
        alphas[i] = a
      })

      drawHalos(s1 * (1 - blackout))
      drawEdges(alphas)
      if (s2 > 0.001) drawHierarchy(s2)
      drawNodes(alphas)
      updateLabels(alphas, s1, s2)
      if (phoneEl) phoneEl.style.opacity = phoneAlpha.toFixed(3)
    }

    function drawHalos(strength: number) {
      if (strength <= 0.01) return
      const cats: Cat[] = ['project', 'phase', 'person', 'issue', 'decision', 'workflow']
      ctx!.save()
      for (const c of cats) {
        const grp = nodes.filter(n => n.def.cat === c)
        if (!grp.length) continue
        const cx = grp.reduce((s, n) => s + n.px, 0) / grp.length
        const cy = grp.reduce((s, n) => s + n.py, 0) / grp.length
        const rad = Math.min(W, H) * 0.2
        const g = ctx!.createRadialGradient(cx, cy, 0, cx, cy, rad)
        g.addColorStop(0, hexA(CAT_COLOR[c], 0.1 * strength))
        g.addColorStop(1, hexA(CAT_COLOR[c], 0))
        ctx!.fillStyle = g
        ctx!.fillRect(cx - rad, cy - rad, rad * 2, rad * 2)
      }
      ctx!.restore()
    }

    // Knowledge-map edges — solid quadratic arcs, bowed alternately so they
    // don't stack. They fade out with their endpoints as stage 3 takes over.
    function drawEdges(alphas: number[]) {
      ctx!.save()
      ctx!.lineCap = 'round'
      for (let e = 0; e < EDGES.length; e++) {
        const [aId, bId] = EDGES[e]
        const ia = idx.get(aId)!
        const ib = idx.get(bId)!
        const na = nodes[ia]
        const nb = nodes[ib]
        const ea = Math.min(alphas[ia], alphas[ib])
        if (ea <= 0.02) continue
        const owner = CAT_RANK[na.def.cat] >= CAT_RANK[nb.def.cat] ? na : nb
        const dx = nb.px - na.px
        const dy = nb.py - na.py
        const len = Math.hypot(dx, dy) || 1
        const bow = Math.min(len * 0.18, 44) * (e % 2 ? 1 : -1)
        const cx = (na.px + nb.px) / 2 - (dy / len) * bow
        const cy = (na.py + nb.py) / 2 + (dx / len) * bow
        ctx!.strokeStyle = hexA(owner.color, 0.3 * ea)
        ctx!.lineWidth = na.def.imp === 3 || nb.def.imp === 3 ? 1.2 : 0.8
        ctx!.beginPath()
        ctx!.moveTo(na.px, na.py)
        ctx!.quadraticCurveTo(cx, cy, nb.px, nb.py)
        ctx!.stroke()
      }
      ctx!.restore()
    }

    // A vertical org-chart connector: leaves the parent going straight down,
    // curves to the child. `drawT` reveals it progressively as you scroll.
    function drawLink(
      x0: number, y0: number, x1: number, y1: number,
      color: string, alpha: number, width: number, drawT: number,
    ) {
      if (alpha <= 0.01) return
      const my = (y0 + y1) / 2
      ctx!.strokeStyle = hexA(color, alpha)
      ctx!.lineWidth = width
      ctx!.beginPath()
      ctx!.moveTo(x0, y0)
      const steps = 22
      for (let s = 1; s <= steps; s++) {
        const t = (s / steps) * drawT
        ctx!.lineTo(bez(x0, x0, x1, x1, t), bez(y0, my, my, y1, t))
      }
      ctx!.stroke()
    }

    // Stage 3 — the hierarchy. Hardline at the apex, the tech stack downstream.
    // Everything flows one direction: down, from the authoring event.
    function drawHierarchy(s2: number) {
      ctx!.save()
      const appear = easeInOut(clamp((s2 - 0.12) / 0.88))
      const drawT = easeOut5(clamp((s2 - 0.08) / 0.92))
      const apex = apexPos

      ctx!.lineCap = 'round'
      // apex → platforms, then platform → its authored outputs
      INTEGRATIONS.forEach(integ => {
        const pl = platPos[integ.key]
        drawLink(apex.x, apex.y, pl.x, pl.y, '#59af8c', 0.5 * appear, 2.2, drawT)
        integ.group.forEach(id => {
          const n = nodes[idx.get(id)!]
          drawLink(pl.x, pl.y, n.px, n.py, pl.color, 0.34 * appear, 1, drawT)
        })
      })

      // Particles stream downward — Hardline powering the stack.
      if (!reduced && drawT > 0.05) {
        INTEGRATIONS.forEach(integ => {
          const pl = platPos[integ.key]
          const my = (apex.y + pl.y) / 2
          for (let k = 0; k < 3; k++) {
            const t = ((animT * 0.35 + k / 3) % 1) * drawT
            const x = bez(apex.x, apex.x, pl.x, pl.x, t)
            const y = bez(apex.y, my, my, pl.y, t)
            ctx!.fillStyle = hexA('#59af8c', 0.9 * appear)
            ctx!.beginPath()
            ctx!.arc(x, y, 2, 0, Math.PI * 2)
            ctx!.fill()
          }
        })
      }

      // Platform tier-1 nodes + labels
      ctx!.textAlign = 'center'
      ctx!.textBaseline = 'alphabetic'
      const platR = narrow ? 6 : 7
      INTEGRATIONS.forEach(integ => {
        const pl = platPos[integ.key]
        paintDot(pl.x, pl.y, platR, pl.color, appear, true)
        ctx!.font = '600 13px Montserrat, system-ui, sans-serif'
        ctx!.fillStyle = hexA('#3c574e', appear)
        ctx!.fillText(pl.name, pl.x, pl.y - platR - 12)
      })

      // The apex — visually heaviest: filled mint, bright core, double ring.
      paintApex(apex.x, apex.y, apexR, appear)
      ctx!.font = '700 16px Montserrat, system-ui, sans-serif'
      ctx!.fillStyle = hexA('#1f3f33', appear)
      ctx!.fillText('Hardline', apex.x, apex.y - apexR - 13)
      ctx!.restore()
    }

    function paintDot(x: number, y: number, r: number, color: string, a: number, ring: boolean) {
      if (a <= 0.02) return
      const g = ctx!.createRadialGradient(x, y, 0, x, y, r * 4)
      g.addColorStop(0, hexA(color, 0.5 * a))
      g.addColorStop(1, hexA(color, 0))
      ctx!.fillStyle = g
      ctx!.fillRect(x - r * 4, y - r * 4, r * 8, r * 8)
      ctx!.fillStyle = hexA(color, a)
      ctx!.beginPath()
      ctx!.arc(x, y, r, 0, Math.PI * 2)
      ctx!.fill()
      if (ring) {
        ctx!.strokeStyle = hexA('#1f3f33', 0.4 * a)
        ctx!.lineWidth = 1
        ctx!.beginPath()
        ctx!.arc(x, y, r + 3, 0, Math.PI * 2)
        ctx!.stroke()
      }
    }

    function paintApex(x: number, y: number, r: number, a: number) {
      if (a <= 0.02) return
      const rr = r * (reduced ? 1 : 1 + 0.05 * Math.sin(animT * 2))
      const g = ctx!.createRadialGradient(x, y, 0, x, y, rr * 5)
      g.addColorStop(0, hexA('#59af8c', 0.55 * a))
      g.addColorStop(1, hexA('#59af8c', 0))
      ctx!.fillStyle = g
      ctx!.fillRect(x - rr * 5, y - rr * 5, rr * 10, rr * 10)
      ctx!.fillStyle = hexA('#59af8c', a)
      ctx!.beginPath()
      ctx!.arc(x, y, rr, 0, Math.PI * 2)
      ctx!.fill()
      ctx!.fillStyle = hexA('#e8f4ee', 0.9 * a)
      ctx!.beginPath()
      ctx!.arc(x, y, rr * 0.4, 0, Math.PI * 2)
      ctx!.fill()
      ctx!.strokeStyle = hexA('#1f3f33', 0.5 * a)
      ctx!.lineWidth = 1.5
      ctx!.beginPath()
      ctx!.arc(x, y, rr + 4, 0, Math.PI * 2)
      ctx!.stroke()
    }

    function drawNodes(alphas: number[]) {
      ctx!.save()
      nodes.forEach((n, i) => {
        const a = alphas[i]
        if (a <= 0.02) return
        const pulse = reduced ? 1 : 1 + 0.08 * Math.sin(animT * 2 + i)
        const r = n.r * pulse
        const g = ctx!.createRadialGradient(n.px, n.py, 0, n.px, n.py, r * 4)
        g.addColorStop(0, hexA(n.color, 0.5 * a))
        g.addColorStop(1, hexA(n.color, 0))
        ctx!.fillStyle = g
        ctx!.fillRect(n.px - r * 4, n.py - r * 4, r * 8, r * 8)
        ctx!.fillStyle = hexA(n.color, a)
        ctx!.beginPath()
        ctx!.arc(n.px, n.py, r, 0, Math.PI * 2)
        ctx!.fill()
        if (n.def.imp === 3 || n.def.cat === 'workflow') {
          ctx!.strokeStyle = hexA('#1f3f33', 0.4 * a)
          ctx!.lineWidth = 1
          ctx!.beginPath()
          ctx!.arc(n.px, n.py, r + 3, 0, Math.PI * 2)
          ctx!.stroke()
        }
      })
      ctx!.restore()
    }

    // Node labels are real (selectable) DOM, centered above each dot so edges
    // pass under the text. The map labels fade out as stage 3 forms; the
    // hierarchy keeps only its canvas labels (Hardline + the platforms), so the
    // authored artifacts read as a tight, unlabeled cluster under each tool.
    function updateLabels(alphas: number[], s1: number, s2: number) {
      const reveal = clamp((s1 - 0.5) * 2)
      const hideForHier = easeInOut(clamp(s2 * 1.3))
      nodes.forEach((n, i) => {
        const el = labelEls[i]
        if (!el) return
        let op = reveal * alphas[i]
        if (n.def.cat === 'workflow') op *= 1 - hideForHier
        el.style.opacity = op.toFixed(3)
        el.style.transform = `translate(${n.px.toFixed(1)}px, ${(n.py - n.r - 24).toFixed(1)}px) translateX(-50%)`
      })
    }

    // ---- loop / observation ----
    let raf = 0
    let running = false
    const tick = () => {
      if (!running) {
        raf = 0
        return
      }
      if (!reduced) animT += 0.016
      draw()
      raf = requestAnimationFrame(tick)
    }
    const start = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }
    const stop = () => {
      running = false
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    layout()
    draw()

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) e.isIntersecting ? start() : stop()
      },
      { threshold: 0 },
    )
    io.observe(root)

    const onResize = () => {
      layout()
      draw()
    }
    window.addEventListener('resize', onResize)

    return () => {
      stop()
      io.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <section ref={rootRef} className="hl-howitworks" aria-label="How Hardline works">
      {/* dangerouslySetInnerHTML (not children) so the server/client serialize
          the CSS identically — inline url("…") quotes otherwise trip a
          text-content hydration mismatch that re-renders the page client-side. */}
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="hiw-sticky">
        <canvas ref={canvasRef} className="hiw-canvas" />

        {/* Stage-1 phone (live Hardline call). The GIF has a transparent
            background, so it's shown uncropped; fades out as the map forms. */}
        <div className="hiw-phone" aria-hidden="true" />

        {/* Real, selectable node labels positioned over the canvas */}
        <div className="hiw-labels">
          {NODES.map(n => (
            <span key={n.id} className="hiw-nodelabel">
              {n.label}
            </span>
          ))}
        </div>

        <div className="hiw-panel">
          {STEPS.map((s, i) => (
            <div key={s.tag} className={`hiw-step${i === 0 ? ' is-active' : ''}`}>
              <p className="hiw-tag">{s.tag}</p>
              <h2 className="hiw-title">{s.title}</h2>
              <p className="hiw-body">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="hiw-dots" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span key={s.tag} className={`hiw-dot${i === 0 ? ' is-active' : ''}`} />
          ))}
        </div>

        <div className="hiw-ghostnum" aria-hidden="true">
          01
        </div>
      </div>
    </section>
  )
}

function hexA(hex: string, a: number) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

const CSS = `
.hl-howitworks { position: relative; height: 500vh; background: #dde6e2; color: #1f3f33; font-family: var(--hl-font), system-ui, sans-serif; }
.hl-howitworks .hiw-sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; }
.hl-howitworks .hiw-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.hl-howitworks .hiw-phone { position: absolute; left: 70%; top: 50%; transform: translate(-50%, -50%); height: min(78vh, 760px); aspect-ratio: 1080 / 1920; background-image: url("/investors/hardline-call.gif"); background-repeat: no-repeat; background-position: center; background-size: contain; z-index: 2; pointer-events: none; opacity: 1; filter: drop-shadow(14px 14px 30px rgba(179,191,187,0.8)); }
@media (max-width: 760px) { .hl-howitworks .hiw-phone { left: 50%; height: min(62vh, 560px); } }
.hl-howitworks .hiw-labels { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
.hl-howitworks .hiw-nodelabel { position: absolute; top: 0; left: 0; white-space: nowrap; font-size: 13px; font-weight: 600; line-height: 16px; color: #3c574e; opacity: 0; pointer-events: auto; will-change: transform, opacity; }
.hl-howitworks .hiw-panel { position: absolute; left: 0; top: 0; bottom: 0; width: 46%; max-width: 620px; padding: 0 clamp(28px, 5vw, 72px) 0 clamp(56px, 9vw, 140px); display: flex; flex-direction: column; justify-content: center; z-index: 3; pointer-events: none; background: linear-gradient(90deg, #dde6e2 0%, #dde6e2 62%, rgba(221,230,226,0.9) 80%, rgba(221,230,226,0) 100%); }
.hl-howitworks .hiw-step { position: absolute; left: clamp(56px, 9vw, 140px); right: clamp(28px, 5vw, 72px); opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; pointer-events: none; }
.hl-howitworks .hiw-step.is-active { opacity: 1; transform: none; pointer-events: auto; }
.hl-howitworks .hiw-tag { font-size: 13px; letter-spacing: .18em; text-transform: uppercase; color: #59af8c; font-weight: 700; margin: 0 0 18px; }
.hl-howitworks .hiw-title { font-family: var(--hl-font), system-ui, sans-serif; font-weight: 500; letter-spacing: -0.01em; font-size: clamp(28px, 3.3vw, 46px); line-height: 1.1; margin: 0 0 18px; color: #1f3f33; }
.hl-howitworks .hiw-body { font-size: clamp(16px, 1.2vw, 19px); line-height: 1.65; color: #7e908c; max-width: 40ch; margin: 0; }
.hl-howitworks .hiw-dots { position: absolute; left: 22px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 14px; z-index: 4; }
.hl-howitworks .hiw-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(31,63,51,0.18); transition: all .4s ease; }
.hl-howitworks .hiw-dot.is-active { background: #59af8c; transform: scale(1.5); box-shadow: 0 0 12px rgba(89,175,140,0.85); }
.hl-howitworks .hiw-ghostnum { position: absolute; right: 5%; bottom: 2%; font-family: var(--hl-font), system-ui, sans-serif; font-weight: 800; font-size: 150px; line-height: 1; color: #1f3f33; opacity: 0.05; z-index: 1; pointer-events: none; user-select: none; }
@media (max-width: 760px) {
  .hl-howitworks .hiw-panel { width: 100%; max-width: none; justify-content: flex-start; padding-top: 13vh; background: linear-gradient(180deg, #dde6e2 0%, #dde6e2 48%, rgba(221,230,226,0.85) 72%, rgba(221,230,226,0) 100%); }
  .hl-howitworks .hiw-ghostnum { font-size: 96px; }
}
@media (prefers-reduced-motion: reduce) {
  .hl-howitworks .hiw-step, .hl-howitworks .hiw-dot { transition: none; }
}
`
