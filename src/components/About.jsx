import './about.scss'

const stats = [
  { n: '5+', l: 'Production agents shipped' },
  { n: '4×', l: 'Hackathon podiums' },
  { n: '1', l: 'Global conference showcase' },
  { n: '9+', l: 'End-to-end projects' },
]

const stack = [
  { group: 'Agentic AI', items: ['LangChain', 'LangGraph', 'Hybrid RAG', 'BM25 + Cosine', 'Multi-agent orchestration', 'Prompt engineering', 'MCP'] },
  { group: 'ML / Computer Vision', items: ['PyTorch', 'YOLOv8', 'C3D', 'SlowFast', 'Bi-LSTM', 'Tesseract OCR'] },
  { group: 'Backend & APIs', items: ['FastAPI', 'REST', 'Flask', 'Python', 'Java', 'CAPM'] },
  { group: 'Frontend & 3D', items: ['React', 'Next.js', 'React Three Fiber', 'Svelte', 'Streamlit', 'SCSS'] },
]

export default function About() {
  return (
    <section id="about" className="about-sec">
      <div className="container">
        <div className="section-heading reveal">
          <span className="num">01 —</span>
          <h2>About</h2>
          <div className="rule" />
        </div>

        <div className="about-grid">
          <div className="story reveal">
            <p className="lead">
              I'm a <b>Forward Deployed Engineer</b> working on{' '}
              <b>agentic AI</b> — sitting close to the customer, translating
              messy real-world problems into shipped, reliable agent systems.
            </p>
            <p>
              My <b>core focus is agentic AI</b>. I design and build agents
              that reason, retrieve, and act — from enterprise copilots that
              ground every answer in cited data, to Physical AI stacks that
              command real robots on a warehouse floor. I care about
              production quality: guardrails, evals, tool-use traces, and
              answers that actually hold up under audit.
            </p>
            <p>
              Under the hood, I lean on <b>LangGraph</b> for orchestration,{' '}
              <b>hybrid RAG</b> (BM25 + cosine + RRF) with{' '}
              <b>OKF</b> for retrieval, and FastAPI on the serving side. I've
              also built MCP-powered data agents and web-scraping search
              agents for research workflows.
            </p>
            <p>
              Before this — 8 months of computer-vision R&D, four national
              hackathon podiums, and a lot of MERN. I like taking multi-agent
              systems from prototype to production.
            </p>
          </div>
          <div className="side reveal delay-1">
            <div className="stat-grid">
              {stats.map((s, i) => (
                <div className="stat" key={i} style={{ '--i': i }}>
                  <span className="n">{s.n}</span>
                  <span className="l">{s.l}</span>
                </div>
              ))}
            </div>
            <div className="quote">
              <span className="mark">“</span>
              <p>Zero to production, one agent at a time.</p>
            </div>
          </div>
        </div>

        <div className="stack">
          <h3 className="reveal">Tech Stack</h3>
          <div className="stack-grid">
            {stack.map((g, gi) => (
              <div className="stack-col reveal" key={g.group} style={{ transitionDelay: `${gi * 0.08}s` }}>
                <div className="stack-title">{g.group}</div>
                <div className="chips">
                  {g.items.map((t) => (
                    <span key={t} className="chip">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
