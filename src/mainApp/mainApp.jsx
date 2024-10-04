import React from 'react'
import "./mainApp.scss"
import Header from '../Header/Header'
import Home from "../Home/Home"
import About from "../about/about"
import Skills from "../skills/skills"
import Projects from '../projects/projects'
import Achievements from '../achievements/achievements'
import Contact from '../contact/contact'
import { Routes, Route } from "react-router-dom"

const mainApp = () => {
    return (
        <React.Fragment>
            <div className='main'>
                <div className="mainApp">
                    <Header />
                    <Routes>
                        <Route path="/"
                            element={<React.Fragment>
                                <Home />
                                <div className='margin'>
                                    <Projects />
                                    <Skills />
                                    <Achievements />
                                    <About />
                                    <Contact />
                                </div>
                            </React.Fragment>} />
                    </Routes>
                </div>
            </div>
        </React.Fragment>
    )
}

export default mainApp