'use client'

type RangeSliderProps = {
  min: number
  max: number
  step: number
  low: number
  high: number
  onChange: (low: number, high: number) => void
  format: (v: number) => string
}

export default function RangeSlider({
  min,
  max,
  step,
  low,
  high,
  onChange,
  format,
}: RangeSliderProps) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100

  return (
    <div>
      <div className="mb-4 flex items-baseline gap-2 text-2xl font-medium text-[color:var(--hl-text)]">
        <span>{format(low)}</span>
        <span className="text-[color:var(--hl-text-muted)]">–</span>
        <span>{format(high)}</span>
      </div>

      <div className="hl-range-dual">
        <div className="hl-range-track" />
        <div
          className="hl-range-fill"
          style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={e => onChange(Math.min(Number(e.target.value), high - step), high)}
          aria-label="Minimum check size"
          aria-valuetext={format(low)}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={e => onChange(low, Math.max(Number(e.target.value), low + step))}
          aria-label="Maximum check size"
          aria-valuetext={format(high)}
        />
      </div>

      <div className="mt-2 flex justify-between text-[11px] text-[color:var(--hl-text-muted)]">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}
