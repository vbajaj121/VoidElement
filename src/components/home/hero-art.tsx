/**
 * Original art-directed hero graphic — no product photography exists yet,
 * so this leans on abstract draped-fabric forms under dramatic spotlight
 * rather than a literal garment illustration, which reads as premium without
 * needing pixel-perfect garment proportions.
 */
export function HeroArt() {
  return (
    <div className="pointer-events-none relative h-full w-full overflow-hidden">
      {/* Directional spotlight the fabric sits inside */}
      <div
        aria-hidden
        className="absolute top-[10%] right-[-15%] h-[60%] w-[60%] rounded-full opacity-25 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--accent-champagne), transparent 40%), transparent 70%)",
        }}
      />

      <svg
        viewBox="0 0 600 800"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="fold-a" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#262624" />
            <stop offset="45%" stopColor="#111110" />
            <stop offset="100%" stopColor="#050505" />
          </linearGradient>
          <linearGradient id="fold-c" x1="0%" y1="10%" x2="100%" y2="90%">
            <stop offset="0%" stopColor="#1c1a17" />
            <stop offset="50%" stopColor="#0c0c0b" />
            <stop offset="100%" stopColor="#030303" />
          </linearGradient>
          <linearGradient id="rim-light" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#f0d6ac" stopOpacity="0.95" />
            <stop offset="18%" stopColor="#c9a668" stopOpacity="0.55" />
            <stop offset="45%" stopColor="#6b5636" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#6b5636" stopOpacity="0" />
          </linearGradient>
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>

        {/* Brand watermark, faint, behind the fabric */}
        <g transform="translate(430,260)" opacity="0.05">
          <LogoMarkSvg scale={9} />
        </g>

        {/* Podium the piece is staged on */}
        <ellipse cx="430" cy="700" rx="190" ry="26" fill="#000000" opacity="0.55" />
        <ellipse cx="430" cy="694" rx="150" ry="8" fill="var(--accent-champagne)" opacity="0.18" />

        {/* Halo ring framing the staged piece */}
        <g className="animate-aurora" style={{ transformOrigin: "430px 380px" }}>
          <circle
            cx="430"
            cy="380"
            r="210"
            fill="none"
            stroke="var(--accent-champagne)"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
          <circle
            cx="430"
            cy="380"
            r="210"
            fill="none"
            stroke="var(--soft-white)"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            strokeDasharray="4 620"
            strokeLinecap="round"
          />
        </g>

        {/* Back fold — dark, sets depth */}
        <path
          d="M 400,-40 C 540,80 590,260 520,420 C 470,530 380,560 360,680
             C 348,760 400,820 500,830 L 640,830 L 640,-40 Z"
          fill="url(#fold-a)"
        />

        {/* Front fold — mostly dark, the rim-light sliver below does the work of "catching the light" */}
        <path
          d="M 300,20 C 430,110 480,270 410,410 C 360,510 270,540 250,660
             C 238,745 300,800 400,790 C 470,782 520,720 540,620
             C 570,470 545,300 590,140 C 605,88 580,40 500,10
             C 440,-12 350,-8 300,20 Z"
          fill="url(#fold-c)"
        />

        {/* Thin highlight sliver — the one deliberate bright accent, like light catching a fold's edge */}
        <path
          d="M 486,10 C 546,55 582,175 566,310 C 558,378 534,432 512,468
             C 526,410 542,330 548,260 C 556,168 536,80 470,32 Z"
          fill="url(#rim-light)"
        />

        <rect width="600" height="800" filter="url(#grain)" opacity="0.045" style={{ mixBlendMode: "overlay" }} />
      </svg>
    </div>
  )
}

/** Inline copy of the logo mark scaled up for use inside the hero SVG's own viewBox/coordinate space. */
function LogoMarkSvg({ scale }: { scale: number }) {
  return (
    <g stroke="var(--soft-white)" strokeWidth={1.15 / scale} fill="none" transform={`scale(${scale})`}>
      <ellipse cx="0" cy="0" rx="14" ry="5.6" />
      <ellipse cx="0" cy="0" rx="14" ry="5.6" transform="rotate(60)" />
      <ellipse cx="0" cy="0" rx="14" ry="5.6" transform="rotate(120)" />
    </g>
  )
}
