import './footer.scss'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="container">
        <div className="row">
          <div className="left">
            <div className="brand">puneeth<span>.</span>reddy</div>
            <div className="sm">AI Application Engineer · Bangalore, IN</div>
          </div>
          <div className="right">
            <span className="tag">Built with React · Vite · SCSS · a lot of coffee ☕</span>
            <span className="year">© {new Date().getFullYear()} — All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
