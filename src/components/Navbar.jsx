import { useEffect, useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import './navbar.scss'

export default function Navbar({ onDownload }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#certifications', label: 'Certified' },
    { href: '#projects', label: 'Projects' },
    { href: '#hackathons', label: 'Hackathons' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner container">
        <a href="#top" className="brand">
          <span className="dot" />
          <span>puneeth<span className="accent">.</span>reddy</span>
        </a>
        <ul className={open ? 'open' : ''}>
          {links.map((l, i) => (
            <li key={l.href} style={{ '--i': i }}>
              <a href={l.href} onClick={() => setOpen(false)}>
                <span className="num">0{i + 1}.</span> {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="actions">
          <button className="download-btn" onClick={onDownload}>
            <FiDownload /> <span>Resume</span>
          </button>
          <button
            className={`burger ${open ? 'open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  )
}
