/**
 * Custom SVG illustrations for the 3 featured projects — no stock imagery.
 * Each is a schematic scene faithful to the project write-ups.
 */

/* ---------------- Warehouse Fulfillment Agent ---------------- */
export function WarehouseIllustration() {
  return (
    <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" className="illus warehouse">
      <defs>
        <linearGradient id="wh-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#181820" />
          <stop offset="1" stopColor="#0c0c11" />
        </linearGradient>
        <linearGradient id="wh-shelf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1c25" />
          <stop offset="1" stopColor="#12121a" />
        </linearGradient>
        <linearGradient id="wh-orange" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8b48c" />
          <stop offset="1" stopColor="#c96442" />
        </linearGradient>
        <radialGradient id="wh-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(201,100,66,0.55)" />
          <stop offset="1" stopColor="rgba(201,100,66,0)" />
        </radialGradient>
        <pattern id="wh-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
        </pattern>
      </defs>

      <rect width="800" height="500" fill="url(#wh-bg)" />
      <rect width="800" height="500" fill="url(#wh-grid)" />

      {/* Perspective floor */}
      <g opacity="0.35" stroke="rgba(201,100,66,0.35)" strokeWidth="1">
        <line x1="0" y1="420" x2="800" y2="420" />
        <line x1="60" y1="500" x2="360" y2="380" />
        <line x1="740" y1="500" x2="440" y2="380" />
      </g>

      {/* Left shelf (source bin) */}
      <g transform="translate(40, 80)">
        <text x="0" y="-8" fontFamily="monospace" fontSize="10" fill="#e8b48c">Aisle A · Bin B-14</text>
        <rect x="0" y="0" width="150" height="240" rx="4" fill="url(#wh-shelf)" stroke="#2a2a34" />
        {[0, 1, 2, 3].map((row) => (
          <g key={row} transform={`translate(0, ${row * 60})`}>
            <line x1="0" y1="55" x2="150" y2="55" stroke="#2a2a34" />
            <rect x="8" y="12" width="38" height="40" rx="3" fill="#c96442" opacity={row === 1 ? 0.4 : 0.9} />
            {/* empty bin — the flagged one */}
            {row === 1 ? (
              <g>
                <rect x="54" y="10" width="38" height="42" rx="3" fill="rgba(255,255,255,0.02)" stroke="#c96442" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="73" y="36" textAnchor="middle" fontFamily="monospace" fontSize="14" fill="#c96442" fontWeight="700">!</text>
                <circle cx="73" cy="31" r="14" fill="none" stroke="#c96442" strokeWidth="1" opacity="0.6">
                  <animate attributeName="r" values="14;22;14" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0;0.6" dur="1.8s" repeatCount="indefinite" />
                </circle>
              </g>
            ) : (
              <rect x="54" y="12" width="38" height="40" rx="3" fill="#3a3a48" />
            )}
            <rect x="100" y="12" width="38" height="40" rx="3" fill="#e8b48c" opacity="0.7" />
          </g>
        ))}
      </g>

      {/* Right shelf (alternate + reserve zone) */}
      <g transform="translate(610, 80)">
        <text x="0" y="-8" fontFamily="monospace" fontSize="10" fill="#e8b48c">Aisle B · Reserve GR-Z</text>
        <rect x="0" y="0" width="150" height="240" rx="4" fill="url(#wh-shelf)" stroke="#2a2a34" />
        {[0, 1, 2, 3].map((row) => (
          <g key={row} transform={`translate(0, ${row * 60})`}>
            <line x1="0" y1="55" x2="150" y2="55" stroke="#2a2a34" />
            <rect x="8" y="12" width="38" height="40" rx="3" fill={row === 1 ? '#4ade80' : '#3a3a48'} opacity={row === 1 ? 0.9 : 0.7} />
            {row === 1 && <text x="27" y="37" textAnchor="middle" fontFamily="monospace" fontSize="9" fill="#0a0a0b" fontWeight="700">NEW</text>}
            <rect x="54" y="12" width="38" height="40" rx="3" fill="#c96442" opacity="0.7" />
            <rect x="100" y="12" width="38" height="40" rx="3" fill="#e8b48c" opacity="0.6" />
          </g>
        ))}
      </g>

      {/* Central: Supervisor + 2 workers */}
      <g>
        <circle cx="400" cy="180" r="90" fill="url(#wh-glow)" />
        {/* Supervisor */}
        <rect x="356" y="140" width="88" height="34" rx="8" fill="#0f0f14" stroke="#c96442" strokeWidth="1.6" />
        <circle cx="370" cy="157" r="3" fill="#c96442">
          <animate attributeName="r" values="3;5;3" dur="1.6s" repeatCount="indefinite" />
        </circle>
        <text x="386" y="161" fontFamily="monospace" fontSize="10" fill="#f5f5f5" fontWeight="600">Supervisor</text>

        {/* Inventory Agent */}
        <g transform="translate(300, 210)">
          <rect x="0" y="0" width="88" height="30" rx="8" fill="#0f0f14" stroke="rgba(201,100,66,0.6)" strokeWidth="1.4" />
          <circle cx="12" cy="15" r="2.5" fill="#e8b48c" />
          <text x="22" y="19" fontFamily="monospace" fontSize="9" fill="#e8b48c">Inventory</text>
        </g>
        {/* Logistics Agent */}
        <g transform="translate(412, 210)">
          <rect x="0" y="0" width="88" height="30" rx="8" fill="#0f0f14" stroke="rgba(201,100,66,0.6)" strokeWidth="1.4" />
          <circle cx="12" cy="15" r="2.5" fill="#e8b48c" />
          <text x="22" y="19" fontFamily="monospace" fontSize="9" fill="#e8b48c">Logistics</text>
        </g>

        {/* Edges */}
        <path d="M 380 176 L 344 210" stroke="rgba(201,100,66,0.5)" strokeWidth="1.4" strokeDasharray="4 4" fill="none">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="0.8s" repeatCount="indefinite" />
        </path>
        <path d="M 420 176 L 456 210" stroke="rgba(201,100,66,0.5)" strokeWidth="1.4" strokeDasharray="4 4" fill="none">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="0.8s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Order Queue Panel top-right */}
      <g transform="translate(240, 30)" fontFamily="monospace" fontSize="9">
        <rect x="0" y="0" width="320" height="60" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
        <text x="10" y="14" fill="#e8b48c" fontWeight="700">Order Queue</text>
        <g transform="translate(10, 22)">
          <circle cx="4" cy="4" r="3" fill="#4ade80" />
          <text x="12" y="8" fill="#a1a1aa">O-4021 · Pick Complete</text>
        </g>
        <g transform="translate(10, 34)">
          <circle cx="4" cy="4" r="3" fill="#facc15" />
          <text x="12" y="8" fill="#a1a1aa">O-4022 · Pending</text>
        </g>
        <g transform="translate(10, 46)">
          <circle cx="4" cy="4" r="3" fill="#c96442">
            <animate attributeName="opacity" values="1;0.2;1" dur="1s" repeatCount="indefinite" />
          </circle>
          <text x="12" y="8" fill="#c96442" fontWeight="600">O-4023 · Bin Empty · dispatching…</text>
        </g>
      </g>

      {/* AMR robot with path arrow */}
      <g transform="translate(300, 360)">
        <ellipse cx="30" cy="42" rx="34" ry="4" fill="rgba(0,0,0,0.4)" />
        <rect x="0" y="0" width="60" height="34" rx="8" fill="#c96442" />
        <rect x="8" y="6" width="44" height="14" rx="3" fill="#0a0a0b" />
        <circle cx="18" cy="13" r="2" fill="#4ade80" />
        <circle cx="42" cy="13" r="2" fill="#4ade80" />
        <rect x="4" y="22" width="52" height="4" rx="2" fill="#e8b48c" />
        <circle cx="12" cy="38" r="6" fill="#1c1c25" stroke="#c96442" strokeWidth="1.5" />
        <circle cx="48" cy="38" r="6" fill="#1c1c25" stroke="#c96442" strokeWidth="1.5" />
        <rect x="20" y="-14" width="20" height="16" rx="2" fill="#3a3a48" />
        <text x="30" y="-4" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#e8b48c">AMR-02</text>
      </g>

      {/* Path arrow from source to reserve */}
      <path
        d="M 190 400 Q 400 460 610 400"
        stroke="#c96442"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6 6"
        opacity="0.6"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1.2s" repeatCount="indefinite" />
      </path>
      <polygon points="600,395 615,400 600,405" fill="#c96442" />

      {/* HANA write badge */}
      <g transform="translate(30, 380)" fontFamily="monospace" fontSize="9">
        <rect x="0" y="0" width="176" height="46" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
        <text x="10" y="14" fill="#4ade80" fontWeight="700">▸ Write-back to HANA</text>
        <text x="10" y="28" fill="#a1a1aa">bin: B-14 → B-16</text>
        <text x="10" y="40" fill="#a1a1aa">status: Ready for Picking</text>
      </g>

      {/* Fleet badge */}
      <g transform="translate(610, 380)" fontFamily="monospace" fontSize="9">
        <rect x="0" y="0" width="150" height="46" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
        <text x="10" y="14" fill="#e8b48c" fontWeight="700">Fleet · 120 robots</text>
        <text x="10" y="28" fill="#a1a1aa">◉ live · ◑ charging</text>
        <text x="10" y="40" fill="#a1a1aa">avg cycle 42s</text>
      </g>
    </svg>
  )
}

