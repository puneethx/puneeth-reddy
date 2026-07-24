import { FiMail, FiPhone, FiGithub, FiLinkedin, FiInstagram, FiArrowUpRight, FiMapPin } from 'react-icons/fi'
import './contact.scss'

const rows = [
  { icon: <FiMail />, label: 'Email', value: 'puneethreddyt2004@gmail.com', href: 'mailto:puneethreddyt2004@gmail.com' },
  { icon: <FiPhone />, label: 'Phone / WhatsApp', value: '+91 9502478335', href: 'tel:+919502478335' },
  { icon: <FiGithub />, label: 'GitHub', value: 'github.com/puneethx', href: 'https://github.com/puneethx' },
  { icon: <FiLinkedin />, label: 'LinkedIn', value: 'linkedin.com/in/puneethx05', href: 'https://www.linkedin.com/in/puneethx05/' },
  { icon: <FiInstagram />, label: 'Instagram', value: 'instagram.com/puneethx', href: 'https://www.instagram.com/puneethx' },
]

export default function Contact() {
  return (
    <section id="contact" className="contact-sec">
      <div className="container">
        <div className="section-heading reveal">
          <span className="num">06 —</span>
          <h2>Contact</h2>
          <div className="rule" />
        </div>

        <div className="contact-hero reveal">
          <div className="pre">Let's build something together</div>
          <h3>
            Have an <span className="grad">Agentic AI</span> idea?<br />
            Or a <span className="grad">product</span> that needs a builder?
          </h3>
          <p>
            I'm currently at Infosys but always open to interesting conversations —
            forward-deployed roles, AI startup ideas, or collaborations. Fastest way
            to reach me is email.
          </p>
          <div className="loc">
            <FiMapPin /> Bangalore, India
          </div>
        </div>

        <div className="rows">
          {rows.map((r, i) => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noreferrer"
              className="row reveal"
              style={{ transitionDelay: `${i * 0.05}s` }}
            >
              <div className="icon">{r.icon}</div>
              <div className="mid">
                <div className="label">{r.label}</div>
                <div className="value">{r.value}</div>
              </div>
              <FiArrowUpRight className="arrow" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
