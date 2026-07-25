import { FiArrowUpRight, FiStar } from 'react-icons/fi'
import { WarehouseIllustration, CopilotIllustration, DakshaIllustration } from './Illustrations.jsx'
import HorizontalCardStack from './HorizontalCardStack.jsx'
import Pro1 from '../assets/pro1.png'
import Pro2 from '../assets/pro2.png'
import Pro3 from '../assets/pro3.png'
import Pro4 from '../assets/pro4.png'
import Pro5 from '../assets/pro5.png'
import Pro6 from '../assets/pro6.png'
import Pro7 from '../assets/pro7.png'
import Pro8 from '../assets/pro8.png'
import Pro9 from '../assets/pro9.png'
import './projects.scss'

const projects = [
  {
    title: 'Warehouse Fulfillment Agent',
    tagline: 'Physical AI · 3 Orchestrated Agents · AMR fleet',
    body: 'A multi-agent system that resolves live bin-empty exceptions across a warehouse floor. A Supervisor Agent orchestrates an Inventory Agent (finds the next-nearest bin) and a Logistics Agent (releases the wave, creates the pick, posts the putaway) — writing the resolution back to HANA with an audit trail. Covers three flows: happy path, alternate-bin, and empty-bin with reserve-storage rerouting. Cuts manual exception handling on a fleet of ~120 autonomous robots.',
    tech: ['LangGraph', 'Supervisor–Worker', 'Physical AI', 'HANA'],
    illustration: 'warehouse',
    featured: true,
    href: '#contact',
  },
  {
    title: 'Enterprise Warehouse Copilot',
    tagline: '5-Agent System · Hybrid RAG + OKF · Grounded answers',
    body: 'An enterprise copilot that answers questions across docs, live data, and exceptions — and refuses when unsure. A Supervisor routes to Knowledge / Data / Exception / Synthesis agents. Retrieval is Hybrid RAG (BM25 + Cosine + RRF) with OKF (Open Knowledge Format) structured YAML for grounding. Every answer ships with citations and a grounding score; below-threshold answers are declined.',
    tech: ['Hybrid RAG', 'BM25', 'Cosine + RRF', 'OKF', 'LangGraph'],
    illustration: 'copilot',
    featured: true,
    href: '#contact',
  },
  {
    title: 'DRA — Daksha Humanoid Robot Agent',
    tagline: 'Joule Studio · Multi-Agent · Humanoid Robotics',
    body: 'The brain for a humanoid robot — an extension of the warehouse AMR work into full-body physical tasks. A multi-agent Joule system that plans and drives a task like "pick the product from bin A and deliver to zone B" or "inspect items in bin C", orchestrating navigation, manipulation, and inspection with step-by-step analysis and status feedback. Currently under active development.',
    tech: ['Joule Studio', 'Multi-Agent', 'BTP', 'Humanoid'],
    illustration: 'daksha',
    featured: true,
    href: '#contact',
  },
  {
    title: 'E-Learning Platform (Llama3 + LLaVA)',
    tagline: '3D AI Teacher · React Three Fiber',
    body: 'A 3D virtual AI teacher with facial-emotion recognition that adapts teaching style. Voice + text input. SheCodes 2024 1st Runner-up.',
    tech: ['Three Fiber', 'LangChain', 'Ollama', 'FastAPI'],
    img: Pro7,
    href: 'https://github.com/puneethx/WeCode-VLearn',
  },
  {
    title: 'Raftaar.ai',
    tagline: 'AI Traffic Violation Detection',
    body: 'Automates traffic-violation detection, fine generation, and reporting via YOLOv8 + OCR. HackQuest 2024 1st Runner-up.',
    tech: ['YOLOv8', 'Tesseract', 'React', 'Flask'],
    img: Pro3,
    href: 'https://github.com/puneethx/Nike',
  },
  {
    title: 'JobVista',
    tagline: 'Job Platform · FrameX WebHack Winner',
    body: 'A job platform matching seekers to recruiters with better search and filters. Built during FrameX Web Hackathon (VIT-AP) — 1st Runner-up.',
    tech: ['React', 'Firebase', 'JS'],
    img: Pro6,
    href: 'https://github.com/puneethx/FrameX',
  },
  {
    title: 'StressAway',
    tagline: 'Sentiment-Based Mood App',
    body: 'Journal-driven mood tracker that recommends music, food, exercises, and nearby places based on sentiment analysis.',
    tech: ['Svelte', 'JS', 'Vercel'],
    img: Pro4,
    href: 'https://github.com/puneethx/StressAway',
  },
  {
    title: 'Tripla',
    tagline: 'Eco Travel Planner',
    body: 'Travel planner with trip packages, carpooling, bike-sharing, and a carbon-footprint calculator. Clean UI/UX.',
    tech: ['React', 'JS', 'CSS'],
    img: Pro9,
    href: 'https://github.com/puneethx/Tripla',
  },
  {
    title: 'KK Home Needs',
    tagline: 'E-Commerce · Stripe',
    body: 'React storefront for a home-needs store — product catalog, cart, wishlist, and Stripe checkout.',
    tech: ['React', 'SCSS', 'Stripe'],
    img: Pro1,
    href: 'https://github.com/puneethx/kkhomeneeds-V2',
  },
  {
    title: 'Admin Dashboard',
    tagline: 'Analytics · Material UI',
    body: 'Team-friendly admin dashboard with responsive layouts and quick-glance analytics.',
    tech: ['React', 'Material UI', 'JS'],
    img: Pro5,
    href: 'https://github.com/puneethx/Admin-Dashboard',
  },
  {
    title: 'ATG World',
    tagline: 'Social Network Redesign',
    body: 'Redesign + rebuild of the ATG interest-based social network platform focused on UX.',
    tech: ['React', 'SCSS', 'JS'],
    img: Pro2,
    href: 'https://github.com/puneethx/ATG.World',
  },
  {
    title: 'Collabs',
    tagline: 'Team Task Management',
    body: 'Prototype for automated task assignment, leave management, and team communication.',
    tech: ['Vite', 'Firebase', 'SCSS'],
    img: Pro8,
    href: 'https://github.com/puneethx/microsoft-collabs',
  },
]

