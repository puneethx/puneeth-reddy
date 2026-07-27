import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { FiChevronRight, FiChevronLeft, FiExternalLink } from 'react-icons/fi'
import './horizontalCardStack.scss'

/* =============================================================
 * HorizontalCardStack — 3 cards visible side-by-side, prev/next
 * shifts them left/right with a spring. Same layout on desktop
 * and mobile; card size + offsets scale responsively.
 * ============================================================ */

// Slot offsets are computed at runtime based on card width so the layout
// works from ~320px viewports to 1440px+. `slot` is a fn(cardW) → offsets.
function slotOffsets(cardW) {
  // Flanks sit `cardW * 0.78` away from center so ~22% peek past the
  // focus card on each side.
  const flankX = Math.round(cardW * 0.78)
  return [
    { scale: 0.86, x: -flankX, y: 6, opacity: 0.6, blur: 1.4 }, // left flank
    { scale: 1,    x: 0,       y: 0, opacity: 1,   blur: 0   }, // center focus
    { scale: 0.86, x:  flankX, y: 6, opacity: 0.6, blur: 1.4 }, // right flank
  ]
}
function exitOffsets(cardW) {
  const off = Math.round(cardW * 1.8)
  return {
    forward: { x: -off, scale: 0.75, opacity: 0, zIndex: 0 },
    back:    { x:  off, scale: 0.75, opacity: 0, zIndex: 0 },
    enterForwardRight: { x:  off, scale: 0.75, opacity: 0 },
    enterBackLeft:     { x: -off, scale: 0.75, opacity: 0 },
  }
}

