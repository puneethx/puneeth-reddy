import { useEffect, useRef, useState } from 'react'
import { FiGithub, FiLinkedin, FiMail, FiInstagram, FiTwitter, FiDownload } from 'react-icons/fi'
import Puneeth from '../assets/puneeth.png'
import FloatingDock from './FloatingDock.jsx'
import './hero.scss'

const socialLinks = [
  { title: 'GitHub',    icon: <FiGithub />,    href: 'https://github.com/puneethx' },
  { title: 'LinkedIn',  icon: <FiLinkedin />,  href: 'https://www.linkedin.com/in/puneethx05/' },
  { title: 'Email',     icon: <FiMail />,      href: 'mailto:puneethreddyt2004@gmail.com' },
  { title: 'Instagram', icon: <FiInstagram />, href: 'https://www.instagram.com/puneethx' },
  { title: 'Twitter',   icon: <FiTwitter />,   href: 'https://x.com/puneeth2x' },
]

const roles = [
  'AI Application Engineer',
  'Forward Deployed Engineer',
  'Agentic AI Engineer',
  'Physical AI Builder',
]

/**
 * Hero — completely rebuilt with responsive layout driven by JS state.
 * All critical layout decisions (grid vs stacked, portrait size, badge
 * visibility) live in inline styles that CSS cannot override.
 */
