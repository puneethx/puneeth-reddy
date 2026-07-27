import { useEffect, useRef, useState } from 'react'
import './loader.scss'

/**
 * Loader — an "agentic runtime boot" animation.
 *
 * What plays out over ~3s:
 *   1. A central "core" pulses awake (planner brain).
 *   2. Five agent nodes fire up in sequence around it and connect
 *      via glowing wires — like a LangGraph coming online.
 *   3. A live token/tool-use log streams underneath.
 *   4. A progress bar ticks 0 → 100%.
 *   5. Everything collapses into the core and fades out.
 *
 * The component owns its own visibility. Pass `onDone` to be told
 * when the fade-out finishes so the underlying page can start any
 * expensive work that shouldn't compete with the intro animation.
 */

const AGENTS = [
  { key: 'planner',   label: 'PLANNER',   angle: -90 },
  { key: 'retriever', label: 'RETRIEVER', angle: -30 },
  { key: 'executor',  label: 'EXECUTOR',  angle:  30 },
  { key: 'memory',    label: 'MEMORY',    angle:  90 },
  { key: 'reflector', label: 'REFLECTOR', angle: 150 },
  { key: 'router',    label: 'ROUTER',    angle: 210 },
]

// Log lines that stream in — meant to feel like a real agent trace.
const LOG_LINES = [
  { t: 120,  text: '> boot.runtime :: allocating context window …' },
  { t: 320,  text: '> planner.init :: strategy=react graph=LangGraph' },
  { t: 520,  text: '> retriever.load :: hybrid=BM25+cosine k=8' },
  { t: 720,  text: '> executor.dispatch :: tools=[fastapi, python, mcp]' },
  { t: 920,  text: '> memory.attach :: vector_store=OKF chunks=2,144' },
  { t: 1120, text: '> reflector.arm :: guardrails=on evals=on' },
  { t: 1320, text: '> router.wire :: edges=23 verified' },
  { t: 1520, text: '> agent.stream :: "hello, puneeth.reddy" ▊' },
  { t: 1780, text: '> ok · ready · handoff → ui' },
]

export default function Loader({ onDone }) {
  const [visible, setVisible] = useState(true)
  const [phase, setPhase]     = useState('booting') // booting → active → collapsing → gone
  const [progress, setProgress] = useState(0)
  const [logs, setLogs]         = useState([])
  const [litAgents, setLitAgents] = useState([])
  const rafRef = useRef(0)

  // Animate progress bar 0 → 100 over the boot duration.
  useEffect(() => {
    const DUR = 2200
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / DUR)
      setProgress(Math.round(p * 100))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Stream log lines on their scheduled tick.
  useEffect(() => {
    const timers = LOG_LINES.map(({ t, text }) =>
      setTimeout(() => setLogs((l) => [...l, text]), t)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  // Light up the agents one at a time so they read like a boot sequence.
  useEffect(() => {
    const timers = AGENTS.map((a, i) =>
      setTimeout(() => setLitAgents((prev) => [...prev, a.key]), 250 + i * 180)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  // Boot → active → collapse → dismount
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('active'), 300)
    const t2 = setTimeout(() => setPhase('collapsing'), 2400)
    const t3 = setTimeout(() => {
      setPhase('gone')
      setVisible(false)
      onDone?.()
    }, 3100)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  if (!visible) return null

  const RADIUS = 130

  return (
    <div className={`loader loader--${phase}`} role="status" aria-live="polite">
      {/* Ambient orange aurora that pulses in the background */}
      <div className="loader-aurora">
        <span className="loader-aurora-blob b1" />
        <span className="loader-aurora-blob b2" />
        <span className="loader-aurora-blob b3" />
      </div>

      {/* Top banner — mono system-boot text */}
      <div className="loader-head">
        <span className="loader-dot" />
        <span className="loader-brand">
          puneeth<span className="loader-brand-accent">.</span>reddy
        </span>
        <span className="loader-sep">/</span>
        <span className="loader-caption">
          initializing agentic runtime<span className="loader-caret">▊</span>
        </span>
      </div>

      {/* Graph area — core + orbiting agents connected by wires */}
      <div className="loader-graph" aria-hidden="true">
        <svg
          className="loader-graph-svg"
          viewBox="-200 -200 400 400"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="loader-core-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#fff4e8" stopOpacity="1" />
              <stop offset="35%"  stopColor="#e8b48c" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#c96442" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="loader-node-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#ffdec5" />
              <stop offset="60%"  stopColor="#c96442" />
              <stop offset="100%" stopColor="rgba(201,100,66,0)" />
            </radialGradient>
          </defs>

          {/* Concentric rings — spinning at different rates */}
          <circle className="loader-ring r1" cx="0" cy="0" r="55"  />
          <circle className="loader-ring r2" cx="0" cy="0" r="90"  />
          <circle className="loader-ring r3" cx="0" cy="0" r="130" />

          {/* Wires from each agent to the core */}
          {AGENTS.map((a) => {
            const rad = (a.angle * Math.PI) / 180
            const x = Math.cos(rad) * RADIUS
            const y = Math.sin(rad) * RADIUS
            const lit = litAgents.includes(a.key)
            return (
              <line
                key={`w-${a.key}`}
                x1="0" y1="0"
                x2={x} y2={y}
                className={`loader-wire ${lit ? 'lit' : ''}`}
              />
            )
          })}

          {/* Agent nodes */}
          {AGENTS.map((a) => {
            const rad = (a.angle * Math.PI) / 180
            const x = Math.cos(rad) * RADIUS
            const y = Math.sin(rad) * RADIUS
            const lit = litAgents.includes(a.key)
            return (
              <g key={a.key} transform={`translate(${x} ${y})`}>
                {lit && <circle r="18" fill="url(#loader-node-grad)" className="loader-node-glow" />}
                <circle
                  r="7"
                  className={`loader-node ${lit ? 'lit' : ''}`}
                />
                <text
                  y="20"
                  textAnchor="middle"
                  className={`loader-node-label ${lit ? 'lit' : ''}`}
                >
                  {a.label}
                </text>
              </g>
            )
          })}

          {/* Central core — brain of the graph */}
          <circle r="48" fill="url(#loader-core-grad)" className="loader-core-halo" />
          <circle r="14" className="loader-core" />
          <circle r="14" className="loader-core-pulse" />
        </svg>

        {/* Query token flying into the core (visual only) */}
        <div className="loader-query" aria-hidden="true">query</div>
      </div>

      {/* Live agent-trace log */}
      <div className="loader-log" aria-hidden="true">
        {logs.map((line, i) => (
          <div className="loader-log-line" key={i}>{line}</div>
        ))}
      </div>

      {/* Progress bar at the very bottom */}
      <div className="loader-progress">
        <div
          className="loader-progress-fill"
          style={{ width: `${progress}%` }}
        />
        <div className="loader-progress-meta">
          <span>boot</span>
          <span className="loader-progress-pct">{progress}%</span>
        </div>
      </div>
    </div>
  )
}