/* ---------------- Enterprise Copilot ---------------- */
export function CopilotIllustration() {
  return (
    <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" className="illus copilot">
      <defs>
        <linearGradient id="cp-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#181820" />
          <stop offset="1" stopColor="#0c0c11" />
        </linearGradient>
        <radialGradient id="cp-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(232,180,140,0.35)" />
          <stop offset="1" stopColor="rgba(232,180,140,0)" />
        </radialGradient>
        <pattern id="cp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="800" height="500" fill="url(#cp-bg)" />
      <rect width="800" height="500" fill="url(#cp-grid)" />

      {/* 3 knowledge sources column left */}
      <g transform="translate(30, 60)" fontFamily="monospace" fontSize="9">
        <rect x="0" y="0" width="180" height="200" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
        <text x="12" y="18" fill="#e8b48c" fontWeight="700">Three Worlds</text>

        {/* Docs */}
        <g transform="translate(12, 32)">
          <rect x="0" y="0" width="24" height="30" rx="2" fill="#c96442" opacity="0.85" />
          <rect x="4" y="5" width="16" height="2" rx="1" fill="#fff" />
          <rect x="4" y="10" width="12" height="1.5" rx="0.5" fill="#fff" opacity="0.8" />
          <rect x="4" y="14" width="14" height="1.5" rx="0.5" fill="#fff" opacity="0.8" />
          <rect x="4" y="18" width="10" height="1.5" rx="0.5" fill="#fff" opacity="0.8" />
          <text x="32" y="12" fill="#f5f5f5" fontWeight="600">Documentation</text>
          <text x="32" y="24" fill="#a1a1aa">PDFs · SAP notes</text>
        </g>

        {/* Live data */}
        <g transform="translate(12, 80)">
          <rect x="0" y="0" width="24" height="30" rx="2" fill="#0f0f14" stroke="#c96442" />
          <rect x="4" y="6" width="16" height="4" rx="1" fill="#c96442" />
          <rect x="4" y="13" width="16" height="4" rx="1" fill="#e8b48c" opacity="0.8" />
          <rect x="4" y="20" width="16" height="4" rx="1" fill="#c96442" opacity="0.5" />
          <text x="32" y="12" fill="#f5f5f5" fontWeight="600">Live Data</text>
          <text x="32" y="24" fill="#a1a1aa">OData · HANA</text>
        </g>

        {/* Exceptions */}
        <g transform="translate(12, 128)">
          <rect x="0" y="0" width="24" height="30" rx="2" fill="#0f0f14" stroke="#c96442" strokeDasharray="2 2" />
          <text x="12" y="20" textAnchor="middle" fontFamily="monospace" fontSize="14" fill="#c96442" fontWeight="700">!</text>
          <text x="32" y="12" fill="#f5f5f5" fontWeight="600">Exceptions</text>
          <text x="32" y="24" fill="#a1a1aa">runbook + data</text>
        </g>

        <text x="12" y="188" fill="#a1a1aa">→ one grounded assistant</text>
      </g>

      {/* Hybrid RAG detail panel bottom-left */}
      <g transform="translate(30, 290)" fontFamily="monospace" fontSize="9">
        <rect x="0" y="0" width="180" height="180" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
        <text x="12" y="18" fill="#e8b48c" fontWeight="700">Hybrid RAG + OKF</text>
        {[
          { l: 'BM25 (keyword)', v: 0.86 },
          { l: 'Cosine (semantic)', v: 0.91 },
          { l: 'RRF fusion', v: 0.94 },
        ].map((r, i) => (
          <g key={r.l} transform={`translate(12, ${34 + i * 20})`}>
            <text fill="#a1a1aa">{r.l}</text>
            <rect x="0" y="4" width="156" height="4" rx="2" fill="rgba(255,255,255,0.06)" />
            <rect x="0" y="4" width={r.v * 156} height="4" rx="2" fill="#c96442" />
            <text x="130" y="1" fill="#e8b48c">{r.v}</text>
          </g>
        ))}
        <line x1="12" y1="108" x2="168" y2="108" stroke="rgba(255,255,255,0.06)" />
        <text x="12" y="124" fill="#e8b48c" fontWeight="600">OKF · structured YAML</text>
        <text x="12" y="138" fill="#a1a1aa">▸ concept-tree</text>
        <text x="12" y="150" fill="#a1a1aa">▸ agent-readable</text>
        <text x="12" y="162" fill="#4ade80">▸ grounding: 0.92</text>
      </g>

      {/* 5-agent graph center */}
      {(() => {
        const cx = 460
        const cy = 220
        const R = 130
        const agents = [
          { name: 'Supervisor', sub: 'router' },
          { name: 'Knowledge', sub: 'RAG + OKF' },
          { name: 'Data', sub: 'OData' },
          { name: 'Exception', sub: 'runbook' },
          { name: 'Synthesis', sub: 'grounded' },
        ]
        const pts = agents.map((_, i) => {
          const a = (i / 5) * Math.PI * 2 - Math.PI / 2
          return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R }
        })
        return (
          <>
            <circle cx={cx} cy={cy} r="170" fill="url(#cp-glow)" />
            {/* faint edges — supervisor to all */}
            {pts.slice(1).map((p, i) => (
              <line
                key={i}
                x1={pts[0].x}
                y1={pts[0].y}
                x2={p.x}
                y2={p.y}
                stroke="rgba(201,100,66,0.2)"
                strokeWidth="1"
              />
            ))}
            {/* flow: Supervisor -> Knowledge -> Synthesis */}
            <path
              d={`M ${pts[0].x} ${pts[0].y} Q ${cx - 40} ${cy - 20} ${pts[1].x} ${pts[1].y}`}
              stroke="#c96442"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5 5"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.7s" repeatCount="indefinite" />
            </path>
            <path
              d={`M ${pts[1].x} ${pts[1].y} Q ${cx - 40} ${cy + 40} ${pts[4].x} ${pts[4].y}`}
              stroke="#c96442"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5 5"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="0.7s" begin="0.35s" repeatCount="indefinite" />
            </path>
            {/* nodes */}
            {pts.map((p, i) => {
              const isSup = i === 0
              return (
                <g key={i} transform={`translate(${p.x}, ${p.y})`}>
                  <circle r="30" fill="#0f0f14" stroke={isSup ? '#c96442' : 'rgba(201,100,66,0.55)'} strokeWidth={isSup ? 2 : 1.4} />
                  <circle r="30" fill="none" stroke="rgba(201,100,66,0.25)" strokeWidth="1">
                    <animate attributeName="r" values="30;42;30" dur="2.2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2.2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                  </circle>
                  <text y="-2" fontFamily="monospace" fontSize="10" fill="#f5f5f5" textAnchor="middle" fontWeight="600">
                    {agents[i].name}
                  </text>
                  <text y="12" fontFamily="monospace" fontSize="8" fill="#e8b48c" textAnchor="middle">
                    {agents[i].sub}
                  </text>
                </g>
              )
            })}
            <circle cx={cx} cy={cy} r="16" fill="#c96442" opacity="0.9" />
            <text x={cx} y={cy + 3} fontFamily="monospace" fontSize="9" fill="#0a0a0b" textAnchor="middle" fontWeight="700">
              CTX
            </text>
          </>
        )
      })()}

      {/* Query panel bottom-right — grounded answer */}
      <g transform="translate(230, 400)" fontFamily="monospace" fontSize="10">
        <rect x="0" y="0" width="540" height="80" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
        <circle cx="18" cy="24" r="5" fill="#4ade80" />
        <text x="34" y="28" fill="#f5f5f5">user &gt; list open POs over 50k</text>
        <line x1="12" y1="42" x2="520" y2="42" stroke="rgba(255,255,255,0.06)" />
        <text x="12" y="60" fill="#e8b48c">agent &gt; 14 open POs · citations: [PO-4021] [PO-4088]</text>
        <text x="12" y="72" fill="#4ade80" fontSize="9">grounding 0.92 · above threshold ✓</text>
      </g>
    </svg>
  )
}

