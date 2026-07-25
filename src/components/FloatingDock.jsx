import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import './FloatingDock.scss'

/**
 * FloatingDock — macOS-style dock where icons magnify as the cursor
 * approaches. No background container by request; icons hover as
 * transparent floating chips.
 *
 * Ported from the shadcn/Tailwind/motion original to plain JS + SCSS.
 */
export default function FloatingDock({ items, className = '', mobileClassName = '' }) {
  return (
    <>
      <FloatingDockDesktop items={items} className={className} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  )
}

/* ---------- Desktop dock ---------- */
function FloatingDockDesktop({ items, className }) {
  const mouseX = useMotionValue(Infinity)
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`fdock fdock--desktop ${className || ''}`}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
      {/* {...item} already spreads onClick + accent, so no extra wiring needed */}
    </motion.div>
  )
}

function IconContainer({ mouseX, title, icon, href, onClick, accent }) {
  const ref = useRef(null)

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  // Icon-container grows from 36px → 62px as cursor approaches
  const widthTransform  = useTransform(distance, [-140, 0, 140], [36, 62, 36])
  const heightTransform = useTransform(distance, [-140, 0, 140], [36, 62, 36])
  // Inner icon grows from 20px → 36px
  const widthIconTransform  = useTransform(distance, [-140, 0, 140], [20, 36, 20])
  const heightIconTransform = useTransform(distance, [-140, 0, 140], [20, 36, 20])

  const spring = { mass: 0.1, stiffness: 150, damping: 12 }
  const width      = useSpring(widthTransform,      spring)
  const height     = useSpring(heightTransform,     spring)
  const widthIcon  = useSpring(widthIconTransform,  spring)
  const heightIcon = useSpring(heightIconTransform, spring)

  const [hovered, setHovered] = useState(false)

  const isExternal = href && href.startsWith('http')
  // If onClick is provided, render as a <button> instead of an <a>.
  const Wrapper = onClick ? 'button' : 'a'
  const wrapperProps = onClick
    ? { type: 'button', onClick, 'aria-label': title }
    : {
        href,
        target: isExternal ? '_blank' : undefined,
        rel: isExternal ? 'noreferrer' : undefined,
        'aria-label': title,
      }
  return (
    <Wrapper {...wrapperProps} className={onClick ? 'fdock-anchor fdock-anchor--btn' : 'fdock-anchor'}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`fdock-icon ${accent ? 'fdock-icon--accent' : ''}`}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 2, x: '-50%' }}
              className="fdock-tip"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="fdock-glyph"
        >
          {icon}
        </motion.div>
      </motion.div>
    </Wrapper>
  )
}

/* ---------- Mobile dock (no magnify — simple row) ---------- */
function FloatingDockMobile({ items, className }) {
  return (
    <div className={`fdock fdock--mobile ${className || ''}`}>
      {items.map((item) => {
        const isExternal = item.href && item.href.startsWith('http')
        const cls = `fdock-icon fdock-icon--static ${item.accent ? 'fdock-icon--accent' : ''}`
        if (item.onClick) {
          return (
            <button
              key={item.title}
              type="button"
              onClick={item.onClick}
              aria-label={item.title}
              className={cls}
            >
              <span className="fdock-glyph">{item.icon}</span>
            </button>
          )
        }
        return (
          <a
            key={item.title}
            href={item.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noreferrer' : undefined}
            aria-label={item.title}
            className={cls}
          >
            <span className="fdock-glyph">{item.icon}</span>
          </a>
        )
      })}
    </div>
  )
}
