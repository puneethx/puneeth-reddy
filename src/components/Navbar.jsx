import { useEffect, useState } from 'react'
import { FiDownload, FiX } from 'react-icons/fi'
import SpecularButton from './SpecularButton.jsx'
import NavEmbedding from './NavEmbedding.jsx'
import './navbar.scss'

export default function Navbar({ onDownload }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  // Live section intersection ratios — drives the neuron activation bars
  const [sectionRatios, setSectionRatios] = useState(() => new Map())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: watch each section and update `activeSection` when one
  // becomes the dominant slice of the viewport.
  useEffect(() => {
    const ids = ['about', 'experience', 'certifications', 'projects', 'hackathons', 'contact']
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!targets.length) return

    // Track the ratio each section takes up of the viewport, pick the biggest
    const ratios = new Map(ids.map((id) => [id, 0]))
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          ratios.set(e.target.id, e.intersectionRatio)
        })
        let bestId = ids[0]
        let bestRatio = 0
        ratios.forEach((v, k) => {
          if (v > bestRatio) { bestRatio = v; bestId = k }
        })
        const idx = ids.indexOf(bestId)
        if (idx >= 0) setActiveSection(idx)
        // Push a shallow copy so React sees a new reference each update
        setSectionRatios(new Map(ratios))
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1] }
    )
    targets.forEach((t) => obs.observe(t))
    return () => obs.disconnect()
  }, [])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const links = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#certifications', label: 'Certified' },
    { href: '#projects', label: 'Projects' },
    { href: '#hackathons', label: 'Hackathons' },
    { href: '#contact', label: 'Contact' },
  ]

  const closeMenu = () => setMobileOpen(false)

  return (
    <>
      {/* Embedding-space nav — desktop only. 2D projection of sections;
          the query dot travels between nodes as the user scrolls. Hover
          a node to see its attention edges light up. */}
      <NavEmbedding
        items={links}
        activeIndex={activeSection}
        onSelect={(idx, item) => {
          if (!item?.href) return
          const a = document.createElement('a')
          a.href = item.href
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }}
      />

      {/* Floating hamburger — mobile only. The old mobile top-bar (with brand
          + resume + hamburger) has been removed; only this floating burger
          remains so the mobile bubble-menu overlay still opens. */}
      <button
        type="button"
        className={`mnav-burger floating-burger ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile menu overlay.
       * Layout: 3 rows.
       *   row 1: [About, Experience]
       *   row 2: [Certified, Projects, Hackathons]
       *   row 3: [Contact, Resume-with-icon]
       * The "Resume" pill is inline with the other links, styled with the
       * accent gradient — it lives in the same grid so it feels part of the
       * bubble cluster, not a separate button below. */}
      <div
        className={`mnav-overlay ${mobileOpen ? 'open' : ''}`}
        aria-hidden={!mobileOpen}
        onClick={closeMenu}
      >
        <div className="mnav-panel" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="mnav-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <FiX />
          </button>

          <div className="mnav-rows">
            {/* Row 1 — 2 pills */}
            <div className="mnav-row row-2" style={{ '--row': 0 }}>
              {links.slice(0, 2).map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={closeMenu}
                  className="mnav-pill"
                  style={{ '--i': i }}
                >
                  {l.label}
                </a>
              ))}
            </div>

            {/* Row 2 — 3 pills */}
            <div className="mnav-row row-3" style={{ '--row': 1 }}>
              {links.slice(2, 5).map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={closeMenu}
                  className="mnav-pill"
                  style={{ '--i': i + 2 }}
                >
                  {l.label}
                </a>
              ))}
            </div>

            {/* Row 3 — Contact + Resume (with download icon, accent gradient) */}
            <div className="mnav-row row-2" style={{ '--row': 2 }}>
              <a
                href={links[5].href}
                onClick={closeMenu}
                className="mnav-pill"
                style={{ '--i': 5 }}
              >
                {links[5].label}
              </a>
              <button
                type="button"
                onClick={() => { onDownload(); closeMenu() }}
                className="mnav-pill mnav-pill-resume"
                style={{ '--i': 6 }}
                aria-label="Download resume"
              >
                <FiDownload /> Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