/* ---------------- DRA / Daksha Humanoid Robot Agent ---------------- */
export function DakshaIllustration() {
  return (
    <svg viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg" className="illus daksha">
      <defs>
        <linearGradient id="dk-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141420" />
          <stop offset="100%" stopColor="#0a0a10" />
        </linearGradient>
        <linearGradient id="dk-plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="100%" stopColor="#b8b8c2" />
        </linearGradient>
        <linearGradient id="dk-orange" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8b48c" />
          <stop offset="100%" stopColor="#c96442" />
        </linearGradient>
        <radialGradient id="dk-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c96442" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#c96442" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="500" fill="url(#dk-bg)" />
      {/* Faint grid */}
      <g stroke="rgba(255,255,255,0.035)" strokeWidth="1">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="500" />
        ))}
        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} />
        ))}
      </g>

      {/* Ambient glow behind robot */}
      <circle cx="240" cy="270" r="220" fill="url(#dk-glow)" />

      {/* ========== HUMANOID ROBOT ========== */}
      {/* Ground shadow */}
      <ellipse cx="240" cy="460" rx="90" ry="10" fill="rgba(0,0,0,0.45)" />

      {/* Feet */}
      <rect x="200" y="440" width="34" height="16" rx="4" fill="#0a0a0f" />
      <rect x="248" y="440" width="34" height="16" rx="4" fill="#0a0a0f" />

      {/* Legs — lower */}
      <rect x="210" y="370" width="22" height="72" rx="6" fill="#22222c" />
      <rect x="252" y="370" width="22" height="72" rx="6" fill="#22222c" />
      {/* knee joints */}
      <circle cx="221" cy="370" r="8" fill="url(#dk-orange)" />
      <circle cx="263" cy="370" r="8" fill="url(#dk-orange)" />
      {/* Legs — upper */}
      <rect x="208" y="310" width="26" height="62" rx="6" fill="#2a2a34" />
      <rect x="250" y="310" width="26" height="62" rx="6" fill="#2a2a34" />

      {/* Pelvis */}
      <rect x="196" y="290" width="94" height="26" rx="8" fill="url(#dk-orange)" />
      <rect x="238" y="298" width="10" height="10" fill="#0a0a0f" opacity="0.6" />

      {/* Torso — main body */}
      <rect x="182" y="180" width="122" height="120" rx="16" fill="url(#dk-plate)" stroke="#c96442" strokeWidth="2" />

      {/* Chest — dark panel */}
      <rect x="204" y="204" width="78" height="76" rx="8" fill="#0a0a0f" />

      {/* Chest LEDs */}
      <circle cx="222" cy="222" r="4" fill="#4ade80">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="243" cy="222" r="4" fill="#e8b48c" />
      <circle cx="264" cy="222" r="4" fill="#c96442">
        <animate attributeName="opacity" values="0.5;1;0.5" dur="1.8s" repeatCount="indefinite" />
      </circle>

      {/* Chest data bars */}
      <rect x="214" y="240" width="60" height="4" rx="2" fill="#c96442" />
      <rect x="214" y="250" width="46" height="4" rx="2" fill="#e8b48c" opacity="0.85" />
      <rect x="214" y="260" width="54" height="4" rx="2" fill="#c96442" opacity="0.6" />
      <rect x="214" y="270" width="38" height="4" rx="2" fill="#e8b48c" opacity="0.5" />

      {/* Shoulders */}
      <circle cx="182" cy="196" r="18" fill="url(#dk-orange)" />
      <circle cx="304" cy="196" r="18" fill="url(#dk-orange)" />

      {/* Left arm (viewer's left) */}
      <rect x="160" y="196" width="24" height="70" rx="8" fill="#2a2a34" />
      <circle cx="172" cy="266" r="9" fill="url(#dk-orange)" />
      <rect x="152" y="266" width="22" height="60" rx="8" fill="#2a2a34" />
      {/* left hand holding a package */}
      <rect x="140" y="316" width="46" height="34" rx="4" fill="#c96442" />
      <rect x="146" y="322" width="34" height="4" rx="1" fill="#ffffff" />
      <rect x="146" y="330" width="24" height="2" rx="1" fill="#ffffff" opacity="0.7" />
      <rect x="146" y="336" width="28" height="2" rx="1" fill="#ffffff" opacity="0.7" />
      <circle cx="152" cy="314" r="8" fill="url(#dk-plate)" />

      {/* Right arm — reaching down */}
      <rect x="302" y="196" width="24" height="70" rx="8" fill="#2a2a34" />
      <circle cx="314" cy="266" r="9" fill="url(#dk-orange)" />
      <rect x="304" y="266" width="22" height="70" rx="8" fill="#2a2a34" />
      <circle cx="315" cy="342" r="10" fill="url(#dk-plate)" />

      {/* Neck */}
      <rect x="228" y="164" width="30" height="20" rx="4" fill="#c96442" />

      {/* Head */}
      <rect x="200" y="100" width="88" height="70" rx="18" fill="url(#dk-plate)" stroke="#c96442" strokeWidth="2" />
      {/* Visor */}
      <rect x="212" y="122" width="64" height="26" rx="8" fill="#0a0a0f" />
      {/* Eyes */}
      <rect x="222" y="132" width="14" height="6" rx="3" fill="#c96442">
        <animate attributeName="fill" values="#c96442;#e8b48c;#c96442" dur="1.6s" repeatCount="indefinite" />
      </rect>
      <rect x="252" y="132" width="14" height="6" rx="3" fill="#c96442">
        <animate attributeName="fill" values="#c96442;#e8b48c;#c96442" dur="1.6s" begin="0.2s" repeatCount="indefinite" />
      </rect>
      {/* Speaker mouth */}
      <rect x="230" y="156" width="28" height="5" rx="2" fill="#c96442" />
      {/* Ear pieces */}
      <rect x="192" y="122" width="10" height="26" rx="3" fill="#c96442" />
      <rect x="286" y="122" width="10" height="26" rx="3" fill="#c96442" />
      {/* Antenna */}
      <line x1="244" y1="100" x2="244" y2="76" stroke="#c96442" strokeWidth="3" strokeLinecap="round" />
      <circle cx="244" cy="72" r="5" fill="#c96442">
        <animate attributeName="r" values="5;7;5" dur="1.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.5;1" dur="1.4s" repeatCount="indefinite" />
      </circle>

      {/* Robot label */}
      <text x="244" y="470" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#c96442" fontWeight="700">DRA · Daksha</text>

      {/* ========== VOICE COMMAND BUBBLE (top) ========== */}
      <rect x="360" y="30" width="420" height="52" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" />
      <circle cx="380" cy="56" r="6" fill="#4ade80">
        <animate attributeName="r" values="6;8;6" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <text x="396" y="50" fontFamily="monospace" fontSize="10" fill="#e8b48c">operator ▸</text>
      <text x="396" y="66" fontFamily="monospace" fontSize="11" fill="#f5f5f5">"Pick from bin A, deliver to zone B"</text>

      {/* ========== JOULE MULTI-AGENT BRAIN ========== */}
      <text x="380" y="110" fontFamily="monospace" fontSize="11" fill="#e8b48c" fontWeight="700">Joule Multi-Agent Brain</text>

      {/* Orchestrator */}
      <rect x="480" y="122" width="180" height="34" rx="10" fill="#0f0f14" stroke="#c96442" strokeWidth="2" />
      <circle cx="500" cy="139" r="4" fill="#c96442">
        <animate attributeName="r" values="4;6;4" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <text x="570" y="144" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="#f5f5f5" fontWeight="700">Orchestrator</text>

      {/* Connection lines */}
      <line x1="570" y1="156" x2="470" y2="196" stroke="#c96442" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6">
        <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="0.9s" repeatCount="indefinite" />
      </line>
      <line x1="570" y1="156" x2="470" y2="262" stroke="#c96442" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6">
        <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="0.9s" begin="0.3s" repeatCount="indefinite" />
      </line>
      <line x1="570" y1="156" x2="470" y2="328" stroke="#c96442" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6">
        <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="0.9s" begin="0.6s" repeatCount="indefinite" />
      </line>

      {/* Sub-agent: Navigation */}
      <rect x="380" y="180" width="380" height="40" rx="10" fill="#0f0f14" stroke="rgba(201,100,66,0.6)" />
      <circle cx="404" cy="200" r="6" fill="url(#dk-orange)" />
      <text x="420" y="198" fontFamily="monospace" fontSize="11" fill="#f5f5f5" fontWeight="600">Navigation</text>
      <text x="420" y="212" fontFamily="monospace" fontSize="9" fill="#a1a1aa">plan · move</text>
      <rect x="600" y="196" width="140" height="6" rx="3" fill="rgba(255,255,255,0.08)" />
      <rect x="600" y="196" width="140" height="6" rx="3" fill="url(#dk-orange)">
        <animate attributeName="width" values="0;140;140" dur="2.5s" repeatCount="indefinite" />
      </rect>

      {/* Sub-agent: Manipulation */}
      <rect x="380" y="246" width="380" height="40" rx="10" fill="#0f0f14" stroke="rgba(201,100,66,0.6)" />
      <circle cx="404" cy="266" r="6" fill="url(#dk-orange)" />
      <text x="420" y="264" fontFamily="monospace" fontSize="11" fill="#f5f5f5" fontWeight="600">Manipulation</text>
      <text x="420" y="278" fontFamily="monospace" fontSize="9" fill="#a1a1aa">pick · place</text>
      <rect x="600" y="262" width="140" height="6" rx="3" fill="rgba(255,255,255,0.08)" />
      <rect x="600" y="262" width="140" height="6" rx="3" fill="url(#dk-orange)">
        <animate attributeName="width" values="0;140;140" dur="3s" repeatCount="indefinite" />
      </rect>

      {/* Sub-agent: Inspection */}
      <rect x="380" y="312" width="380" height="40" rx="10" fill="#0f0f14" stroke="rgba(201,100,66,0.6)" />
      <circle cx="404" cy="332" r="6" fill="url(#dk-orange)" />
      <text x="420" y="330" fontFamily="monospace" fontSize="11" fill="#f5f5f5" fontWeight="600">Inspection</text>
      <text x="420" y="344" fontFamily="monospace" fontSize="9" fill="#a1a1aa">analyze · verify</text>
      <rect x="600" y="328" width="140" height="6" rx="3" fill="rgba(255,255,255,0.08)" />
      <rect x="600" y="328" width="140" height="6" rx="3" fill="url(#dk-orange)">
        <animate attributeName="width" values="0;140;140" dur="3.4s" repeatCount="indefinite" />
      </rect>

      {/* ========== STATUS TELEMETRY ========== */}
      <rect x="380" y="378" width="380" height="94" rx="10" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
      <text x="394" y="396" fontFamily="monospace" fontSize="11" fill="#e8b48c" fontWeight="700">Step-by-step status</text>

      <circle cx="400" cy="416" r="4" fill="#4ade80" />
      <text x="414" y="420" fontFamily="monospace" fontSize="10" fill="#a1a1aa">nav ▸ bin A · arrived</text>

      <circle cx="400" cy="434" r="4" fill="#4ade80" />
      <text x="414" y="438" fontFamily="monospace" fontSize="10" fill="#a1a1aa">grip ▸ product · secured</text>

      <circle cx="400" cy="452" r="4" fill="#facc15">
        <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
      </circle>
      <text x="414" y="456" fontFamily="monospace" fontSize="10" fill="#e8b48c">nav ▸ zone B · in-transit</text>

      {/* Ancestry chip */}
      <rect x="30" y="30" width="200" height="30" rx="15" fill="rgba(201,100,66,0.12)" stroke="rgba(201,100,66,0.4)" />
      <circle cx="46" cy="45" r="5" fill="#c96442" />
      <text x="60" y="49" fontFamily="monospace" fontSize="10" fill="#e8b48c">follow-up · AMR ▸ humanoid</text>
    </svg>
  )
}
