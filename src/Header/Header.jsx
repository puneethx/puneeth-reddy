import React from 'react'
import "./Header.scss"
import { HashLink as SLink } from "react-router-hash-link"
import menu from "../assets/menu.svg"


const Header = () => {
  return (
    <div className='Header'>
      <div className="navbar">
        <ul>
          <li><SLink smooth to="/#skills">SKILLS</SLink></li>
          <li><SLink smooth to="/#projects">PROJECTS</SLink></li>
          <li><SLink smooth to="/#achievements">ACHIEVEMENTS</SLink></li>
          <li><SLink smooth to="/#contact">CONTACT</SLink></li>
        </ul>
      </div>
      <div className='menu'>
        <img src={menu} alt="img" />
      </div>
    </div>
  )
}

export default Header