export default function Hero({ onDownload }) {
  const [roleIdx, setRoleIdx] = useState(0)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 1023px)').matches : false
  )
  const tilt = useRef(null)

  // Cycle role text
  useEffect(() => {
    const id = setInterval(() => setRoleIdx((r) => (r + 1) % roles.length), 2800)
    return () => clearInterval(id)
  }, [])

  // Watch viewport width
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const onChange = (e) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    // eslint-disable-next-line no-console
    console.log('[Hero] Mobile mode:', mq.matches, 'width:', window.innerWidth)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // 3D tilt effect — desktop only
  useEffect(() => {
    if (isMobile) return
    const el = tilt.current
    if (!el) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(0)`
    }
    const onLeave = () => { el.style.transform = '' }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [isMobile])

  // Socials with a "Resume" download icon appended — the resume icon is
  // marked `accent` so it renders with the orange border + glyph from the
  // start, and uses onClick to trigger the download animation instead of
  // linking away.
  const dockItems = [
    ...socialLinks,
    {
      title: 'Resume',
      icon: <FiDownload />,
      onClick: onDownload,
      accent: true,
    },
  ]

  // Text content (shared between mobile + desktop)
  const textBlock = (
    <>
      <h1>
        <span className="line reveal">Hi, I'm</span>
        <span className="line reveal delay-1">
          <span className="name-grad">Puneeth Reddy.</span>
        </span>
        <span className="line role reveal delay-2">
          <span className="chevron">›</span>
          <span className="role-slot">
            {roles.map((r, i) => (
              <span key={r} className={`role-word ${i === roleIdx ? 'active' : ''}`}>
                {r}
              </span>
            ))}
          </span>
        </span>
      </h1>
      <p className="lede reveal delay-3">
        I take <b>agentic AI systems</b> from zero to production — hybrid
        RAG pipelines, multi-agent orchestration with{' '}
        <b>LangChain / LangGraph</b>, and <b>Physical AI</b> that drives
        real robots on a warehouse floor. Ex-computer-vision. Currently
        building enterprise-grade agentic products that ship to real users.
      </p>
      <div className="socials reveal delay-4">
        <FloatingDock items={dockItems} />
      </div>
    </>
  )

  // -------- MOBILE LAYOUT (isMobile === true) --------
  if (isMobile) {
    return (
      <section
        className="hero"
        id="top"
        style={{
          minHeight: 'auto',
          paddingTop: '90px',
          paddingBottom: '40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            width: '100%',
            maxWidth: '100%',
            padding: '0 20px',
            boxSizing: 'border-box',
          }}
        >
          {/* Text block */}
          <div className="left" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
            {textBlock}
          </div>

          {/* Portrait with floating badges — inline styles, guaranteed dimensions.
              Wrapper is slightly larger than the photo so badges can hang
              off the corners without clipping outside the viewport. */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px 0',
            }}
          >
            <div
              style={{
                position: 'relative',
                width: 'min(260px, 70vw)',
                aspectRatio: '1 / 1',
              }}
            >
              {/* Photo */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '22px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'linear-gradient(160deg, rgba(201, 100, 66, 0.15), rgba(232, 180, 140, 0.05))',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                }}
              >
                <img
                  src={Puneeth}
                  alt="Puneeth Reddy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 15%',
                    display: 'block',
                    filter: 'contrast(1.05) saturate(1.1)',
                  }}
                />
              </div>

              {/* Top-left badge — Agentic AI (floats like desktop .b1) */}
              <div
                className="mobile-badge mobile-badge-b1"
                style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '-10px',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  background: 'rgba(22, 22, 26, 0.92)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  boxShadow: '0 10px 24px -8px rgba(0,0,0,0.55)',
                  zIndex: 2,
                }}
              >
                <span style={{ color: '#f5f5f5', fontSize: '11px', fontWeight: 600 }}>Agentic AI</span>
                <small style={{ color: '#6b6b74', fontSize: '9px' }}>LangGraph · RAG</small>
              </div>

              {/* Middle-right badge — Physical AI (floats reverse, like .b2) */}
              <div
                className="mobile-badge mobile-badge-b3"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '-14px',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  background: 'rgba(22, 22, 26, 0.92)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  boxShadow: '0 10px 24px -8px rgba(0,0,0,0.55)',
                  zIndex: 2,
                }}
              >
                <span style={{ color: '#f5f5f5', fontSize: '11px', fontWeight: 600 }}>Physical AI</span>
                <small style={{ color: '#6b6b74', fontSize: '9px' }}>Robots + Agents</small>
              </div>

              {/* Bottom-LEFT badge — 4× Hackathon (mobile: moved from right → left) */}
              <div
                className="mobile-badge mobile-badge-b2"
                style={{
                  position: 'absolute',
                  bottom: '-14px',
                  left: '-10px',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  background: 'rgba(22, 22, 26, 0.92)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  boxShadow: '0 10px 24px -8px rgba(0,0,0,0.55)',
                  zIndex: 2,
                }}
              >
                <span style={{ color: '#f5f5f5', fontSize: '11px', fontWeight: 600 }}>4× Hackathon</span>
                <small style={{ color: '#6b6b74', fontSize: '9px' }}>Winner + RU</small>
              </div>
            </div>
          </div>

          {/* Marquee — kept, but constrained */}
          <div className="marquee" style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <div className="track">
              {['LangGraph', 'LangChain', 'Hybrid RAG', 'FastAPI', 'Multi-Agent', 'BM25', 'React', 'PyTorch', 'YOLOv8', 'Next.js', 'Three Fiber', 'Python', 'MCP', 'Physical AI', 'Vision', 'Prompt Eng'].map((t, i) => (
                <span key={i}>{t}<span className="sep">✦</span></span>
              ))}
              {['LangGraph', 'LangChain', 'Hybrid RAG', 'FastAPI', 'Multi-Agent', 'BM25', 'React', 'PyTorch', 'YOLOv8', 'Next.js', 'Three Fiber', 'Python', 'MCP', 'Physical AI', 'Vision', 'Prompt Eng'].map((t, i) => (
                <span key={`d${i}`}>{t}<span className="sep">✦</span></span>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // -------- DESKTOP LAYOUT (unchanged from original) --------
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-grid">
          <div className="left">{textBlock}</div>
          <div className="right">
            <div className="portrait-wrap" ref={tilt}>
              <div className="portrait">
                <img src={Puneeth} alt="Puneeth Reddy" />
                <div className="scanline" />
                <div className="glow" />
              </div>
              <div className="badge b1"><span>Agentic AI</span><small>LangGraph · RAG</small></div>
              <div className="badge b2"><span>Physical AI</span><small>Robots + Agents</small></div>
              <div className="badge b3"><span>4× Hackathon</span><small>Winner + RU</small></div>
            </div>
          </div>
        </div>
        <div className="marquee">
          <div className="track">
            {['LangGraph', 'LangChain', 'Hybrid RAG', 'FastAPI', 'Multi-Agent', 'BM25', 'React', 'PyTorch', 'YOLOv8', 'Next.js', 'Three Fiber', 'Python', 'MCP', 'Physical AI', 'Vision', 'Prompt Eng'].map((t, i) => (
              <span key={i}>{t}<span className="sep">✦</span></span>
            ))}
            {['LangGraph', 'LangChain', 'Hybrid RAG', 'FastAPI', 'Multi-Agent', 'BM25', 'React', 'PyTorch', 'YOLOv8', 'Next.js', 'Three Fiber', 'Python', 'MCP', 'Physical AI', 'Vision', 'Prompt Eng'].map((t, i) => (
              <span key={`d${i}`}>{t}<span className="sep">✦</span></span>
            ))}
          </div>
        </div>
      </div>
      <div className="scroll-hint">
        <span>scroll</span>
        <span className="line-anim" />
      </div>
    </section>
  )
}
