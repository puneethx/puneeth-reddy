import { useEffect, useRef, useState } from 'react'
import { FiGithub, FiLinkedin, FiMail, FiInstagram, FiTwitter } from 'react-icons/fi'
import Puneeth from '../assets/puneeth.png'
import './hero.scss'

const roles = [
  'AI Application Engineer',
  'Forward Deployed Engineer',
  'Agentic AI Engineer',
  'Physical AI Builder',
]

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0)
  const tilt = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((r) => (r + 1) % roles.length), 2800)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const el = tilt.current
    if (!el) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(0)`
    }
    const onLeave = () => {
      el.style.transform = ''
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero-grid">
          <div className="left">
            <h1>
              <span className="line reveal">Hi, I'm</span>
              <span className="line reveal delay-1">
                <span className="name-grad">Puneeth Reddy.</span>
              </span>
              <span className="line role reveal delay-2">
                <span className="chevron">›</span>
                <span className="role-slot">
                  {roles.map((r, i) => (
                    <span
                      key={r}
                      className={`role-word ${i === roleIdx ? 'active' : ''}`}
                    >
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
              <a href="https://github.com/puneethx" target="_blank" rel="noreferrer" aria-label="GitHub"><FiGithub /></a>
              <a href="https://www.linkedin.com/in/puneethx05/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="mailto:puneethreddyt2004@gmail.com" aria-label="Email"><FiMail /></a>
              <a href="https://www.instagram.com/puneethx" target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram /></a>
              <a href="https://x.com/puneeth2x" target="_blank" rel="noreferrer" aria-label="Twitter"><FiTwitter /></a>
            </div>
          </div>
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
