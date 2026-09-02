import { getSiteContent } from "@/lib/data/site-content.server"

/**
 * Full-bleed scrolling ticker between the hero and the product grid — pure
 * CSS animation (see globals.css's marquee-scroll keyframe), no JS: the
 * track renders the message list twice back-to-back and slides exactly
 * half its width, so the loop point is invisible. Pauses on hover so it
 * doesn't fight anyone trying to actually read it.
 */
export async function MarqueeBanner() {
  const content = await getSiteContent("marquee")
  const track = [...content.messages, ...content.messages]

  return (
    <div className="bg-carbon border-border overflow-hidden border-y py-3">
      <div className="animate-marquee hover:[animation-play-state:paused] flex w-max items-center">
        {track.map((message, i) => (
          <span key={i} className="text-warm-grey flex items-center text-xs font-medium tracking-[0.2em] uppercase">
            {message}
            <span className="text-accent-champagne mx-8" aria-hidden>
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
