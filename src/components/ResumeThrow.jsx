import { useEffect, useState } from 'react'
import './resumeThrow.scss'

/**
 * Multi-paper resume-throw animation:
 *   1. Guy in bottom-left "throws" a stack of papers
 *   2. Papers zoom huge toward the viewer (near camera)
 *   3. Papers then curve up to top-right corner (where browser downloads live)
 *
 * The main App triggers this and renders it as a fixed overlay.
 */
const PAPER_COUNT = 6

function ResumePaper({ variant }) {
  // Slight variations per copy so the sheet doesn't look duplicated
  const primary = variant % 2 === 0 ? '#c96442' : '#a54e30'
  return (
    <svg viewBox="0 0 220 280" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`pg${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f0dccb" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="208" height="268" rx="8" fill={`url(#pg${variant})`} stroke={primary} strokeWidth="2" />
      {/* header block */}
      <rect x="18" y="22" width="120" height="8" rx="2" fill={primary} />
      <rect x="18" y="36" width="80" height="4" rx="1.5" fill="#8a8a94" />
      {/* section */}
      <rect x="18" y="60" width="60" height="6" rx="1.5" fill={primary} />
      <rect x="18" y="74" width="184" height="3" rx="1" fill="#a1a1aa" />
      <rect x="18" y="82" width="170" height="3" rx="1" fill="#a1a1aa" />
      <rect x="18" y="90" width="176" height="3" rx="1" fill="#a1a1aa" />
      <rect x="18" y="98" width="140" height="3" rx="1" fill="#a1a1aa" />
      {/* section 2 */}
      <rect x="18" y="120" width="60" height="6" rx="1.5" fill={primary} />
      <rect x="18" y="134" width="184" height="3" rx="1" fill="#a1a1aa" />
      <rect x="18" y="142" width="160" height="3" rx="1" fill="#a1a1aa" />
      <rect x="18" y="150" width="176" height="3" rx="1" fill="#a1a1aa" />
      {/* section 3 */}
      <rect x="18" y="176" width="60" height="6" rx="1.5" fill={primary} />
      <rect x="18" y="190" width="184" height="3" rx="1" fill="#a1a1aa" />
      <rect x="18" y="198" width="150" height="3" rx="1" fill="#a1a1aa" />
      <rect x="18" y="206" width="176" height="3" rx="1" fill="#a1a1aa" />
      {/* footer chips */}
      <rect x="18" y="232" width="34" height="10" rx="3" fill={primary} opacity="0.9" />
      <rect x="60" y="232" width="34" height="10" rx="3" fill={primary} opacity="0.7" />
      <rect x="102" y="232" width="34" height="10" rx="3" fill={primary} opacity="0.5" />
    </svg>
  )
}

export default function ResumeThrow() {
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    // Whoosh sound (WebAudio)
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'triangle'
      o.frequency.setValueAtTime(180, ctx.currentTime)
      o.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 1.6)
      g.gain.setValueAtTime(0.0001, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.15)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8)
      o.connect(g); g.connect(ctx.destination)
      o.start()
      o.stop(ctx.currentTime + 2)
    } catch (e) { /* ignore */ }

    const t = setTimeout(() => setShowToast(true), 1400)
    return () => clearTimeout(t)
  }, [])

  const papers = Array.from({ length: PAPER_COUNT }, (_, i) => i)

  return (
    <div className="throw-layer" aria-hidden="true">
      {/* Guy silhouette hint flash — subtle */}
      <div className="throw-origin" />

      {papers.map((i) => {
        const delay = i * 0.08
        // Randomize peak positions so the stack fans out during zoom
        const dxPeak = (Math.random() - 0.5) * 260
        const dyPeak = (Math.random() - 0.5) * 160
        const rotBase = (Math.random() - 0.5) * 40
        return (
          <div
            key={i}
            className="paper-fly"
            style={{
              '--delay': `${delay}s`,
              '--dx-peak': `${dxPeak}px`,
              '--dy-peak': `${dyPeak}px`,
              '--rot-base': `${rotBase}deg`,
              zIndex: 500 + i,
            }}
          >
            <div className="paper-inner">
              <ResumePaper variant={i} />
            </div>
          </div>
        )
      })}

      {/* Speed / motion lines during zoom phase */}
      <div className="speed-lines">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} style={{ '--i': i, '--r': Math.random() }} />
        ))}
      </div>

      {/* Landing "sparkle" at top-right download bar */}
      <div className="landing-fx" />

      {showToast && (
        <div className="toast">
          <span className="dot" /> Resume delivered · Check your Downloads
        </div>
      )}
    </div>
  )
}
