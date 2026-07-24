import { FiArrowUpRight, FiAward } from 'react-icons/fi'
import ClaudeCert from '../assets/claude_certified.jpg'
import './certifications.scss'

const items = [
  {
    title: 'Claude Certified Architect — Foundations',
    issuer: 'Anthropic',
    year: '2025',
    body: 'Certified on designing and building production-grade applications with Claude — agentic AI workflows, RAG (Retrieval-Augmented Generation), Claude Code, the Claude Agent SDK, the Claude API, and MCP (Model Context Protocol).',
    tags: ['Agentic AI', 'RAG', 'Claude Code', 'Agent SDK', 'Claude API', 'MCP'],
    img: ClaudeCert,
    href: 'https://www.linkedin.com/posts/puneethx05_claude-anthropic-ai-activity-7485696948705095682-QgR7',
    featured: true,
  },
]

export default function Certifications() {
  return (
    <section id="certifications" className="cert-sec">
      <div className="container">
        <div className="section-heading reveal">
          <span className="num">03 —</span>
          <h2>Certifications</h2>
          <div className="rule" />
        </div>

        <div className="cert-grid">
          {items.map((c, i) => (
            <a
              key={c.title}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="cert-card reveal"
              style={{ transitionDelay: `${i * 0.08}s` }}
              data-glow
            >
              <div className="cert-media">
                <img src={c.img} alt={c.title} />
                <div className="halo" />
                <div className="badge">
                  <FiAward /> Certified
                </div>
              </div>
              <div className="cert-body">
                <div className="issuer">
                  <span className="anth">
                    <span className="anth-dot" /> {c.issuer}
                  </span>
                  <span className="year">{c.year}</span>
                </div>
                <h3>
                  {c.title}
                  <FiArrowUpRight className="up" />
                </h3>
                <p>{c.body}</p>
                <div className="tags">
                  {c.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <div className="linkedin-hint">Read the announcement on LinkedIn →</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
