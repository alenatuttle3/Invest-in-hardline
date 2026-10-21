'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

type VideoPlayerProps = {
  /** Poster shown before playback / while the real video is still TODO. */
  posterSrc: string
  /** The video source — a YouTube URL or a direct video file (MP4, etc.). */
  src?: string
  caption?: string
}

/**
 * Pulls the 11-char video id out of any common YouTube URL shape
 * (youtu.be/ID, watch?v=ID, /embed/ID). Returns null for non-YouTube srcs.
 */
function youTubeId(src?: string): string | null {
  if (!src) return null
  const match = src.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/))([\w-]{11})/
  )
  return match ? match[1] : null
}

/**
 * 16:9 video frame: 4px radius, 1px hairline, no shadow. A YouTube `src` is embedded directly (YouTube's
 * own thumbnail + play button — no placeholder poster). A direct video file
 * shows a poster with a play button until clicked. With no `src` at all it
 * renders a finished-looking placeholder rather than a broken embed.
 */
export default function VideoPlayer({ posterSrc, src, caption = '2–3 min · our story' }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)
  const hasVideo = Boolean(src)
  const ytId = youTubeId(src)

  return (
    <figure className="group">
      <div className="relative aspect-video w-full overflow-hidden rounded-[4px] border border-[color:var(--rule-light)] bg-deep-field">
        {ytId ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title="Founders video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        ) : hasVideo && playing ? (
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
            <span className="absolute inset-0" style={{ background: 'var(--scrim-footage)' }} />

            <span className="absolute left-1/2 top-1/2 flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-mint text-deep-field transition-transform duration-200 group-hover:scale-105">
              <Play className="ml-0.5 h-7 w-7" fill="currentColor" strokeWidth={0} />
            </span>

            <span className="absolute bottom-3 left-3 rounded-[4px] border border-[color:var(--rule-dark)] bg-deep-field px-3 py-1 text-[15px] font-medium uppercase tracking-[0.08em] text-paper">
              {caption}
            </span>
          </button>
        )}
      </div>
    </figure>
  )
}
