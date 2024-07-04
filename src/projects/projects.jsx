import React from 'react'
import "./projects.scss"
import { FiArrowUpRight } from "react-icons/fi"
import Pro1 from "../assets/pro1.png";
import Pro2 from "../assets/pro2.png";
import Pro3 from "../assets/pro3.png";
import Pro4 from "../assets/pro4.png";
import Pro5 from "../assets/pro5.png";

const projects = () => {
  return (
    <div className='projects' id='projects'>
      <h2>Projects</h2>
      <div className="proflex">
        <div className="testflex">
          <div className="project">
            <a href="https://kkhomeneeds-v2.vercel.app/" target='_blank'>
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
                  <div className="wrap"><span>Javascript</span></div>
                  <div className="wrap"><span>Stripe</span></div>
                  <div className="wrap"><span>Strapi</span></div>
                  <div className="wrap"><span>Vercel</span></div>
                  <div className="wrap"><span>Redux</span></div>
                  <div className="wrap"><span>Api</span></div>
                </div>
              </div>
            </a>

          </div>
          <div className="project">
            <a href="https://atg-world-delta.vercel.app/" target='_blank'>
              <div className="pro">
                <div className="head"><span>ATG World<span className='upright'><FiArrowUpRight /></span></span></div>
                <span className="body">I had built a website for Across The Globe company, with featuring
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
            <a href="https://nike-swart.vercel.app/" target='_blank'>
              <div className="pro">
                <div className="head"><span>Nike Jordan Redesign<span className='upright'><FiArrowUpRight /></span></span></div>
                <span className="body">I tried to redesign and develop a website for the iconic nike jordan,
                  prioritizing a satsifactory user interface and responsive layouts.
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
            <a href="https://stress-away-web-app.vercel.app/dashboardlog" target='_blank'>
              <div className="pro">
                <div className="head"><span>StressAway<span className='upright'><FiArrowUpRight /></span></span></div>
                <span className="body">StressAway is a product that enhances the mood of a person
                  by recommending stress relief ways based on the journal written by the person.
                  The product analyzes the journal , understands the mood of a person and
                  recommends different kinds of music , movies, books, exercises, food
                  and also the places around the user’s location that boosts his/her mood.
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
            <a href="https://puneethx-admin-dashboard.vercel.app/" target='_blank'>
              <div className="pro">
                <div className="head"><span>Admin Dashboard<span className='upright'><FiArrowUpRight /></span></span></div>
                <span className="body">I tried to develop an admin dashboard that allows at-a-glance access to the crucial
                  information for the specific needs of a particular professional or a team.
                  and prioritizing a satsifactory user interface and responsive layouts.
                </span>
                <div className="preview">
                  <img src={Pro5} alt="" />
                </div>
                <div className="tech">
                  <div className="wrap"><span>React</span></div>
                  <div className="wrap"><span>Javascript</span></div>
                  <div className="wrap"><span>Vercel</span></div>
                  <div className="wrap"><span>Material UI</span></div>
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