import { useState } from 'react'
import './experience.scss'

const jobs = [
  {
    company: 'Infosys',
    role: 'AI Application Engineer / Forward Deployed Engineer',
    period: 'Jul 2024 — Present',
    bullets: [
      'Build production GenAI + agentic AI apps with LangChain, LangGraph, and RAG — exposed via FastAPI and CAP services for an enterprise SAP client.',
      'Shipped 3 production Joule Agents — Search Agent, Troubleshooter Agent, Audit Security Agent — all published to the SAP Business Accelerator Hub by SAP itself.',
      'Contributed to a Physical AI, multi-agent orchestration solution (MAO) for warehouse fulfillment with AMRs and humanoid robots; showcased at SAPPHIRE 2026.',
      'Built a 5-agent LangGraph system with hybrid RAG + OKF retrieval (BM25 + cosine) that autonomously resolves warehouse exceptions.',
    ],
    stack: ['LangGraph', 'LangChain', 'FastAPI', 'CAPM', 'BTP', 'Joule', 'FIORI'],
  },
  {
    company: 'Proglint Software Solutions',
    role: 'Machine Learning Intern',
    period: 'Oct 2023 — Jun 2024',
    bullets: [
      'Built a real-time shoplifting detection system using action-recognition models (C3D, SlowFast, Bi-LSTM).',
      'Built an AI-powered virtual cart tracking system using YOLOv8 — tracks customer movement + product interaction, updates a virtual cart automatically.',
      'Researched architectures for retail challenges; optimized model performance for production.',
    ],
    stack: ['PyTorch', 'YOLOv8', 'C3D', 'SlowFast', 'Django'],
  },
  {
    company: 'Cehpoint',
    role: 'Web Developer Intern',
    period: 'Sep 2023 — Nov 2023',
    bullets: [
      'Frontend development on the BidChem admin dashboard using React.js and Material UI.',
      'Backend work in FastAPI. Maintained GitHub repository — branching, PRs, merges.',
    ],
    stack: ['React', 'Material UI', 'FastAPI', 'GitHub'],
  },
]

export default function Experience() {
  const [active, setActive] = useState(0)
  const job = jobs[active]
  return (
    <section id="experience" className="exp-sec">
      <div className="container">
        <div className="section-heading reveal">
          <span className="num">02 —</span>
          <h2>Experience</h2>
          <div className="rule" />
        </div>

        <div className="exp-grid reveal">
          <div className="tabs">
            {jobs.map((j, i) => (
              <button
                key={j.company}
                className={`tab ${i === active ? 'active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span>{j.company}</span>
              </button>
            ))}
            <div className="marker" style={{ transform: `translateY(${active * 56}px)` }} />
          </div>
          <div className="details" key={active}>
            <div className="role">
              {job.role} <span className="at">@ {job.company}</span>
            </div>
            <div className="period">{job.period}</div>
            <ul>
              {job.bullets.map((b, i) => (
                <li key={i}><span className="marker-dot">▹</span>{b}</li>
              ))}
            </ul>
            <div className="tech-row">
              {job.stack.map((t) => <span className="ttag" key={t}>{t}</span>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
