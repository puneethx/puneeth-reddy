import { useEffect, useRef, useState } from 'react'
import './navEmbedding.scss'

/**
 * NavEmbedding — UMAP/t-SNE-style 2D projection of section nodes.
 * Each section is a point in embedding space; edges connect points
 * with high semantic similarity. A "query" dot eases between nodes
 * as the user scrolls between sections. Hover a node → its edges to
 * related nodes light up ("attention").
 *
 * Props:
 *   items: [{ href, label }]     — 6 items expected
 *   activeIndex: currently-viewed section
 *   onSelect(idx, item): fired when a node is clicked
 */

const NODE_POSITIONS = {
  about:          { x: 26, y: 30 },
  experience:     { x: 40, y: 20 },
  certifications: { x: 18, y: 60 },
  projects:       { x: 70, y: 42 },
  hackathons:     { x: 78, y: 68 },
  contact:        { x: 52, y: 84 },
}

const EDGES = [
  { a: 'about',          b: 'experience',     w: 0.85 },
  { a: 'about',          b: 'certifications', w: 0.55 },
  { a: 'experience',     b: 'projects',       w: 0.72 },
  { a: 'experience',     b: 'certifications', w: 0.6  },
  { a: 'projects',       b: 'hackathons',     w: 0.9  },
  { a: 'projects',       b: 'certifications', w: 0.4  },
  { a: 'hackathons',     b: 'experience',     w: 0.4  },
  { a: 'contact',        b: 'about',          w: 0.35 },
  { a: 'contact',        b: 'projects',       w: 0.45 },
  { a: 'contact',        b: 'hackathons',     w: 0.3  },
]

export default function NavEmbedding({ items = [], activeIndex = 0, onSelect }) {
  const [hovered, setHovered] = useState(null)
  const [queryPos, setQueryPos] = useState(() => {
    const key = items[activeIndex]?.href?.replace('#', '') || 'about'
    return NODE_POSITIONS[key] || { x: 50, y: 50 }
  })
  const rafRef = useRef(null)
  const stateRef = useRef({ x: queryPos.x, y: queryPos.y })

  useEffect(() => {
    const key = items[activeIndex]?.href?.replace('#', '')
    const target = NODE_POSITIONS[key]
    if (!target) return
    const start = { x: stateRef.current.x, y: stateRef.current.y }
    const t0 = performance.now()
    const dur = 900
    const easeInOutCubic = (t) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2

    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / dur)
      const e = easeInOutCubic(p)
      const x = start.x + (target.x - start.x) * e
      const y = start.y + (target.y - start.y) * e
      stateRef.current = { x, y }
      setQueryPos({ x, y })
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
      else rafRef.current = null
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [activeIndex, items])

  if (!items.length) return null

  const hoveredKey = hovered != null ? items[hovered]?.href?.replace('#', '') : null

  const nodes = items.map((item) => {
    const key = item.href?.replace('#', '')
    return { ...item, key, ...(NODE_POSITIONS[key] || { x: 50, y: 50 }) }
  })

  return (
    <aside
      className="nav-emb"
      role="navigation"
      aria-label="Section navigation — embedding view"
    >
      <div className="ne-panel">
        <div className="ne-canvas">
          <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="ne-query-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff5ea" />
                <stop offset="40%" stopColor="#e8b48c" />
                <stop offset="100%" stopColor="rgba(201,100,66,0)" />
              </radialGradient>
              <radialGradient id="ne-node-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(232,180,140,0.7)" />
                <stop offset="100%" stopColor="rgba(232,180,140,0)" />
              </radialGradient>
            </defs>

            {EDGES.map(({ a, b, w }, i) => {
              const pa = NODE_POSITIONS[a]
              const pb = NODE_POSITIONS[b]
              if (!pa || !pb) return null
              const hot = hoveredKey === a || hoveredKey === b
              return (
                <line
                  key={i}
                  x1={pa.x} y1={pa.y}
                  x2={pb.x} y2={pb.y}
                  className={`ne-edge ${hot ? 'hot' : ''}`}
                  strokeWidth={hot ? 0.5 + w * 0.7 : 0.25 + w * 0.4}
                  opacity={hot ? 0.75 : 0.15 + w * 0.15}
                />
              )
            })}

            <circle
              cx={queryPos.x}
              cy={queryPos.y}
              r="4.5"
              fill="url(#ne-query-grad)"
              opacity="0.6"
            />
            <circle
              cx={queryPos.x}
              cy={queryPos.y}
              r="1.6"
              className="ne-query"
            />

            {nodes.map((n, i) => {
              const isActive = i === activeIndex
              const isHovered = hovered === i
              // Each node + its label share one clickable group. A transparent
              // hit-rect enlarges the click target so the label text is fully
              // active, not just the tiny dot.
              return (
                <g
                  key={n.href}
                  className="ne-hit"
                  onMouseEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onBlur={() => setHovered(null)}
                  onClick={() => onSelect?.(i, n)}
                  tabIndex={0}
                  role="link"
                  aria-label={`Go to ${n.label}`}
                >
                  {/* invisible hit target covering label + node */}
                  <rect
                    x={n.x - 10}
                    y={n.y - 7}
                    width="20"
                    height="12"
                    fill="transparent"
                  />
                  {(isActive || isHovered) && (
                    <circle cx={n.x} cy={n.y} r="6" fill="url(#ne-node-glow)" />
                  )}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isActive ? 2.2 : 1.8}
                    className={`ne-node ${isActive ? 'active' : ''} ${isHovered ? 'hover' : ''}`}
                  />
                  <text
                    x={n.x}
                    y={n.y - 4}
                    textAnchor="middle"
                    className={`ne-label ${isActive ? 'active' : ''} ${isHovered ? 'hover' : ''}`}
                  >
                    {n.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </aside>
  )
}
