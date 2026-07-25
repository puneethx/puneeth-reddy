import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Global smooth-scroll hook powered by Lenis.
 *  - Wheels/trackpads: heavily eased, snappy stop
 *  - Anchor links (`href="#..."`): intercepted and scrolled to via Lenis so
 *    they use the same easing as wheel scrolling
 *  - Respects `prefers-reduced-motion` — skipped entirely there
 *  - Skipped on touch devices (native inertia is already smooth)
 */
export default function useSmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (prefersReduced || isTouch) return

    const lenis = new Lenis({
      duration: 1.15,                     // seconds
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    let raf = 0
    const tick = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Intercept in-page anchor clicks so they use Lenis's easing
    const onAnchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const hash = a.getAttribute('href')
      if (!hash || hash === '#') return
      const target = document.querySelector(hash)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -60, duration: 1.35 })
    }
    document.addEventListener('click', onAnchorClick)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [])
}
