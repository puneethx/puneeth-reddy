import React, { useEffect, useState } from 'react'
import { FiDownload } from 'react-icons/fi'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Experience from './components/Experience.jsx'
import Certifications from './components/Certifications.jsx'
import Projects from './components/Projects.jsx'
import Hackathons from './components/Hackathons.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Cursor from './components/Cursor.jsx'
import ResumeThrow from './components/ResumeThrow.jsx'
import Strands from './components/Strands.jsx'
import Folder from './components/Folder.jsx'
import useSmoothScroll from './hooks/useSmoothScroll.js'
import './styles/app.scss'

export default function App() {
  const [throwing, setThrowing] = useState(false)
  useSmoothScroll()

  const handleDownload = () => {
    // Trigger animation
    setThrowing(true)
    // Trigger actual download
    const a = document.createElement('a')
    a.href = '/Puneeth_Reddy_Resume.pdf'
    a.download = 'Puneeth_Reddy_Resume.pdf'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => setThrowing(false), 3200)
  }

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in-view')
        })
      },
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Mouse-follow radial highlight on any element with data-glow
  useEffect(() => {
    const onMove = (e) => {
      document.querySelectorAll('[data-glow]').forEach((el) => {
        const rect = el.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        el.style.setProperty('--mx', `${x}%`)
        el.style.setProperty('--my', `${y}%`)
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div className="aurora">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
      </div>
      {/* Ambient WebGL strands — warm ripples on the dark backdrop. */}
      <div className="strands-bg" aria-hidden="true">
        <Strands
          colors={["#c96442", "#e8b48c", "#7a3826"]}
          count={3}
          speed={0.32}
          amplitude={1.1}
          waviness={0.9}
          thickness={0.6}
          glow={2}
          taper={3.6}
          spread={1.2}
          intensity={0.5}
          saturation={1.3}
          opacity={0.65}
          scale={1.6}
        />
      </div>
      <div className="noise" />
      <Cursor />
      <Navbar />
      <main>
        <Hero onDownload={handleDownload} />
        <About />
        <Experience />
        <Certifications />
        <Projects />
        <Hackathons />
        <Contact />
      </main>
      <Footer />

      {/* Floating Folder in the bottom-left — replaces the old Pet avatar.
       *  Click the folder to open it: three papers fan out; clicking any
       *  paper triggers the same download + resume-throw animation. */}
      <div className={`folder-wrap ${throwing ? 'is-throwing' : ''}`}>
        <Folder
          color="#c96442"
          size={0.55}
          items={[
            <div className="folder-paper-content" key="p1">
              <FiDownload />
              <span>Resume</span>
            </div>,
            <div className="folder-paper-content" key="p2">
              <FiDownload />
              <span>.docx</span>
            </div>,
            <div className="folder-paper-content" key="p3">
              <FiDownload />
              <span>Grab it</span>
            </div>,
          ]}
          onPaperClick={handleDownload}
        />
      </div>

      {throwing && <ResumeThrow />}
    </>
  )
}
