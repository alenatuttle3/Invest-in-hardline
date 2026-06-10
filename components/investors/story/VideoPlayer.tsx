'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

type VideoPlayerProps = {
  /** Poster shown before playback / while the real video is still TODO. */
  posterSrc: string
  /** The video source. Empty for now — see TODO below. */
  src?: string
  caption?: string
}

/**
 * 16:9 neumorphic video frame. While `src` is empty it renders an intentional,
 * finished-looking placeholder (poster + mint play button + caption) rather
 * than a broken embed. Once the real founders video exists, pass `src` and it
 * plays inline.
 */
export default function VideoPlayer({ posterSrc, src, caption = '2–3 min · our story' }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  // TODO: wire `src` to the real founders video (Loom/MP4/hosted embed URL).
  const hasVideo = Boolean(src)

  return (
    <figure className="group rounded-[22px] bg-[color:var(--hl-base)] p-2.5 shadow-neu-md">
      <div className="relative aspect-video w-full overflow-hidden rounded-[16px] bg-hardline-950 shadow-neu-inset">
        {hasVideo && playing ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            src={src}
            poster={posterSrc}
            controls
            autoPlay
            className="h-full w-full object-cover"
          />
        ) : (
          <button
            type="button"
            onClick={() => hasVideo && setPlaying(true)}
            aria-label={hasVideo ? 'Play the founders video' : 'Founders video — coming soon'}
            className="absolute inset-0 h-full w-full cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={posterSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-hardline-950/70 via-hardline-950/10 to-transparent" />

            <span className="absolute left-1/2 top-1/2 flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[color:var(--hl-base)] text-mint shadow-neu transition-transform duration-200 group-hover:scale-105">
              <Play className="ml-0.5 h-7 w-7" fill="currentColor" strokeWidth={0} />
            </span>

            <span className="absolute bottom-3 left-3 rounded-full bg-[color:var(--hl-base)] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[color:var(--hl-text)] shadow-neu-sm">
              {caption}
            </span>
          </button>
        )}
      </div>
    </figure>
  )
}
