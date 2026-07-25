import { useEffect, useRef, useState, useCallback } from 'react'
import './stackCanvas.scss'

/* =============================================================
 * StackCanvas — draggable node canvas inside a macOS-style window.
 * Category tabs on top: hover a tab to highlight its nodes.
 * ============================================================ */

const CATEGORY_COLORS = {
  agentic:  '#c96442',
  ml:       '#e8b48c',
  backend:  '#7a3826',
  frontend: '#c9a15b',
}

const CATEGORIES = [
  { key: 'agentic',  label: 'Agentic' },
  { key: 'ml',       label: 'ML / Vision' },
  { key: 'backend',  label: 'Backend' },
  { key: 'frontend', label: 'Frontend' },
]

const INITIAL_NODES = [
  // Agentic (left)
  { id: 'langgraph', label: 'LangGraph',   category: 'agentic',  x: 100, y: 60,  size: 'lg' },
  { id: 'langchain', label: 'LangChain',   category: 'agentic',  x: 95,  y: 155, size: 'md' },
  { id: 'hybrid',    label: 'Hybrid RAG',  category: 'agentic',  x: 230, y: 105, size: 'md' },
  { id: 'mcp',       label: 'MCP',         category: 'agentic',  x: 225, y: 205, size: 'sm' },
  { id: 'multi',     label: 'Multi-Agent', category: 'agentic',  x: 80,  y: 250, size: 'md' },

  // ML / Vision
  { id: 'pytorch',   label: 'PyTorch',     category: 'ml',       x: 415, y: 55,  size: 'md' },
  { id: 'yolo',      label: 'YOLOv8',      category: 'ml',       x: 545, y: 100, size: 'sm' },
  { id: 'c3d',       label: 'C3D',         category: 'ml',       x: 400, y: 155, size: 'sm' },
  { id: 'ocr',       label: 'OCR',         category: 'ml',       x: 535, y: 195, size: 'sm' },

  // Backend
  { id: 'fastapi',   label: 'FastAPI',     category: 'backend',  x: 230, y: 300, size: 'md' },
  { id: 'python',    label: 'Python',      category: 'backend',  x: 360, y: 350, size: 'md' },
  { id: 'flask',     label: 'Flask',       category: 'backend',  x: 115, y: 340, size: 'sm' },

  // Frontend
  { id: 'react',     label: 'React',       category: 'frontend', x: 670, y: 55,  size: 'md' },
  { id: 'next',      label: 'Next.js',     category: 'frontend', x: 720, y: 155, size: 'sm' },
  { id: 'three',     label: 'Three Fiber', category: 'frontend', x: 685, y: 255, size: 'sm' },
  { id: 'scss',      label: 'SCSS',        category: 'frontend', x: 565, y: 320, size: 'sm' },
]

const EDGES = [
  ['langgraph', 'langchain'],
  ['langgraph', 'hybrid'],
  ['langgraph', 'multi'],
  ['langgraph', 'mcp'],
  ['langchain', 'hybrid'],
  ['langchain', 'multi'],
  ['hybrid', 'mcp'],
  ['langgraph', 'pytorch'],
  ['multi', 'yolo'],
  ['multi', 'c3d'],
  ['pytorch', 'yolo'],
  ['pytorch', 'c3d'],
  ['yolo', 'ocr'],
  ['langgraph', 'fastapi'],
  ['hybrid', 'fastapi'],
  ['fastapi', 'python'],
  ['flask', 'python'],
  ['pytorch', 'python'],
  ['yolo', 'python'],
  ['fastapi', 'react'],
  ['react', 'next'],
  ['react', 'three'],
  ['react', 'scss'],
]

const CANVAS_W = 800
const CANVAS_H = 400