export default function Projects() {
  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="proj-sec">
      <div className="container">
        <div className="section-heading reveal">
          <span className="num">04 —</span>
          <h2>Projects</h2>
          <div className="rule" />
        </div>

        <div className="featured">
          {featured.map((p, i) => (
            <article key={p.title} className={`fp reveal ${i % 2 ? 'reverse' : ''}`}>
              <div className="fp-media illus-wrap">
                {p.illustration === 'warehouse' && <WarehouseIllustration />}
                {p.illustration === 'copilot' && <CopilotIllustration />}
                {p.illustration === 'daksha' && <DakshaIllustration />}
                {!p.illustration && p.img && <img src={p.img} alt={p.title} />}
                <div className="scan" />
              </div>
              <div className="fp-body">
                <div className="ftag"><FiStar /> Featured project</div>
                <h3>{p.title}</h3>
                <div className="tagline">{p.tagline}</div>
                <div className="card">
                  <p>{p.body}</p>
                </div>
                <div className="tech">
                  {p.tech.map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>

        <h3 className="other-title reveal">Other things I've built</h3>

        {/* One layout everywhere — the HorizontalCardStack scales down to
            mobile via its own responsive SCSS. */}
        <div className="reveal">
          <HorizontalCardStack
            items={others.map((p) => ({
              title: p.title,
              tagline: p.tagline,
              body: p.body,
              img: p.img,
              href: p.href,
              tech: p.tech,
              tag: p.tech?.[0],
            }))}
          />
        </div>
      </div>
    </section>
  )
}
