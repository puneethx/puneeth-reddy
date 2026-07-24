import { useEffect, useRef, useState } from 'react'
import './cursor.scss'

export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y

    const move = (e) => {
      x = e.clientX
      y = e.clientY
      if (dot.current) {
        dot.current.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`
      }
    }

    const raf = () => {
      rx += (x - rx) * 0.15
      ry += (y - ry) * 0.15
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`
      }
      requestAnimationFrame(raf)
    }

    window.addEventListener('mousemove', move)
    const id = requestAnimationFrame(raf)

    const hoverables = document.querySelectorAll('a, button, .hoverable')
    const on = () => setHover(true)
    const off = () => setHover(false)
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', on)
      el.addEventListener('mouseleave', off)
    })

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(id)
      hoverables.forEach((el) => {
        el.removeEventListener('mouseenter', on)
        el.removeEventListener('mouseleave', off)
      })
    }
  })

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className={`cursor-ring ${hover ? 'hover' : ''}`} />
    </>
  )
}