function CardContent({ card, isFocus }) {
  return (
    <div className={`hcs-content ${isFocus ? 'is-focus' : ''}`}>
      <div className="hcs-image">
        <img src={card.img} alt={card.title} draggable="false" />
        <div className="hcs-image-fade" />
        {card.tag && <div className="hcs-tag">{card.tag}</div>}
      </div>
      <div className="hcs-body">
        <div className="hcs-head">
          <h4 className="hcs-title">{card.title}</h4>
          {card.href && (
            <a
              className="hcs-cta"
              href={card.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${card.title}`}
              onClick={(e) => e.stopPropagation()}
            >
              <FiExternalLink />
            </a>
          )}
        </div>
        {card.tagline && <div className="hcs-tagline">{card.tagline}</div>}
        {card.body && <p className="hcs-desc">{card.body}</p>}
        {card.tech && card.tech.length > 0 && (
          <div className="hcs-tech">
            {card.tech.slice(0, 4).map((t) => (
              <span key={t} className="hcs-chip">{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ---- Card animation tuning ----
 * Different physics for entry vs slot-shuffle:
 *   • ENTRY  — softer, more damped (bounce 0.18) so the incoming card
 *              feels weighty as it lands.
 *   • SLOT   — snappier stiffness so flanks respond fast to a swipe.
 * The `velocityX` prop is the pointer velocity captured on drag-end
 * and forwarded here; Framer's spring transition uses it as the
 * initial velocity so a hard flick actually carries momentum.
 */
const SLOT_SPRING = { type: 'spring', stiffness: 260, damping: 32, mass: 0.9 }

function AnimatedCard({
  card, index, direction, cardW, velocityX = 0,
  focusRotate, focusScale,
}) {
  const positions = slotOffsets(cardW)
  const exits = exitOffsets(cardW)
  const pos = positions[index] ?? positions[1]
  const zIndex = index === 1 ? 10 : 8 - Math.abs(index - 1)
  const isFocus = index === 1
  const isLeftFlank  = index === 0
  const isRightFlank = index === 2

  const initialAnim =
    direction === 'back' && isLeftFlank   ? exits.enterBackLeft
    : direction === 'forward' && isRightFlank ? exits.enterForwardRight
    : undefined

  const variants = {
    exit: (dir) => dir === 'back' ? exits.back : exits.forward,
  }

  /* The focus card gets a LIVE rotate response driven by the parent
     stage's dragX motion value. Only `rotate` is used here so it
     doesn't clash with `animate.scale`; scale is still handled by the
     slot animation. Flanks get no drag-linked transform. */
  const styleExtras = isFocus ? { rotate: focusRotate } : {}

  return (
    <motion.div
      key={card._stackId}
      custom={direction}
      variants={variants}
      initial={initialAnim}
      animate={{
        x: pos.x,
        y: pos.y,
        scale: pos.scale,
        opacity: pos.opacity,
        filter: `blur(${pos.blur}px)`,
      }}
      exit="exit"
      transition={{
        ...SLOT_SPRING,
        x: { ...SLOT_SPRING, velocity: velocityX },
      }}
      style={{ zIndex, width: cardW, ...styleExtras }}
      className={`hcs-card ${isFocus ? 'is-focus' : ''}`}
    >
      <CardContent card={card} isFocus={isFocus} />
    </motion.div>
  )
}

/* Ease helper for the mid-drag transforms — clamps into [-1, 1]
 * with a soft S-curve so the tilt/scale response doesn't feel linear. */
const softClamp = (v, max) => {
  const t = Math.max(-1, Math.min(1, v / max))
  return t * (1 - Math.abs(t) * 0.35) // ease-out toward the edges
}

export default function HorizontalCardStack({ items = [] }) {
  /* Each card carries two ids:
   *   _stackId  — monotonically-increasing, purely a unique React/AnimatePresence key
   *   _itemIdx  — the item's position in the ORIGINAL items list; used for the
   *               counter so it always shows the right number.
   *
   * Initial rotation puts items[0] at the CENTER slot (queue[1]) so the
   * counter reads "01 / N" on first paint. */
  const [queue, setQueue] = useState(() => {
    if (!items.length) return []
    const withIds = items.map((it, i) => ({ ...it, _stackId: i, _itemIdx: i }))
    const last = withIds[withIds.length - 1]
    return [last, ...withIds.slice(0, -1)]
  })
  const [nextId, setNextId] = useState(items.length)
  const [direction, setDirection] = useState('forward')

  // Responsive card width — clamped between phone and desktop sizes.
  // Card takes ~55% of the stage width so flanks peek in on either side.
  const stageRef = useRef(null)
  const [cardW, setCardW] = useState(360)
  useEffect(() => {
    if (!stageRef.current) return
    const measure = () => {
      const w = stageRef.current?.clientWidth || 800
      // 55% of stage width, clamped to [220, 360]
      const cw = Math.max(220, Math.min(360, Math.round(w * 0.55)))
      setCardW(cw)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(stageRef.current)
    return () => ro.disconnect()
  }, [])

  // Momentum captured on drag-end and forwarded to the spring so a
  // flick keeps its energy through the slot shuffle. Reset to 0 shortly
  // after so button-driven advances don't inherit stale velocity.
  const [releaseVelocity, setReleaseVelocity] = useState(0)

  const advance = useCallback((velocity = 0) => {
    if (queue.length === 0) return
    setDirection('forward')
    setReleaseVelocity(velocity)
    setQueue((prev) => {
      const [first, ...rest] = prev
      return [...rest, { ...first, _stackId: nextId }]
    })
    setNextId((n) => n + 1)
  }, [queue.length, nextId])

  const rewind = useCallback((velocity = 0) => {
    if (queue.length === 0) return
    setDirection('back')
    setReleaseVelocity(velocity)
    setQueue((prev) => {
      const last = prev[prev.length - 1]
      const rest = prev.slice(0, prev.length - 1)
      return [{ ...last, _stackId: nextId }, ...rest]
    })
    setNextId((n) => n + 1)
  }, [queue.length, nextId])

  // Clear the velocity a moment after each shuffle so subsequent
  // button clicks / trackpad flicks start from a clean 0.
  useEffect(() => {
    if (releaseVelocity === 0) return
    const t = setTimeout(() => setReleaseVelocity(0), 400)
    return () => clearTimeout(t)
  }, [releaseVelocity])

  /* --------- Swipe / thumb-drag ---------
   * Motion values tracking the live drag position on the STAGE. We use
   * these to give the center card a mid-drag tilt + subtle scale
   * response so the interaction reads as tactile, not just "the whole
   * stage sliding". `dragXSpring` smooths the raw dragX so nothing
   * jitters if the finger stops abruptly.
   */
  const dragX       = useMotionValue(0)
  const dragXSpring = useSpring(dragX, { stiffness: 380, damping: 34, mass: 0.6 })
  const focusRotate = useTransform(dragXSpring, (v) => softClamp(v, cardW * 0.9) * -6) // ±6° tilt during drag

  const onDragEnd = (_e, info) => {
    const dx = info.offset.x
    const vx = info.velocity.x
    // Combine distance + velocity into a single "intent" score so a
    // slow long drag AND a fast short flick both count. This produces
    // the flick-and-let-go feel of native iOS carousels.
    const intent = dx + vx * 0.18
    const distanceThreshold = Math.max(56, cardW * 0.16)
    if (intent <= -distanceThreshold) advance(vx)
    else if (intent >= distanceThreshold) rewind(vx)
    // Snap back — spring on dragX also unwinds the mid-drag tilt/scale.
    dragX.set(0)
  }

  // Trackpad / horizontal wheel — one flip per gesture, throttled.
  const wheelLockRef = useRef(0)
  const onWheel = (e) => {
    if (Math.abs(e.deltaX) < 24 || Math.abs(e.deltaX) < Math.abs(e.deltaY)) return
    const now = performance.now()
    if (now - wheelLockRef.current < 550) return
    wheelLockRef.current = now
    // Approximate flick velocity from deltaX so wheel-driven advances
    // also feel weighty. deltaX is a per-frame pixel value; scale up.
    const wheelVelocity = e.deltaX * 12
    if (e.deltaX > 0) advance(-Math.abs(wheelVelocity))
    else rewind(Math.abs(wheelVelocity))
  }

  if (!queue.length) return null
  const total = items.length
  // Counter reads the center card's ORIGINAL index in the items list —
  // not the ever-growing _stackId — so numbers stay accurate no matter
  // how many rotations have happened.
  const humanIdx = (queue[1]?._itemIdx ?? 0) + 1

  return (
    <div className="hcs-wrap">
      <motion.div
        className="hcs-stage"
        ref={stageRef}
        drag="x"
        /* Rubber-band elasticity while dragging, snap back to 0 on
           release. dragMomentum: false → the flick's momentum is
           captured by us and injected into the card's spring on
           swap, so we don't want the stage to coast on its own. */
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.28}
        dragMomentum={false}
        onDrag={(_e, info) => dragX.set(info.offset.x)}
        onDragEnd={onDragEnd}
        onWheel={onWheel}
        transition={SLOT_SPRING}
      >
        <AnimatePresence initial={false} mode="popLayout" custom={direction}>
          {queue.slice(0, 3).map((card, index) => (
            <AnimatedCard
              key={card._stackId}
              card={card}
              index={index}
              direction={direction}
              cardW={cardW}
              velocityX={index === 1 ? releaseVelocity : 0}
              focusRotate={focusRotate}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      <div className="hcs-controls">
        <button
          type="button"
          onClick={rewind}
          className="hcs-nav hcs-nav--back"
          aria-label="Previous project"
        >
          <FiChevronLeft />
        </button>
        <div className="hcs-counter">
          <span className="hcs-counter-row">
            <span className="hcs-counter-num">{String(humanIdx).padStart(2, '0')}</span>
            <span className="hcs-counter-total">/ {String(total).padStart(2, '0')}</span>
          </span>
          <span className="hcs-counter-hint">swipe · tap arrows</span>
        </div>
        <button
          type="button"
          onClick={advance}
          className="hcs-nav hcs-nav--next"
          aria-label="Next project"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  )
}
