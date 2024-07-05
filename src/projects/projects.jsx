import React from 'react'
import "./projects.scss"
import { FiArrowUpRight } from "react-icons/fi"
import Pro1 from "../assets/pro1.png";
import Pro2 from "../assets/pro2.png";
import Pro3 from "../assets/pro3.png";
import Pro4 from "../assets/pro4.png";
import Pro5 from "../assets/pro5.png";
import Pro6 from "../assets/pro6.png";
import Pro7 from "../assets/pro7.png";
import Pro8 from "../assets/pro8.png";

const projects = () => {
  return (
    <div className='projects' id='projects'>
      <h2>Projects</h2>
      <div className="proflex">
        <div className="testflex">
          <div className="project">
            <a href="https://github.com/puneethx/kkhomeneeds-V2" target='_blank'>
              <div className="pro">
                <div className="head"><span>KK Home Needs<span className='upright'><FiArrowUpRight /></span></span></div>
                <span className="body">I developed a React js application for a home needs store, enhancing
                  user experience with intuitive UI/UX and seamless navigation.
                  Integrated product catalog, shopping cart, and streamlined checkout
                  process optimizing customer interactions.
                </span>
                <div className="preview">
                  <img src={Pro1} alt="" />
                </div>
                <div className="tech">
                  <div className="wrap"><span>React</span></div>
                  <div className="wrap"><span>SCSS</span></div>
                  <div className="wrap"><span>Stripe</span></div>
                  <div className="wrap"><span>Api</span></div>
                </div>
              </div>
            </a>
          </div>
          <div className="project">
            <a href="https://github.com/puneethx/Admin-Dashboard" target='_blank'>
              <div className="pro">
                <div className="head"><span>Admin Dashboard<span className='upright'><FiArrowUpRight /></span></span></div>
                <span className="body">I attempted to create an admin dashboard tailored to meet the specific needs of professionals or teams, emphasizing a user-friendly interface and responsive design for easy access to critical information at a glance.
                </span>
                <div className="preview">
                  <img src={Pro5} alt="" />
                </div>
                <div className="tech">
                  <div className="wrap"><span>React</span></div>
                  <div className="wrap"><span>CSS</span></div>
                  <div className="wrap"><span>Javascript</span></div>
                  <div className="wrap"><span>Vercel</span></div>
                  <div className="wrap"><span>Material UI</span></div>
                </div>
              </div>
            </a>
          </div>
          <div className="project">
            <a href="https://github.com/puneethx/ATG.World" target='_blank'>
              <div className="pro">
                <div className="head"><span>ATG World<span className='upright'><FiArrowUpRight /></span></span></div>
                <span className="body">I redesigned and built a website for Across The Globe company, with featuring
                  good user experience and UI/UX.
                  Across The Globe is an interest based social network platform where
                  people Across The Globe connect, collaborate, learn and inspire each other.
                </span>
                <div className="preview">
                  <img src={Pro2} alt="" />
                </div>
                <div className="tech">
                  <div className="wrap"><span>React</span></div>
                  <div className="wrap"><span>SCSS</span></div>
                  <div className="wrap"><span>Javascript</span></div>
                  <div className="wrap"><span>Vercel</span></div>

                </div>
              </div>
            </a>
          </div>

          <div className="project">
            <a href="https://github.com/puneethx/Nike" target='_blank'>
              <div className="pro">
                <div className="head"><span>Nike Jordan Redesign<span className='upright'><FiArrowUpRight /></span></span></div>
                <span className="body">I redesigned and developed of the iconic Nike Jordan website, focusing intensely on creating a highly satisfactory user interface and ensuring responsive layouts. This involved enhancing usability across various devices while maintaining the brand's essence and appeal.
                </span>
                <div className="preview">
                  <img src={Pro3} alt="" />
                </div>
                <div className="tech">
                  <div className="wrap"><span>Vite + React</span></div>
                  <div className="wrap"><span>Tailwind CSS</span></div>
                  <div className="wrap"><span>Javascript</span></div>
                  <div className="wrap"><span>Vercel</span></div>
                  <div className="wrap"><span>HTML</span></div>
                </div>
              </div>
            </a>
          </div>
          <div className="project">
            <a href="https://github.com/puneethx/StressAway" target='_blank'>
              <div className="pro">
                <div className="head"><span>StressAway<span className='upright'><FiArrowUpRight /></span></span></div>
                <span className="body">StressAway is a product designed to uplift a person's mood by analyzing their journal entries. It recommends stress relief activities such as music, movies, books, exercises, food, and nearby locations tailored to enhance their well-being based on their current mood.
                </span>
                <div className="preview">
                  <img src={Pro4} alt="" />
                </div>
                <div className="tech">
                  <div className="wrap"><span>Svelte</span></div>
                  <div className="wrap"><span>Javascript</span></div>
                  <div className="wrap"><span>Vercel</span></div>
                </div>
              </div>
            </a>
          </div>
          <div className="project">
            <a href="https://github.com/puneethx/FrameX" target='_blank'>
              <div className="pro">
                <div className="head"><span>JobVista <span className='upright'><FiArrowUpRight /></span></span></div>
                <span className="body">I developed an innovative job platform web application that makes job searches easier for both job seekers and recruiters, connects qualified candidates with suitable opportunities, and enhances recruitment efficiency.
                </span>
                <div className="preview">
                  <img src={Pro6} alt="" />
                </div>
                <div className="tech">
                  <div className="wrap"><span>React</span></div>
                  <div className="wrap"><span>CSS</span></div>
                  <div className="wrap"><span>Javascript</span></div>
                  <div className="wrap"><span>Firebase</span></div>
                </div>
              </div>
            </a>
          </div>
          <div className="project">
            <a href="https://github.com/puneethx/WeCode-VLearn" target='_blank'>
              <div className="pro">
                <div className="head"><span>VLearn<span className='upright'><FiArrowUpRight /></span></span></div>
                <span className="body">I developed an advanced E-learning platform that harnesses Generative AI to offer personalized and interactive learning experiences. The platform includes a 3D tutor and quiz options to enhance engagement and learning effectiveness.
                </span>
                <div className="preview">
                  <img src={Pro7} alt="" />
                </div>
                <div className="tech">
                  <div className="wrap"><span>Vite+React</span></div>
                  <div className="wrap"><span>SCSS</span></div>
                  <div className="wrap"><span>ThreeJS</span></div>
                  <div className="wrap"><span>llava</span></div>
                  <div className="wrap"><span>Ollama</span></div>
                </div>
              </div>
            </a>
          </div>
          <div className="project">
            <a href="https://github.com/puneethx/microsoft-collabs" target='_blank'>
              <div className="pro">
                <div className="head"><span>Collabs<span className='upright'><FiArrowUpRight /></span></span></div>
                <span className="body">Developed a prototype web-based application named COLLABS for task assignment and
management within teams. It features automated task allocation, leave management, and efficient
team communication, ensuring optimal task distribution 
                </span>
                <div className="preview">
                  <img src={Pro8} alt="" />
                </div>
                <div className="tech">
                  <div className="wrap"><span>Vite+React</span></div>
                  <div className="wrap"><span>SCSS</span></div>
                  <div className="wrap"><span>Firebase</span></div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default projects