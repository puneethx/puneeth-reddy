import React from 'react'
import "./skills.scss"
import { FiArrowUpRight } from "react-icons/fi"
import Pro1 from "../assets/hack1.png";
import Pro2 from "../assets/hack2.jpeg";
import Pro3 from "../assets/hack3.jpeg";
import Pro4 from "../assets/hack4.jpeg";

const skills = () => {
  return (
    <div className='skills' id='skills'>
      <h2>Hackathons</h2>
        <div className="proflex">
          <div className="testflex">
            <div className="project">
              <a href="https://www.linkedin.com/posts/puneethx05_shecodes2024-hackathon-generativeai-activity-7208431787503472640-urq5?utm_source=share&utm_medium=member_desktop" target='_blank'>
                <div className="pro">
                  <div className="head"><span>SheCodes 2024, REVA<span className='upright'><FiArrowUpRight /></span></span></div>
                  <span className="body">we secured the <span className='bld'>1st Runner-up</span> position at the SheCodes 2024 hackathon held at REVA University, Bangalore! We built an innovative E-learning platform leveraging the power of Generative AI to create personalized and interactive learning experiences.
                  </span>
                  <div className="preview">
                    <img src={Pro1} alt="" />
                  </div>
                </div>
              </a>

            </div>
            <div className="project">
              <a href="https://www.linkedin.com/posts/puneethx05_framexwebhack-vitap-jobvista-activity-7175118452251111424-KJcd?utm_source=share&utm_medium=member_desktop" target='_blank'>
                <div className="pro">
                  <div className="head"><span>FrameX WebHack<span className='upright'><FiArrowUpRight /></span></span></div>
                  <span className="body">We secured the <span className='bld'>1st Runner-up</span> position at the FrameX Web hackathon held at VIT AP University! We developed an innovative job platform web application that makes job searches easier for both job seekers and recruiters, connects qualified candidates with suitable opportunities, and enhances recruitment efficiency.
                  </span>
                  <div className="preview">
                    <img src={Pro2} alt="" />
                  </div>
                </div>
              </a>
            </div>

            <div className="project">
              <a href="https://nike-swart.vercel.app/" target='_blank'>
                <div className="pro">
                  <div className="head"><span>HackQuest<span className='upright'><FiArrowUpRight /></span></span></div>
                  <span className="body">We secured the <span className='bld'>1st Runner-up</span> position at the HackQuest hackathon held at VIT-AP University! Our AI-powered solution uses advanced image recognition and accident detection algorithms to automatically detect traffic violations and potential accidents, aiming to improve traffic safety and free up police resources.
                  </span>
                  <div className="preview">
                    <img src={Pro3} alt="" />
                  </div>
                </div>
              </a>
            </div>
            <div className="project">
              <a href="https://stress-away-web-app.vercel.app/dashboardlog" target='_blank'>
                <div className="pro">
                  <div className="head"><span>Proglint's Computer Vision 2K23<span className='upright'><FiArrowUpRight /></span></span></div>
                  <span className="body">We emerged as the <span className='bld'>winners</span> of Proglint's Computer Vision 2K23 National Hackathon at Alliance University, Bangalore! Our innovative solution introduced a virtual cart for supermarkets, where products picked from the shelf are automatically added to the customer's bill, streamlining the shopping experience.
                  </span>
                  <div className="preview">
                    <img src={Pro4} alt="" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
    </div>
  )
}

export default skills