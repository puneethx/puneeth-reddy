import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.scss'
import './styles/mobile.scss'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

/* ------------------------------------------------------------------
 * Boot loader handoff.
 * The inline #boot-loader in index.html renders instantly with the
 * HTML byte. Once React has mounted the app AND the browser has painted
 * a frame or two (giving the DOM time to settle), we fade the loader
 * out and remove it. Wrapped in a double rAF so the removal never
 * competes with React's first commit — that would cause a flash of
 * unstyled content on slow-CPU devices.
 * ------------------------------------------------------------------ */
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const loader = document.getElementById('boot-loader')
    if (!loader) return
    // Optional minimum on-screen time so it doesn't just blink out on
    // fast networks — feels more intentional. Comment out if you want
    // the loader to disappear the instant the app is ready.
    const MIN_VISIBLE_MS = 900
    const started = Number(loader.dataset.startedAt || performance.now())
    const remain = Math.max(0, MIN_VISIBLE_MS - (performance.now() - started))
    setTimeout(() => {
      loader.classList.add('bl-hide')
      document.body.classList.add('app-ready')
      // Give the CSS fade its 0.55s, then detach the node entirely.
      setTimeout(() => loader.parentNode?.removeChild(loader), 700)
    }, remain)
  })
})
