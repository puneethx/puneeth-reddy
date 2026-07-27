import { useEffect, useRef, useState, useCallback } from 'react'
import Iphone from './Iphone.jsx'
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

/* --------- Portrait / phone layout ---------
 * Same 16 nodes + same edges — laid out vertically so the whole graph
 * reads comfortably inside the iPhone's tall screen. Categories are
 * stacked top → bottom: Agentic → ML → Backend → Frontend. Positions
 * are hand-tuned so wires stay untangled.
 */
const PHONE_CANVAS_W = 460
const PHONE_CANVAS_H = 900
/*
 * Vertical layout for the phone canvas. Nodes are placed in four
 * top→bottom bands (Agentic → ML → Backend → Frontend). Bands leave
 * ~80–90px of vertical breathing room and stagger x-positions so
 * pill labels don't overlap. Keep node x within [80, 380] so labels
 * (which extend ±50px around x) don't clip the 460-wide canvas.
 */
const PHONE_NODE_POS = {
  // ── Agentic band (y: 60–260) ─────────────────────────────
  langgraph: { x: 150, y:  70, size: 'lg' },
  langchain: { x: 320, y: 130, size: 'md' },
  hybrid:    { x: 150, y: 180, size: 'md' },
  mcp:       { x: 340, y: 220, size: 'sm' },
  multi:     { x: 150, y: 260, size: 'md' },

  // ── ML band (y: 320–460) ─────────────────────────────────
  pytorch:   { x: 290, y: 320, size: 'md' },
  yolo:      { x: 130, y: 370, size: 'sm' },
  c3d:       { x: 320, y: 410, size: 'sm' },
  ocr:       { x: 180, y: 460, size: 'sm' },

  // ── Backend band (y: 520–630) ────────────────────────────
  fastapi:   { x: 310, y: 520, size: 'md' },
  python:    { x: 160, y: 580, size: 'md' },
  flask:     { x: 330, y: 630, size: 'sm' },

  // ── Frontend band (y: 700–820) — spread out so pills don't touch
  //    the bottom edge or overlap each other ─────────────────
  react:     { x: 210, y: 700, size: 'md' },
  next:      { x: 120, y: 760, size: 'sm' },
  three:     { x: 250, y: 810, size: 'sm' },
  scss:      { x: 360, y: 760, size: 'sm' },
}

