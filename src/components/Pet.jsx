import { useEffect, useRef, useState } from 'react'
import { FiDownload, FiX } from 'react-icons/fi'
import Puneeth from '../assets/puneeth.png'
import './pet.scss'

/**
 * Pet using Puneeth's actual photo as a circular floating avatar.
 * Papers fan out around it — the papers are what "throws" on download.
 */
export default function Pet({ onDownload, throwing }) {
  const wrapRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [msgIdx, setMsgIdx] = useState(0)
  const [firstShow, setFirstShow] = useState(false)

  const messages = [
    "Hi — I made this site.",
    "Papers in hand. Say when.",
    "Curious? Try the download.",
    "One click and they're yours.",
  ]

  useEffect(() => {
    const t = setTimeout(() => setFirstShow(true), 900)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const move = (e) => {
      if (!wrapRef.current) return
      const rect = wrapRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const nx = Math.max(-1, Math.min(1, dx / 500))
      const ny = Math.max(-1, Math.min(1, dy / 500))
      wrapRef.current.style.setProperty('--tx', `${ny * 10}deg`)
      wrapRef.current.style.setProperty('--ty', `${-nx * 12}deg`)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    if (open) {
      const id = setInterval(() => setMsgIdx((m) => (m + 1) % messages.length), 4200)
      return () => clearInterval(id)
    }
  }, [open])

  return (
    <div className={`pet-wrap ${firstShow ? 'show' : ''} ${throwing ? 'is-throwing' : ''}`}>
      {open && !throwing && (
        <div className="bubble">
          <button className="close" onClick={() => setOpen(false)}><FiX /></button>
          <div className="msg" key={msgIdx}>{messages[msgIdx]}</div>
          <button className="grab" onClick={onDownload}>
            <FiDownload /> Download Resume
          </button>
          <div className="tail" />
        </div>
      )}

      <button
        className="avatar-btn"
        ref={wrapRef}
        onClick={() => setOpen((o) => !o)}
        aria-label="Say hi"
      >
        {/* Paper stack fanning out from behind the avatar */}
        <div className="paper-stack">
          <span className="p p1" />
          <span className="p p2" />
          <span className="p p3" />
        </div>

        <div className="avatar-ring">
          <div className="avatar-frame">
            <img src={Puneeth} alt="Puneeth Reddy" />
            <div className="gloss" />
          </div>
          <div className="status">
            <span className="pulse" />
          </div>
        </div>

        <div className="halo" />
        {!open && firstShow && <div className="tip">Say hi →</div>}
      </button>
    </div>
  )
}
