/**
 * Iphone — SCSS port of Magic UI's <Iphone /> component.
 *
 * Renders an iPhone 15 Pro-style frame with side buttons, silence
 * switch, dynamic island, and a rounded screen area. Anything passed
 * as children renders on the screen.
 *
 * Usage:
 *   <Iphone>
 *     <YourCanvasOrApp />
 *   </Iphone>
 *
 * The wrapper's width scales down to fit small viewports; the
 * inner elements scale with it via % positioning.
 */
import './iphone.scss'

export default function Iphone({ children, className = '', title = null }) {
  return (
    <div className={`iphone ${className}`}>
      {/* Side buttons — silence switch + volume + action button + power */}
      <span className="iphone-btn iphone-btn--silence" aria-hidden="true" />
      <span className="iphone-btn iphone-btn--vol-up" aria-hidden="true" />
      <span className="iphone-btn iphone-btn--vol-down" aria-hidden="true" />
      <span className="iphone-btn iphone-btn--power" aria-hidden="true" />

      {/* Outer titanium frame */}
      <div className="iphone-frame">
        {/* Inner bezel */}
        <div className="iphone-bezel">
          {/* Screen surface */}
          <div className="iphone-screen">
            {/* Status bar — time (left) + signal/wifi/battery (right).
                Sits behind the dynamic island so both stay visually pinned
                to the top edge of the screen, iOS-style. */}
            <div className="iphone-status" aria-hidden="true">
              <span className="iphone-status-time">9:41</span>
              <span className="iphone-status-right">
                {/* Signal — 4 stepped bars */}
                <svg
                  className="iphone-status-signal"
                  viewBox="0 0 18 12"
                  width="18"
                  height="12"
                  aria-hidden="true"
                >
                  <rect x="0"  y="8" width="3" height="4"  rx="0.6" />
                  <rect x="5"  y="5" width="3" height="7"  rx="0.6" />
                  <rect x="10" y="2" width="3" height="10" rx="0.6" />
                  <rect x="15" y="0" width="3" height="12" rx="0.6" />
                </svg>

                {/* Wifi — three arcs + dot */}
                <svg
                  className="iphone-status-wifi"
                  viewBox="0 0 16 12"
                  width="15"
                  height="11"
                  aria-hidden="true"
                >
                  <path
                    d="M8 11.2 A1.2 1.2 0 1 0 8 8.8 A1.2 1.2 0 1 0 8 11.2Z"
                    fill="currentColor"
                  />
                  <path
                    d="M3.6 7.4 A6.2 6.2 0 0 1 12.4 7.4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M1.2 4.8 A9.6 9.6 0 0 1 14.8 4.8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Battery — outlined pill with fill inside */}
                <span className="iphone-status-battery" aria-hidden="true">
                  <span className="iphone-status-battery-fill" />
                </span>
              </span>
            </div>

            {/* Dynamic island */}
            <div className="iphone-island" aria-hidden="true">
              <span className="iphone-island-cam" />
            </div>

            {/* Optional title chip above the content — subtle, mono */}
            {title && <div className="iphone-title">{title}</div>}

            {/* Screen content */}
            <div className="iphone-content">{children}</div>

            {/* Home indicator */}
            <div className="iphone-home" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  )
}