export default function StackCanvas() {
  // Watch viewport so we can pick the right layout (horizontal desktop
  // canvas vs vertical phone canvas). Any dependent constants downstream
  // (CANVAS_W / CANVAS_H, initial node positions) switch on this flag.
  const [isPhone, setIsPhone] = useState(
    typeof window !== 'undefined'
      ? window.matchMedia('(max-width: 640px)').matches
      : false
  )
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 640px)')
    const onChange = (e) => setIsPhone(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const CW = isPhone ? PHONE_CANVAS_W : CANVAS_W
  const CH = isPhone ? PHONE_CANVAS_H : CANVAS_H

  // Build the initial-node list to match the current layout. On resize the
  // node list is re-seeded (see effect below), so switching orientations
  // rebuilds positions without losing the drag/collab machinery.
  const buildInitialNodes = useCallback((phone) => {
    return INITIAL_NODES.map((n) => {
      const base = phone && PHONE_NODE_POS[n.id]
        ? { ...n, ...PHONE_NODE_POS[n.id] }
        : n
      return { ...base, tx: base.x, ty: base.y, vx: 0, vy: 0 }
    })
  }, [])

  // Each node has:
  //  x, y      — actual (rendered) position
  //  tx, ty    — target position (where it wants to be)
  //  vx, vy    — current velocity (used for spring dynamics + release throw)
  const [nodes, setNodes] = useState(() => buildInitialNodes(isPhone))

  // Re-seed positions whenever the viewport crosses the phone boundary
  useEffect(() => {
    setNodes(buildInitialNodes(isPhone))
  }, [isPhone, buildInitialNodes])
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
    const scaleX = CW / rect.width
    const scaleY = CH / rect.height
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }, [CW, CH])

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

  /* ----------------- Pointer handlers -----------------
   * On pointerdown we install GLOBAL pointermove/up listeners on the
   * window instead of relying on bubbling from the button. Touch/pen
   * pointer capture is unreliable across iOS/Android — global listeners
   * always fire, no matter where the finger ends up (even outside the
   * canvas). The button's own pointerdown handles the initial grab.
   */
  const onPointerDown = (e, node) => {
    e.preventDefault()
    e.stopPropagation()
    const startCanvas = clientToCanvas(e.clientX, e.clientY)
    dragOffset.current = { x: startCanvas.x - node.x, y: startCanvas.y - node.y }
    lastPointer.current = { x: startCanvas.x, y: startCanvas.y, t: performance.now() }
    // Kill any velocity — the drag is now authoritative
    setNodes((prev) =>
      prev.map((n) => (n.id === node.id ? { ...n, vx: 0, vy: 0 } : n))
    )
    setDraggingId(node.id)
    // Local capture also — helps desktop, harmless on touch
    try { e.currentTarget.setPointerCapture?.(e.pointerId) } catch (_) {}

    const nodeId = node.id
    const pointerId = e.pointerId

    // Window-level move handler — runs even when the finger drifts off
    // the button. Uses the same clientToCanvas math as before.
    const handleMove = (ev) => {
      if (ev.pointerId !== pointerId) return
      ev.preventDefault()
      const { x, y } = clientToCanvas(ev.clientX, ev.clientY)
      const nx = Math.max(20, Math.min(CW - 20, x - dragOffset.current.x))
      const ny = Math.max(20, Math.min(CH - 20, y - dragOffset.current.y))
      const now = performance.now()
      const dt = Math.max(1, now - lastPointer.current.t)
      const vx = ((x - lastPointer.current.x) / dt) * 16
      const vy = ((y - lastPointer.current.y) / dt) * 16
      lastPointer.current = { x, y, t: now }
      setNodes((prev) =>
        prev.map((n) =>
          n.id === nodeId ? { ...n, x: nx, y: ny, tx: nx, ty: ny, vx, vy } : n
        )
      )
    }

    const handleUp = (ev) => {
      if (ev.pointerId !== pointerId) return
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
      // Freeze position as the new target
      setNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, tx: n.x, ty: n.y } : n))
      )
      setDraggingId(null)
      triggerCollabRevert(nodeId)
    }

    window.addEventListener('pointermove', handleMove, { passive: false })
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)
  }

  // Legacy handlers still bound on the .stack-canvas — kept as no-ops
  // for double-click reset, and to preserve JSX shape.
  const onPointerMove = () => {}
  const onPointerUp = () => {}

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
    // Origin depends on which layout we're in — desktop uses INITIAL_NODES,
    // phone uses PHONE_NODE_POS overrides. Falling back to INITIAL_NODES for
    // nodes that don't have a phone override.
    const initBase = INITIAL_NODES.find((i) => i.id === nodeId)
    const phoneOverride = isPhone ? PHONE_NODE_POS[nodeId] : null
    const init = phoneOverride ? { ...initBase, ...phoneOverride } : initBase
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
    setCollab((c) => ({ ...c, x: CW + 80, y: -30, phase: 'leaving', showBubble: false, typedMsg: '', typing: false }))
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
      startX = c.visible ? c.x : CW + 60
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
      const bubbleSide = (cursorX + 22 + BUBBLE_W + EDGE_PAD > CW) ? 'left' : 'right'
      const bubbleAbove = (cursorY + 30 + BUBBLE_H + EDGE_PAD > CH)

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

  /* ----------------- Shared canvas board -----------------
   * Rendered once, reused inside both the Mac window (desktop) and the
   * iPhone frame (phone). Coordinates flow through CW/CH so switching
   * layouts automatically rescales the viewBox + node positions.
   */
  const canvasBoard = (
    <div
      ref={containerRef}
      className={`stack-canvas ${draggingId ? 'dragging' : ''}`}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onDoubleClick={handleReset}
    >
      {/* Grid background.
          Node positions are `%`-based against the container box, so the
          SVG must stretch identically — use `preserveAspectRatio="none"`
          on phone so the viewBox lines up 1:1 with the container's
          percent grid regardless of the container's rendered aspect
          ratio. Desktop keeps `xMidYMid slice` for the letterboxed look. */}
      <svg
        className="scv-grid"
        viewBox={`0 0 ${CW} ${CH}`}
        preserveAspectRatio={isPhone ? 'none' : 'xMidYMid slice'}
        aria-hidden="true"
      >
        <defs>
          <pattern id="scv-dots" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="11" cy="11" r="1" fill="rgba(232, 180, 140, 0.14)" />
          </pattern>
        </defs>
        <rect width={CW} height={CH} fill="url(#scv-dots)" />
      </svg>

      {/* Static wires (no pulses) — same aspect-preservation rule as the
          grid so wire endpoints stay glued to the % node positions. */}
      <svg
        className="scv-wires"
        viewBox={`0 0 ${CW} ${CH}`}
        preserveAspectRatio={isPhone ? 'none' : 'xMidYMid slice'}
        aria-hidden="true"
      >
        {EDGES.map(([a, b], i) => {
          const na = nodesById[a]
          const nb = nodesById[b]
          if (!na || !nb) return null
          const dx = nb.x - na.x
          const dy = nb.y - na.y
          const len = Math.hypot(dx, dy) || 1
          // Sag direction: on the wide horizontal desktop canvas we want
          // cables to droop straight DOWN (gravity look). On the tall
          // phone canvas, edges are mostly vertical, so a downward sag
          // pushes the curve past its endpoint — sag PERPENDICULAR to
          // the wire instead so the arc sits between the two nodes.
          const sagMag = Math.min(len * (isPhone ? 0.10 : 0.18), isPhone ? 22 : 55)
          const perpX = isPhone ? (-dy / len) * sagMag : 0
          const perpY = isPhone ? ( dx / len) * sagMag : sagMag
          const c1x = na.x + dx * 0.33 + perpX + (na.vx || 0) * 1.2
          const c1y = na.y + dy * 0.33 + perpY + (na.vy || 0) * 1.2
          const c2x = na.x + dx * 0.66 + perpX + (nb.vx || 0) * 1.2
          const c2y = na.y + dy * 0.66 + perpY + (nb.vy || 0) * 1.2
          const d = `M ${na.x} ${na.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${nb.x} ${nb.y}`
          const hot = isEdgeHot(a, b)
          const dim = isEdgeDim(a, b)
          return (
            <g key={`${a}-${b}`}>
              <path d={d} className={`scv-edge-shadow ${hot ? 'hot' : ''} ${dim ? 'dim' : ''}`} />
              <path d={d} className={`scv-edge-line ${hot ? 'hot' : ''} ${dim ? 'dim' : ''}`} />
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
          const leftPct = (n.x / CW) * 100
          const topPct  = (n.y / CH) * 100
          return (
            <button
              key={n.id}
              type="button"
              className={`scv-node scv-node--${n.size} ${isDragging ? 'dragging' : ''} ${hot ? 'hot' : ''} ${dim ? 'dim' : ''}`}
              style={{ left: `${leftPct}%`, top: `${topPct}%`, '--nc': color }}
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

      {/* Collaborator cursor — "Puneeth" ghost pointer */}
      {collab.visible && (
        <div
          className={`scv-collab scv-collab--${collab.phase}`}
          style={{
            left: `${(collab.x / CW) * 100}%`,
            top:  `${(collab.y / CH) * 100}%`,
          }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="scv-collab-cursor" width="22" height="22">
            <path
              d="M4 2 L4 20 L9 15.2 L12.4 22 L15.3 20.5 L11.9 13.9 L18.5 12.8 Z"
              fill="var(--accent)"
              stroke="#1a0e08"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
          <span className="scv-collab-tag">Puneeth</span>
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
  )

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

      {/* macOS window — desktop + tablet. On phones (≤640px) the CSS hides
          this and shows .scv-phone (the iPhone frame) below. */}
      <div className={`mac-window scv-mac-shell ${draggingId ? 'dragging' : ''}`}>
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

          {/* Interactive canvas board — rendered here on desktop/tablet only */}
          {!isPhone && canvasBoard}
        </div>
      </div>

      {/* ============================================================
       * PHONE VIEW — same interactive canvas (draggable nodes,
       * Puneeth-cursor revert), rendered inside an iPhone 15 frame.
       * Uses a vertical (PHONE_CANVAS_W × PHONE_CANVAS_H) layout.
       * Hidden above 640px via CSS.
       * ============================================================ */}
      <div className="scv-phone">
        <Iphone title="stack.graph">
          <div className="scv-phone-tabs">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                type="button"
                className={`scv-phone-tab ${activeCategory === c.key ? 'active' : ''}`}
                style={{ '--tc': CATEGORY_COLORS[c.key] }}
                onClick={() =>
                  setActiveCategory((cur) => (cur === c.key ? null : c.key))
                }
              >
                <span className="scv-phone-tab-dot" />
                {c.label}
              </button>
            ))}
          </div>

          <div className="scv-phone-canvas">{isPhone && canvasBoard}</div>

          <div className="scv-phone-hint">This is my Tech Stack!</div>
        </Iphone>
      </div>
    </div>
  )
}
