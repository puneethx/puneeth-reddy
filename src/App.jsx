import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Experience from './components/Experience.jsx'
import Certifications from './components/Certifications.jsx'
import Projects from './components/Projects.jsx'
import Hackathons from './components/Hackathons.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Pet from './components/Pet.jsx'
import Cursor from './components/Cursor.jsx'
import ResumeThrow from './components/ResumeThrow.jsx'
import './styles/app.scss'

export default function App() {
  const [throwing, setThrowing] = useState(false)

  const handleDownload = () => {
    // Trigger animation
    setThrowing(true)
    // Trigger actual download
    const a = document.createElement('a')
    a.href = '/Puneeth_Reddy_Resume.docx'
    a.download = 'Puneeth_Reddy_Resume.docx'
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
      <div className="noise" />
      <Cursor />
      <Navbar onDownload={handleDownload} />
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
      <Pet onDownload={handleDownload} throwing={throwing} />
      {throwing && <ResumeThrow />}
    </>
  )
}