export default function StackCanvas() {
  // Each node has:
  //  x, y      — actual (rendered) position
  //  tx, ty    — target position (where it wants to be)
  //  vx, vy    — current velocity (used for spring dynamics + release throw)
  const [nodes, setNodes] = useState(() =>
    INITIAL_NODES.map((n) => ({ ...n, tx: n.x, ty: n.y, vx: 0, vy: 0 }))
  )
  const [draggingId, setDraggingId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)

  // Collaborator-cursor state — the fake "Puneeth" who swoops in and fixes
  // your changes.
  //   phase: 'idle' | 'enter' | 'grabbing' | 'commenting' | 'leaving'
  //   typedMsg: message text being streamed one char at a time
  //   bubbleSide: 'right' | 'left' — flips the comment bubble away from
  //     canvas edges so it never gets clipped by overflow: hidden.
  //   bubbleAbove: boolean — if the cursor is near the bottom, the bubble
  //     shows above rather than below.
  const [collab, setCollab] = useState({
    visible: false, x: 0, y: 0, phase: 'idle',
    showBubble: false, typedMsg: '', typing: false,
    bubbleSide: 'right', bubbleAbove: false,
  })

  const containerRef = useRef(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  const lastPointer = useRef({ x: 0, y: 0, t: 0 })
  const rafRef = useRef(0)
  const draggingIdRef = useRef(null)
  draggingIdRef.current = draggingId
  const nodesLiveRef = useRef(nodes)
  nodesLiveRef.current = nodes
  const collabTimersRef = useRef([])
  const collabRunningRef = useRef(false)
  // FIFO queue of node IDs waiting to be reverted. When the user tampers
  // with several nodes quickly, each one gets queued and Puneeth visits
  // them in order instead of only chasing the latest edit.
  const collabQueueRef = useRef([])
  // Rotates through the message pool so consecutive triggers use different lines
  const msgCursorRef = useRef(0)

  const clientToCanvas = useCallback((clientX, clientY) => {
    const el = containerRef.current
    if (!el) return { x: 0, y: 0 }
    const rect = el.getBoundingClientRect()
    const scaleX = CANVAS_W / rect.width
    const scaleY = CANVAS_H / rect.height
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }, [])

  /* ----------------- Spring physics loop ----------------- */
  // Uses functional setNodes so it always reads the latest state — including
  // any position update the pointer-move handler just wrote. That prevents
  // the RAF loop from overwriting the drag with stale data.
  useEffect(() => {
    const STIFF = 0.14
    const DAMP  = 0.72
    const SETTLE_V = 0.05

    let last = performance.now()
    const step = (now) => {
      const dt = Math.min((now - last) / 16.667, 3)
      last = now

      setNodes((prev) => {
        let anyMoving = false
        const dragId = draggingIdRef.current
        const next = prev.map((n) => {
          if (n.id === dragId) return n // dragging → direct-controlled
          const dx = n.tx - n.x
          const dy = n.ty - n.y
          const dist = Math.hypot(dx, dy)
          const speed = Math.hypot(n.vx, n.vy)
          if (dist < 0.4 && speed < SETTLE_V) return n // already at rest — no change
          anyMoving = true
          let vx = (n.vx + dx * STIFF * dt) * Math.pow(DAMP, dt)
          let vy = (n.vy + dy * STIFF * dt) * Math.pow(DAMP, dt)
          let x = n.x + vx * dt
          let y = n.y + vy * dt
          if (Math.hypot(vx, vy) < SETTLE_V && Math.hypot(n.tx - x, n.ty - y) < 0.4) {
            x = n.tx; y = n.ty; vx = 0; vy = 0
          }
          return { ...n, x, y, vx, vy }
        })
        // Bail out cheaply if nothing changed — avoids a re-render
        return anyMoving ? next : prev
      })

      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Clean up any collaborator timers on unmount
  useEffect(() => {
    return () => {
      collabTimersRef.current.forEach((t) => {
        if (typeof t === 'number') clearTimeout(t)
        else if (t && typeof t.cancel === 'function') t.cancel()
      })
    }
  }, [])

  /* ----------------- Pointer handlers ----------------- */
  const onPointerDown = (e, node) => {
    e.preventDefault()
    e.stopPropagation()
    const { x, y } = clientToCanvas(e.clientX, e.clientY)
    dragOffset.current = { x: x - node.x, y: y - node.y }
    lastPointer.current = { x, y, t: performance.now() }
    // Kill any velocity — the drag is now authoritative
    setNodes((prev) =>
      prev.map((n) => (n.id === node.id ? { ...n, vx: 0, vy: 0 } : n))
    )
    setDraggingId(node.id)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!draggingId) return
    const { x, y } = clientToCanvas(e.clientX, e.clientY)
    const nx = Math.max(20, Math.min(CANVAS_W - 20, x - dragOffset.current.x))
    const ny = Math.max(20, Math.min(CANVAS_H - 20, y - dragOffset.current.y))
    // Track pointer velocity for release throw
    const now = performance.now()
    const dt = Math.max(1, now - lastPointer.current.t)
    const vx = ((x - lastPointer.current.x) / dt) * 16 // scale to per-frame
    const vy = ((y - lastPointer.current.y) / dt) * 16
    lastPointer.current = { x, y, t: now }
    setNodes((prev) =>
      prev.map((n) =>
        n.id === draggingId
          ? { ...n, x: nx, y: ny, tx: nx, ty: ny, vx, vy }
          : n
      )
    )
  }

  const onPointerUp = (e) => {
    if (!draggingId) return
    try { e.currentTarget.releasePointerCapture?.(e.pointerId) } catch (_) {}
    const releasedId = draggingId
    // On release, keep the current position as the new target and let the
    // pointer's residual velocity carry the node a bit further (spring pulls
    // it back in slightly, creating a subtle overshoot/wobble).
    setNodes((prev) =>
      prev.map((n) =>
        n.id === releasedId
          ? { ...n, tx: n.x, ty: n.y }
          : n
      )
    )
    setDraggingId(null)
    // Trigger the "Puneeth" collaborator cursor to swoop in and revert
    triggerCollabRevert(releasedId)
  }

  /* ----------------- Collaborator cursor scene -----------------
   * Public entry — enqueue a node to be reverted. If Puneeth isn't busy,
   * start the queue processor after the initial 2s wait. If he's already
   * on his way / working, the node joins the FIFO queue and will be
   * visited after the current + earlier queued nodes.
   */
  const triggerCollabRevert = (nodeId) => {
    // Don't double-queue the same node if it's already in the pending list
    // (e.g. dragging a node twice quickly should only need one revert).
    if (!collabQueueRef.current.includes(nodeId)) {
      collabQueueRef.current.push(nodeId)
    }
    // If a scene is already running, it will pick this up when it finishes.
    if (collabRunningRef.current) return

    collabRunningRef.current = true
    // Initial 2s wait before Puneeth first appears, then process the queue.
    const wait = setTimeout(() => processCollabQueue(), 2000)
    collabTimersRef.current = [wait]
  }

  /* Processes the next node in the queue. When one revert scene finishes,
   * it calls this again. When the queue is empty, Puneeth leaves. */
  const processCollabQueue = () => {
    const nodeId = collabQueueRef.current.shift()
    if (!nodeId) {
      // Queue drained — leave scene
      leaveCollab()
      return
    }
    const init = INITIAL_NODES.find((i) => i.id === nodeId)
    const node = nodesLiveRef.current.find((n) => n.id === nodeId)
    if (!node || !init) {
      processCollabQueue()
      return
    }
    const targetPos = { x: init.x, y: init.y }
    // If this node was manually moved back / snapped home in the meantime,
    // skip it and go to the next in the queue.
    if (Math.hypot(node.x - targetPos.x, node.y - targetPos.y) < 8) {
      processCollabQueue()
      return
    }
    runCollabForNode(nodeId, targetPos)
  }

  /* Send the cursor smoothly off-screen and reset scene state. */
  const leaveCollab = () => {
    setCollab((c) => ({ ...c, x: CANVAS_W + 80, y: -30, phase: 'leaving', showBubble: false, typedMsg: '', typing: false }))
    const t_end = setTimeout(() => {
      setCollab({ visible: false, x: 0, y: 0, phase: 'idle', showBubble: false, typedMsg: '', typing: false, bubbleSide: 'right', bubbleAbove: false })
      collabRunningRef.current = false
    }, 900)
    collabTimersRef.current.push(t_end)
  }

  /* One node's full revert scene — travel → grab → drag → comment → next. */
  const runCollabForNode = (nodeId, targetPos) => {
    const nodeNow = nodesLiveRef.current.find((n) => n.id === nodeId)
    if (!nodeNow) { processCollabQueue(); return }
    const currentPos = { x: nodeNow.x, y: nodeNow.y }
    const TRAVEL_DUR  = 900      // cursor's flight to the node
    const DRAG_DUR    = 700      // dragging node back to origin
    const BEAT_AFTER  = 500      // 0.5s silence before comment
    const TYPE_STEP   = 45
    // Rotate through a pool of messages — each drop picks the next one so
    // you don't see the same line twice in a row.
    const MESSAGE_POOL = [
      "Hey, please leave the layout as-is.",
      "That node lives here for a reason.",
      "Restoring my careful graph. Thanks.",
      "Nice try — I've put this back.",
      "This layout is version-controlled.",
      "Kindly don't rearrange my stack.",
      "Nothing personal, reverting the move.",
      "The graph is calibrated. Hands off.",
      "Snapping it back — this position matters.",
      "Appreciate the curiosity, keeping it tidy.",
    ]
    const FULL_MSG = MESSAGE_POOL[msgCursorRef.current % MESSAGE_POOL.length]
    msgCursorRef.current++

    /* Cursor's start point for THIS visit.
     * If the cursor is already visible on-canvas (chaining from a prior
     * node), start from wherever it is now — no re-spawning off-screen
     * between queued visits. Otherwise spawn off-screen right.
     * We read the ref via a synchronous updater trick because state is
     * async, but avoid using it directly since collab state may lag. */
    let startX, startY
    setCollab((c) => {
      startX = c.visible ? c.x : CANVAS_W + 60
      startY = c.visible ? c.y : 40
      return {
        ...c,
        visible: true,
        x: startX,
        y: startY,
        phase: 'enter',
        showBubble: false,
        typedMsg: '',
        typing: false,
      }
    })

    // -------- Phase B: cursor TRAVELS toward the node --------
    const travelSteps = 24
    let travelIx = 0
    const travelT = setInterval(() => {
      travelIx++
      const p = travelIx / travelSteps
      const ease = 1 - Math.pow(1 - p, 3)
      const x = startX + (currentPos.x + 4 - startX) * ease
      const y = startY + (currentPos.y + 4 - startY) * ease
      setCollab((c) => ({ ...c, x, y }))
      if (travelIx >= travelSteps) clearInterval(travelT)
    }, TRAVEL_DUR / travelSteps)

    // -------- Phase C: after cursor arrives, grab + drag node home --------
    const t_grab = setTimeout(() => {
      setCollab((c) => ({ ...c, phase: 'grabbing' }))

      const dragSteps = 20
      let dragIx = 0
      const dragT = setInterval(() => {
        dragIx++
        const p = dragIx / dragSteps
        const ease = p < 0.5 ? 4*p*p*p : 1 - Math.pow(-2*p+2, 3)/2
        const x = currentPos.x + (targetPos.x - currentPos.x) * ease
        const y = currentPos.y + (targetPos.y - currentPos.y) * ease
        setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, tx: x, ty: y } : n)))
        setCollab((c) => ({ ...c, x: x + 4, y: y + 4 }))
        if (dragIx >= dragSteps) clearInterval(dragT)
      }, DRAG_DUR / dragSteps)

      collabTimersRef.current.push({ cancel: () => clearInterval(dragT) })

      // -------- Phase D: 0.5s beat, then bubble appears --------
      const BUBBLE_W = 260, BUBBLE_H = 72, EDGE_PAD = 12
      const cursorX = targetPos.x + 4
      const cursorY = targetPos.y + 4
      const bubbleSide = (cursorX + 22 + BUBBLE_W + EDGE_PAD > CANVAS_W) ? 'left' : 'right'
      const bubbleAbove = (cursorY + 30 + BUBBLE_H + EDGE_PAD > CANVAS_H)

      const t_bubble = setTimeout(() => {
        setCollab((c) => ({
          ...c,
          phase: 'commenting',
          showBubble: true,
          typedMsg: '',
          typing: true,
          bubbleSide,
          bubbleAbove,
        }))
      }, DRAG_DUR + BEAT_AFTER)

      // -------- Phase E: stream message char by char --------
      let ti = 0
      let typeInterval = null
      const t_startTyping = setTimeout(() => {
        typeInterval = setInterval(() => {
          ti++
          if (ti > FULL_MSG.length) {
            clearInterval(typeInterval)
            setCollab((c) => ({ ...c, typing: false }))
            return
          }
          setCollab((c) => ({ ...c, typedMsg: FULL_MSG.slice(0, ti) }))
        }, TYPE_STEP)
      }, DRAG_DUR + BEAT_AFTER + 200)

      // -------- Phase F: hide bubble, hand off to next queued node --------
      const STREAM_TIME = FULL_MSG.length * TYPE_STEP + 400
      const t_hideBubble = setTimeout(() => {
        setCollab((c) => ({ ...c, showBubble: false, typedMsg: '', typing: false }))
      }, DRAG_DUR + BEAT_AFTER + 200 + STREAM_TIME + 800)

      const t_next = setTimeout(() => {
        processCollabQueue()
      }, DRAG_DUR + BEAT_AFTER + 200 + STREAM_TIME + 1200)

      collabTimersRef.current.push(
        t_bubble,
        t_startTyping,
        { cancel: () => typeInterval && clearInterval(typeInterval) },
        t_hideBubble,
        t_next,
      )
    }, TRAVEL_DUR + 40)

    collabTimersRef.current.push(
      { cancel: () => clearInterval(travelT) },
      t_grab,
    )
  }


  const handleReset = () => {
    // Set targets to originals — spring loop animates them back into place
    setNodes((prev) =>
      prev.map((n) => {
        const init = INITIAL_NODES.find((i) => i.id === n.id)
        return init
          ? { ...n, tx: init.x, ty: init.y }
          : n
      })
    )
    setDraggingId(null)
  }

  const nodesById = nodes.reduce((acc, n) => {
    acc[n.id] = n
    return acc
  }, {})

  // Determine which nodes/edges are "hot"
  // Priority: dragging > hovered node > hovered category
  const activeNodeId = draggingId || hoveredId
  const isNodeHot = (node) => {
    if (activeNodeId) return node.id === activeNodeId
    if (activeCategory) return node.category === activeCategory
    return false
  }
  const isNodeDim = (node) => {
    if (activeNodeId) return false // don't dim when hovering a single node
    if (activeCategory) return node.category !== activeCategory
    return false
  }
  const isEdgeHot = (a, b) => {
    if (activeNodeId) return a === activeNodeId || b === activeNodeId
    if (activeCategory) {
      return nodesById[a]?.category === activeCategory &&
             nodesById[b]?.category === activeCategory
    }
    return false
  }
  const isEdgeDim = (a, b) => {
    if (activeNodeId) return !(a === activeNodeId || b === activeNodeId)
    if (activeCategory) {
      return !(nodesById[a]?.category === activeCategory &&
               nodesById[b]?.category === activeCategory)
    }
    return false
  }

  return (
    <div className="stack-canvas-wrap">
      {/* Left info panel — sits alongside the mac window on desktop */}
      <aside className="scv-info">
        <div className="scv-info-badge">
          <span className="scv-info-badge-dot" />
          <span>Interactive graph</span>
        </div>
        <h4 className="scv-info-title">
          The tools I actually use — <em>and how they wire together.</em>
        </h4>

        <div className="scv-info-tip">
          <div className="scv-info-tip-icon">
            {/* stop / do-not-touch glyph */}
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M5.5 5.5 L18.5 18.5" />
            </svg>
          </div>
          <div className="scv-info-tip-body">
            <div className="scv-info-tip-title">Notice</div>
            <div className="scv-info-tip-text">
              Please don't move the nodes. The layout is calibrated.
            </div>
          </div>
        </div>
      </aside>

      {/* macOS window */}
      <div className={`mac-window ${draggingId ? 'dragging' : ''}`}>
        {/* Title bar with traffic lights */}
        <div className="mac-titlebar">
          <div className="mac-traffic">
            <span className="mac-dot red" />
            <span className="mac-dot yellow" />
            <span className="mac-dot green" />
          </div>
          <div className="mac-title">stack.graph — puneeth</div>
          {/* spacer to balance the traffic-lights on the left */}
          <div className="mac-titlebar-spacer" />
        </div>

        {/* Body: left sidebar tabs + canvas */}
        <div className="mac-body">
          {/* Vertical category sidebar */}
          <aside className="mac-sidebar">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`mac-tab ${activeCategory === c.key ? 'active' : ''}`}
                style={{ '--tc': CATEGORY_COLORS[c.key] }}
                onMouseEnter={() => setActiveCategory(c.key)}
                onMouseLeave={() => setActiveCategory(null)}
                onFocus={() => setActiveCategory(c.key)}
                onBlur={() => setActiveCategory(null)}
              >
                <span className="mac-tab-dot" />
                <span className="mac-tab-label">{c.label}</span>
              </button>
            ))}
          </aside>

          {/* Canvas */}
          <div
            ref={containerRef}
            className={`stack-canvas ${draggingId ? 'dragging' : ''}`}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            onDoubleClick={handleReset}
          >
          {/* Grid background */}
          <svg
            className="scv-grid"
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <pattern id="scv-dots" width="22" height="22" patternUnits="userSpaceOnUse">
                <circle cx="11" cy="11" r="1" fill="rgba(232, 180, 140, 0.14)" />
              </pattern>
            </defs>
            <rect width={CANVAS_W} height={CANVAS_H} fill="url(#scv-dots)" />
          </svg>

          {/* Static wires (no pulses) */}
          <svg
            className="scv-wires"
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            {EDGES.map(([a, b], i) => {
              const na = nodesById[a]
              const nb = nodesById[b]
              if (!na || !nb) return null

              // Cubic Bezier with gravity sag + velocity drag.
              // Control points are placed 1/3 and 2/3 along the line, then
              // shifted DOWN by a distance-scaled sag amount. Each end's
              // control point is also nudged by that end's velocity so the
              // wire visibly trails a fast-moving node — think coiled cable.
              const dx = nb.x - na.x
              const dy = nb.y - na.y
              const len = Math.hypot(dx, dy) || 1
              const sag = Math.min(len * 0.18, 55) // droop, capped
              const c1x = na.x + dx * 0.33 + (na.vx || 0) * 1.2
              const c1y = na.y + dy * 0.33 + sag + (na.vy || 0) * 1.2
              const c2x = na.x + dx * 0.66 + (nb.vx || 0) * 1.2
              const c2y = na.y + dy * 0.66 + sag + (nb.vy || 0) * 1.2
              const d = `M ${na.x} ${na.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${nb.x} ${nb.y}`

              const hot = isEdgeHot(a, b)
              const dim = isEdgeDim(a, b)
              return (
                <g key={`${a}-${b}`}>
                  {/* Shadow under the wire — subtle depth cue */}
                  <path
                    d={d}
                    className={`scv-edge-shadow ${hot ? 'hot' : ''} ${dim ? 'dim' : ''}`}
                  />
                  {/* Actual wire */}
                  <path
                    d={d}
                    className={`scv-edge-line ${hot ? 'hot' : ''} ${dim ? 'dim' : ''}`}
                  />
                </g>
              )
            })}
          </svg>

          {/* Nodes */}
          <div className="scv-nodes-layer">
            {nodes.map((n) => {
              const color = CATEGORY_COLORS[n.category]
              const isDragging = draggingId === n.id
              const hot = isNodeHot(n)
              const dim = isNodeDim(n)
              const leftPct = (n.x / CANVAS_W) * 100
              const topPct  = (n.y / CANVAS_H) * 100
              return (
                <button
                  key={n.id}
                  type="button"
                  className={`scv-node scv-node--${n.size} ${isDragging ? 'dragging' : ''} ${hot ? 'hot' : ''} ${dim ? 'dim' : ''}`}
                  style={{
                    left: `${leftPct}%`,
                    top: `${topPct}%`,
                    '--nc': color,
                  }}
                  onPointerDown={(e) => onPointerDown(e, n)}
                  onPointerEnter={() => setHoveredId(n.id)}
                  onPointerLeave={() => setHoveredId(null)}
                  onDragStart={(e) => e.preventDefault()}
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="scv-node-dot" />
                  <span className="scv-node-label">{n.label}</span>
                </button>
              )
            })}
          </div>

          {/* Collaborator cursor — the "Puneeth" ghost pointer that swoops
              in from the right, fixes your edit, and leaves a sticky
              comment. Positioned in canvas logical coords, converted to %
              so it stays aligned with nodes at any container width. */}
          {collab.visible && (
            <div
              className={`scv-collab scv-collab--${collab.phase}`}
              style={{
                left: `${(collab.x / CANVAS_W) * 100}%`,
                top:  `${(collab.y / CANVAS_H) * 100}%`,
              }}
              aria-hidden="true"
            >
              {/* Figma-style arrow cursor */}
              <svg viewBox="0 0 24 24" className="scv-collab-cursor" width="22" height="22">
                <path
                  d="M4 2 L4 20 L9 15.2 L12.4 22 L15.3 20.5 L11.9 13.9 L18.5 12.8 Z"
                  fill="var(--accent)"
                  stroke="#1a0e08"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Name tag */}
              <span className="scv-collab-tag">Puneeth</span>

              {/* Sticky comment bubble — message streams in char-by-char */}
              {collab.showBubble && (
                <div
                  className={`scv-collab-bubble scv-collab-bubble--${collab.bubbleSide} ${collab.bubbleAbove ? 'above' : 'below'}`}
                >
                  <div className="scv-collab-bubble-head">
                    <span className="scv-collab-avatar">P</span>
                    <span className="scv-collab-name">Puneeth</span>
                    <span className="scv-collab-time">just now</span>
                  </div>
                  <p className="scv-collab-msg">
                    {collab.typedMsg}
                    {collab.typing && <span className="scv-collab-caret" />}
                  </p>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}
