'use client'

import { useEffect, useRef } from 'react'

/* =============================================================================
   Scroll-driven "How it works" scene.
   Self-contained: all CSS scoped under .hl-howitworks, all animation runs on a
   single canvas driven by this section's scroll position. An IntersectionObserver
   only runs the rAF loop while the section is on screen. prefers-reduced-motion
   freezes the ambient motion (pulse / dashes / particles) but keeps the
   scroll-mapped stages so the story still reads.
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

const CAT_COLOR: Record<Cat, string> = {
  project: '#e8a245',
  phase: '#4fae70',
  person: '#b8d4b8',
  issue: '#e87b45',
  decision: '#7dd3a8',
  workflow: '#4fae70',
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
  { id: 'wf_log', cat: 'workflow', dest: 'procore', color: '#4fae70', imp: 3, x: 34, y: 32, label: 'Daily Log' },
  { id: 'wf_rfi', cat: 'workflow', dest: 'procore', color: '#4fae70', imp: 2, x: 54, y: 38, label: 'RFI' },
  { id: 'wf_task', cat: 'workflow', dest: 'procore', color: '#4fae70', imp: 2, x: 46, y: 58, label: 'Task' },
  { id: 'wf_draw', cat: 'workflow', dest: 'acc', color: '#5bc4f5', imp: 2, x: 68, y: 30, label: 'Drawing Rev' },
  { id: 'wf_model', cat: 'workflow', dest: 'acc', color: '#5bc4f5', imp: 1, x: 76, y: 52, label: 'Model Conflict' },
  { id: 'wf_punch', cat: 'workflow', dest: 'fieldwire', color: '#a78bfa', imp: 2, x: 42, y: 74, label: 'Punch Item' },
  { id: 'wf_insp', cat: 'workflow', dest: 'fieldwire', color: '#a78bfa', imp: 1, x: 58, y: 86, label: 'Inspection' },
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

type Integration = {
  key: 'procore' | 'acc' | 'fieldwire'
  name: string
  dot: string
  border: string
  topOffset: number // px from vertical center
  items: string[]
  group: string[]
}
const INTEGRATIONS: Integration[] = [
  {
    key: 'procore',
    name: 'Procore',
    dot: '#4fae70',
    border: 'rgba(79,174,112,0.25)',
    topOffset: -210,
    items: ['→ Daily Log drafted', '→ RFI #47 created', '→ Task assigned'],
    group: ['wf_log', 'wf_rfi', 'wf_task'],
  },
  {
    key: 'acc',
    name: 'Autodesk ACC',
    dot: '#5bc4f5',
    border: 'rgba(91,196,245,0.22)',
    topOffset: -36,
    items: ['→ Drawing rev flagged', '→ Model conflict noted'],
    group: ['wf_draw', 'wf_model'],
  },
  {
    key: 'fieldwire',
    name: 'Fieldwire',
    dot: '#a78bfa',
    border: 'rgba(167,139,250,0.22)',
    topOffset: 140,
    items: ['→ Punch item logged', '→ Inspection task set'],
    group: ['wf_punch', 'wf_insp'],
  },
]

const STEPS = [
  {
    tag: '01 / Capture',
    title: 'Every conversation. Automatically.',
    body: 'Hardline captures inbound and outbound calls, site meetings, and every field conversation — no new phone number, no behavior change. Hardline ingests audio, photos, and video, and is compatible with cell phones, Meta AI glasses, and walkie-talkies.',
  },
  {
    tag: '02 / Intelligence',
    title: 'A personalized knowledge map for every user.',
    body: "Projects, phases, subcontractors, issues, and decisions — all cross-linked in real time. The institutional knowledge that lives in one person's head, finally structured, searchable, and sharable.",
  },
  {
    tag: '03 / Automation',
    title: 'Straight into the tools that run the job.',
    body: 'Hardline powers touchless workflows — daily log updated, task created, punch item closed out, safety form filed — the moment the conversation ends.',
  },
]

const S1_END = 0.34
const S2_END = 0.67
const BADGE_W = 230

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
    // Canvas ctx.font can't read CSS vars; resolve the Montserrat family name.
    const montFam =
      getComputedStyle(root).getPropertyValue('--hl-font').trim() ||
      'system-ui, sans-serif'
    const stepEls = Array.from(root.querySelectorAll<HTMLElement>('.hiw-step'))
    const dotEls = Array.from(root.querySelectorAll<HTMLElement>('.hiw-dot'))
    const badgeEls = Array.from(root.querySelectorAll<HTMLElement>('.hiw-badge'))
    const labelEls = Array.from(root.querySelectorAll<HTMLElement>('.hiw-nodelabel'))
    const ghostEl = root.querySelector<HTMLElement>('.hiw-ghostnum')

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
      seed: i + 1,
    }))

    let W = 0
    let H = 0
    let dpr = 1
    const badgeAnchor: Record<string, { x: number; y: number }> = {}

    function layout() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas!.clientWidth
      H = canvas!.clientHeight
      canvas!.width = Math.round(W * dpr)
      canvas!.height = Math.round(H * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

      for (const n of nodes) {
        n.tx = W * 0.02 + (n.def.x / 100) * W * 0.96
        n.ty = H * 0.02 + (n.def.y / 100) * H * 0.96
        n.sx = (0.38 + rng(n.seed * 12.9898) * (0.9 - 0.38)) * W
        n.sy = (0.08 + rng(n.seed * 78.233 + 1) * (0.92 - 0.08)) * H
      }

      // integration anchors = left-middle of each DOM badge
      for (const integ of INTEGRATIONS) {
        const ax = W - 36 - BADGE_W
        const ay = H / 2 + integ.topOffset + 18
        badgeAnchor[integ.key] = { x: ax, y: ay }
      }
    }

    function scrollProgress() {
      const rect = root!.getBoundingClientRect()
      const total = root!.offsetHeight - window.innerHeight
      return clamp(total > 0 ? -rect.top / total : 0)
    }

    // DOM state we only touch on change
    let domStage = -1
    let badgesIn = false

    function updateDom(stage: number, s2: number) {
      if (stage !== domStage) {
        domStage = stage
        stepEls.forEach((el, i) => el.classList.toggle('is-active', i === stage))
        dotEls.forEach((el, i) => el.classList.toggle('is-active', i === stage))
        if (ghostEl) ghostEl.textContent = `0${stage + 1}`
      }
      const shouldIn = s2 > 0.28
      if (shouldIn !== badgesIn) {
        badgesIn = shouldIn
        badgeEls.forEach(el => el.classList.toggle('is-in', shouldIn))
      }
    }

    // ---- drawing ----
    let animT = 0

    function drawPhone(alpha: number) {
      if (alpha <= 0.01) return
      const cx = W * 0.7
      const cy = H * 0.5
      const ph = Math.min(H * 0.6, 460)
      const pw = ph * 0.49
      const x = cx - pw / 2
      const y = cy - ph / 2
      const rad = pw * 0.13
      ctx!.save()
      ctx!.globalAlpha = alpha
      // body
      ctx!.beginPath()
      roundRect(x, y, pw, ph, rad)
      ctx!.fillStyle = '#0a140f'
      ctx!.fill()
      ctx!.lineWidth = 2
      ctx!.strokeStyle = 'rgba(79,174,112,0.35)'
      ctx!.stroke()
      // screen
      const sx = x + pw * 0.06
      const sy = y + ph * 0.05
      const sw = pw * 0.88
      const sh = ph * 0.9
      ctx!.beginPath()
      roundRect(sx, sy, sw, sh, rad * 0.7)
      ctx!.fillStyle = '#0c1d15'
      ctx!.fill()
      // "Capturing live" pill
      const pulse = reduced ? 0.7 : 0.5 + 0.5 * Math.sin(animT * 3)
      ctx!.fillStyle = `rgba(79,174,112,${0.18 + 0.12 * pulse})`
      ctx!.beginPath()
      roundRect(sx + sw * 0.12, sy + sh * 0.08, sw * 0.76, 26, 13)
      ctx!.fill()
      ctx!.fillStyle = '#4fae70'
      ctx!.beginPath()
      ctx!.arc(sx + sw * 0.2, sy + sh * 0.08 + 13, 4, 0, Math.PI * 2)
      ctx!.fill()
      ctx!.fillStyle = '#cfe7d8'
      ctx!.font = `600 12px ${montFam}`
      ctx!.textAlign = 'left'
      ctx!.textBaseline = 'middle'
      ctx!.fillText('Capturing live…', sx + sw * 0.28, sy + sh * 0.08 + 13)
      // waveform bars
      const bars = 26
      const bw = (sw * 0.78) / bars
      const bx0 = sx + sw * 0.11
      const midY = sy + sh * 0.5
      ctx!.fillStyle = '#4fae70'
      for (let i = 0; i < bars; i++) {
        const phase = reduced ? 1 : Math.abs(Math.sin(animT * 2 + i * 0.5))
        const bh = sh * (0.04 + 0.26 * phase)
        const bxi = bx0 + i * bw
        ctx!.globalAlpha = alpha * 0.9
        ctx!.beginPath()
        roundRect(bxi, midY - bh / 2, bw * 0.55, bh, bw * 0.27)
        ctx!.fill()
      }
      ctx!.restore()
    }

    function roundRect(x: number, y: number, w: number, h: number, r: number) {
      const rr = Math.min(r, w / 2, h / 2)
      ctx!.beginPath()
      ctx!.moveTo(x + rr, y)
      ctx!.arcTo(x + w, y, x + w, y + h, rr)
      ctx!.arcTo(x + w, y + h, x, y + h, rr)
      ctx!.arcTo(x, y + h, x, y, rr)
      ctx!.arcTo(x, y, x + w, y, rr)
      ctx!.closePath()
    }

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
      updateDom(stage, s2)

      ctx!.clearRect(0, 0, W, H)

      // node current positions + alphas. Nodes settle at their map positions
      // and stay there; in stage 3 everything that doesn't wire to a system
      // simply fades out, leaving the workflow nodes (and their links to the
      // integrations) in focus.
      const blackout = easeInOut(clamp(s2 * 1.4))
      const alphas: number[] = []
      nodes.forEach((n, i) => {
        const form = easeOut5(clamp((s1 - (i / nodes.length) * 0.12) / 0.88))
        n.px = lerp(n.sx, n.tx, form)
        n.py = lerp(n.sy, n.ty, form)
        let a = clamp(form * 1.4)
        if (n.def.cat !== 'workflow') a *= 1 - blackout
        alphas[i] = a
      })

      drawHalos(s1 * (1 - blackout))
      drawEdges(alphas)
      if (s2 > 0.001) drawAutomation(s2)
      drawNodes(alphas, s1)
      updateLabels(alphas, s1)
      drawPhone(phoneAlpha)
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

    function drawEdges(alphas: number[]) {
      ctx!.save()
      ctx!.lineCap = 'round'
      const dash = reduced ? 0 : -animT * 30
      for (const [aId, bId] of EDGES) {
        const ia = idx.get(aId)!
        const ib = idx.get(bId)!
        const na = nodes[ia]
        const nb = nodes[ib]
        const ea = Math.min(alphas[ia], alphas[ib])
        if (ea <= 0.02) continue
        const owner = CAT_RANK[na.def.cat] >= CAT_RANK[nb.def.cat] ? na : nb
        ctx!.strokeStyle = hexA(owner.color, 0.28 * ea)
        ctx!.lineWidth = na.def.imp === 3 || nb.def.imp === 3 ? 1 : 0.6
        ctx!.setLineDash([5, 5])
        ctx!.lineDashOffset = dash
        ctx!.beginPath()
        ctx!.moveTo(na.px, na.py)
        ctx!.lineTo(nb.px, nb.py)
        ctx!.stroke()
      }
      ctx!.setLineDash([])
      ctx!.restore()
    }

    function drawAutomation(s2: number) {
      ctx!.save()
      const drawT = easeOut5(clamp((s2 - 0.1) / 0.9))
      for (const integ of INTEGRATIONS) {
        const anchor = badgeAnchor[integ.key]
        const grp = integ.group.map(id => nodes[idx.get(id)!])
        // Trunk originates from the group's primary node so the line touches a dot.
        const origin = grp[0]
        const p0x = origin.px
        const p0y = origin.py
        const p3x = anchor.x
        const p3y = anchor.y
        const p1x = lerp(p0x, p3x, 0.45)
        const p1y = p0y
        const p2x = p3x - 26
        const p2y = p3y
        // feeders (each secondary node -> badge; the origin is served by the trunk)
        ctx!.setLineDash([3, 4])
        ctx!.lineDashOffset = reduced ? 0 : -animT * 24
        ctx!.lineWidth = 0.6
        for (const n of grp) {
          if (n === origin) continue
          ctx!.strokeStyle = hexA(n.color, 0.3 * s2)
          ctx!.beginPath()
          ctx!.moveTo(n.px, n.py)
          ctx!.lineTo(anchor.x, anchor.y)
          ctx!.stroke()
        }
        // trunk
        ctx!.setLineDash([])
        ctx!.lineWidth = 2
        ctx!.strokeStyle = hexA(integ.dot, 0.55 * drawT)
        ctx!.beginPath()
        ctx!.moveTo(p0x, p0y)
        const steps = 24
        for (let s = 1; s <= steps; s++) {
          const t = (s / steps) * drawT
          ctx!.lineTo(bez(p0x, p1x, p2x, p3x, t), bez(p0y, p1y, p2y, p3y, t))
        }
        ctx!.stroke()
        // particles
        if (!reduced && drawT > 0.05) {
          for (let k = 0; k < 5; k++) {
            const t = ((animT * 0.4 + k / 5) % 1) * drawT
            const x = bez(p0x, p1x, p2x, p3x, t)
            const y = bez(p0y, p1y, p2y, p3y, t)
            ctx!.fillStyle = hexA(integ.dot, 0.9)
            ctx!.beginPath()
            ctx!.arc(x, y, 2.2, 0, Math.PI * 2)
            ctx!.fill()
          }
        }
      }
      ctx!.restore()
    }

    function drawNodes(alphas: number[], s1: number) {
      ctx!.save()
      ctx!.textAlign = 'left'
      ctx!.textBaseline = 'middle'
      nodes.forEach((n, i) => {
        const a = alphas[i]
        if (a <= 0.02) return
        const pulse = reduced ? 1 : 1 + 0.08 * Math.sin(animT * 2 + i)
        const r = n.r * pulse
        // glow
        const g = ctx!.createRadialGradient(n.px, n.py, 0, n.px, n.py, r * 4)
        g.addColorStop(0, hexA(n.color, 0.5 * a))
        g.addColorStop(1, hexA(n.color, 0))
        ctx!.fillStyle = g
        ctx!.fillRect(n.px - r * 4, n.py - r * 4, r * 8, r * 8)
        // core
        ctx!.fillStyle = hexA(n.color, a)
        ctx!.beginPath()
        ctx!.arc(n.px, n.py, r, 0, Math.PI * 2)
        ctx!.fill()
        // ring for imp3 / workflow
        if (n.def.imp === 3 || n.def.cat === 'workflow') {
          ctx!.strokeStyle = hexA('#eaf7f0', 0.5 * a)
          ctx!.lineWidth = 1
          ctx!.beginPath()
          ctx!.arc(n.px, n.py, r + 3, 0, Math.PI * 2)
          ctx!.stroke()
        }
      })
      ctx!.restore()
    }

    // Node labels are real (selectable) DOM positioned over the canvas.
    function updateLabels(alphas: number[], s1: number) {
      const reveal = clamp((s1 - 0.5) * 2)
      nodes.forEach((n, i) => {
        const el = labelEls[i]
        if (!el) return
        el.style.opacity = (reveal * alphas[i]).toFixed(3)
        el.style.transform = `translate(${(n.px + n.r + 6).toFixed(1)}px, ${(n.py - 7).toFixed(1)}px)`
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
      <style>{CSS}</style>
      <div className="hiw-sticky">
        <canvas ref={canvasRef} className="hiw-canvas" />

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

        <div className="hiw-badges" aria-hidden="true">
          {INTEGRATIONS.map(integ => (
            <div
              key={integ.key}
              className="hiw-badge"
              style={{
                top: `calc(50% + ${integ.topOffset}px)`,
                borderColor: integ.border,
              }}
            >
              <div className="hiw-badge-head">
                <span className="hiw-badge-dot" style={{ background: integ.dot }} />
                {integ.name}
              </div>
              {integ.items.map(it => (
                <div key={it} className="hiw-badge-item">
                  {it}
                </div>
              ))}
            </div>
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
.hl-howitworks { position: relative; height: 500vh; background: #0c1812; color: #e8f0ec; font-family: var(--hl-font), system-ui, sans-serif; }
.hl-howitworks .hiw-sticky { position: sticky; top: 0; height: 100vh; overflow: hidden; }
.hl-howitworks .hiw-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.hl-howitworks .hiw-labels { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
.hl-howitworks .hiw-nodelabel { position: absolute; top: 0; left: 0; white-space: nowrap; font-size: 11px; font-weight: 500; line-height: 14px; color: #d6e7dc; opacity: 0; pointer-events: auto; will-change: transform, opacity; }
.hl-howitworks .hiw-panel { position: absolute; left: 0; top: 0; bottom: 0; width: 42%; max-width: 540px; padding: 0 clamp(24px, 5vw, 72px); display: flex; flex-direction: column; justify-content: center; z-index: 3; pointer-events: none; background: linear-gradient(90deg, #0c1812 0%, rgba(12,24,18,0.86) 55%, rgba(12,24,18,0) 100%); }
.hl-howitworks .hiw-step { position: absolute; left: clamp(24px, 5vw, 72px); right: clamp(24px, 5vw, 72px); opacity: 0; transform: translateY(18px); transition: opacity .6s ease, transform .6s ease; pointer-events: none; }
.hl-howitworks .hiw-step.is-active { opacity: 1; transform: none; pointer-events: auto; }
.hl-howitworks .hiw-tag { font-size: 13px; letter-spacing: .18em; text-transform: uppercase; color: #4fae70; font-weight: 700; margin: 0 0 18px; }
.hl-howitworks .hiw-title { font-family: var(--hl-font), system-ui, sans-serif; font-weight: 800; letter-spacing: -0.02em; font-size: clamp(28px, 3.3vw, 46px); line-height: 1.08; margin: 0 0 18px; color: #f3f8f4; }
.hl-howitworks .hiw-body { font-size: clamp(15px, 1.1vw, 17px); line-height: 1.6; color: #a9bdb2; max-width: 40ch; margin: 0; }
.hl-howitworks .hiw-dots { position: absolute; left: 22px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 14px; z-index: 4; }
.hl-howitworks .hiw-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.18); transition: all .4s ease; }
.hl-howitworks .hiw-dot.is-active { background: #4fae70; transform: scale(1.5); box-shadow: 0 0 12px rgba(79,174,112,0.85); }
.hl-howitworks .hiw-badges { position: absolute; right: 36px; top: 0; bottom: 0; width: ${BADGE_W}px; z-index: 3; pointer-events: none; }
.hl-howitworks .hiw-badge { position: absolute; right: 0; width: ${BADGE_W}px; background: rgba(12,24,18,0.74); backdrop-filter: blur(6px); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 14px 16px; opacity: 0; transform: translateX(22px); transition: opacity .5s ease, transform .5s ease; pointer-events: auto; }
.hl-howitworks .hiw-badge.is-in { opacity: 1; transform: none; }
.hl-howitworks .hiw-badge:nth-child(1) { transition-delay: 0s; }
.hl-howitworks .hiw-badge:nth-child(2) { transition-delay: .1s; }
.hl-howitworks .hiw-badge:nth-child(3) { transition-delay: .2s; }
.hl-howitworks .hiw-badge-head { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; color: #eaf2ec; margin-bottom: 8px; }
.hl-howitworks .hiw-badge-dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }
.hl-howitworks .hiw-badge-item { font-size: 12.5px; color: #9fb3a8; line-height: 1.75; }
.hl-howitworks .hiw-ghostnum { position: absolute; right: 5%; bottom: 2%; font-family: var(--hl-font), system-ui, sans-serif; font-weight: 800; font-size: 150px; line-height: 1; color: #fff; opacity: 0.022; z-index: 1; pointer-events: none; user-select: none; }
@media (max-width: 760px) {
  .hl-howitworks .hiw-panel { width: 100%; max-width: none; justify-content: flex-start; padding-top: 13vh; background: linear-gradient(180deg, #0c1812 0%, rgba(12,24,18,0.7) 58%, rgba(12,24,18,0) 100%); }
  .hl-howitworks .hiw-badges { display: none; }
  .hl-howitworks .hiw-ghostnum { font-size: 96px; }
}
@media (prefers-reduced-motion: reduce) {
  .hl-howitworks .hiw-step, .hl-howitworks .hiw-dot, .hl-howitworks .hiw-badge { transition: none; }
}
`
