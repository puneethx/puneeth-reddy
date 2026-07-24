import { FiAward, FiArrowUpRight } from 'react-icons/fi'
import Hack1 from '../assets/hack1.png'
import Hack2 from '../assets/hack2.jpeg'
import Hack3 from '../assets/hack3.jpeg'
import Hack4 from '../assets/hack4.jpeg'
import Vikas from '../assets/vikas.jpg'
import './hackathons.scss'

const items = [
  {
    place: 'Presented',
    event: 'VIKAS 2024 · NexGenTutor',
    where: 'VIT-AP University',
    year: '2024',
    body: 'Presented NexGenTutor at V.I.K.A.S 2024 — an innovation showcase for student-built products. Great room, brilliant minds, and invaluable feedback from industry experts on the AI/EdTech idea we built with the team.',
    img: Vikas,
    href: 'https://www.linkedin.com/posts/puneethx05_vikas2024-vitap-innovation-activity-7261047211398963200--jrx',
  },
  {
    place: 'Winner',
    event: "Proglint's Computer Vision 2K23",
    where: 'Alliance University, Bangalore',
    year: '2023',
    body: 'Built a smart cart system using hand gesture detection + real-time vision analytics — products picked from the shelf are auto-added to a virtual bill.',
    img: Hack4,
    href: '#',
  },
  {
    place: '1st Runner-up',
    event: 'SheCodes 2024 by WTM Reva',
    where: 'REVA University, Bangalore',
    year: '2024',
    body: 'Built an AI-powered e-learning platform with Generative AI, React Three Fiber, and LLaVA-8B — personalized adaptive learning.',
    img: Hack1,
    href: 'https://www.linkedin.com/posts/puneethx05_shecodes2024-hackathon-generativeai-activity-7208431787503472640-urq5',
  },
  {
    place: '1st Runner-up',
    event: 'HackQuest by I-Quest',
    where: 'VIT-AP University',
    year: '2024',
    body: 'AI-powered traffic management + violation detection with YOLO, OCR, OpenCV — automates ticketing to free up police resources.',
    img: Hack3,
    href: '#',
  },
  {
    place: '1st Runner-up',
    event: 'FrameX Web Hackathon by CSI',
    where: 'VIT-AP University',
    year: '2024',
    body: 'Built JobVista — a React job-search platform that improves candidate-recruiter matching and streamlines recruitment.',
    img: Hack2,
    href: 'https://www.linkedin.com/posts/puneethx05_framexwebhack-vitap-jobvista-activity-7175118452251111424-KJcd',
  },
]

export default function Hackathons() {
  return (
    <section id="hackathons" className="hack-sec">
      <div className="container">
        <div className="section-heading reveal">
          <span className="num">05 —</span>
          <h2>Hackathons & Wins</h2>
          <div className="rule" />
        </div>

        <div className="hack-grid">
          {items.map((h, i) => (
            <a
              key={h.event}
              href={h.href}
              target="_blank"
              rel="noreferrer"
              className="hack-card reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="thumb">
                <img src={h.img} alt={h.event} />
                <div className="ribbon">
                  <FiAward /> {h.place}
                </div>
              </div>
              <div className="content">
                <div className="year">{h.year}</div>
                <h4>{h.event}<FiArrowUpRight className="up" /></h4>
                <div className="where">{h.where}</div>
                <p>{h.body}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
