import React from 'react'
import "./achievements.scss"
import experience1 from "../assets/proglint.svg"
import experience2 from "../assets/cehpoint.png"

const achievements = () => {
    return (
        <div className='achievements' id='achievements'>
            <h2>Experience</h2>
            <div className="experience">
                <div className="left">
                    <div className="row">
                        <div className="toprow">
                            <div className="topleftrow">
                                Machine Learning Engineer | Proglint Software Solutions
                            </div>
                            <div className="toprightrow">
                                Oct 2023 - Jun 2024
                            </div>
                        </div>
                        <div className="bottomrow">
                            Leveraging machine learning expertise to create innovative solutions for the retail sector
                            <br />• Developed real-time shoplifting detection system.
                            <br />• Built AI-powered cart tracking system.
                            <br /><br />Track customer movements and product interactions within the store. Implemented dynamic virtual cart functionality, adding and removing items based on customer actions.
                            <br />• Conducted research and experimentation with various architectures to optimize model performance and address specific retail challenges.
                            <br />• Maintained proficiency in PyTorch, YOLOv8, Django, and other relevant technologies.
                        </div>
                    </div>
                    <div className="row">
                        <div className="toprow">
                            <div className="topleftrow">
                                Web Developer | Cehpoint
                            </div>
                            <div className="toprightrow">
                                Sep 2023 - Nov 2023
                            </div>
                        </div>
                        <div className="bottomrow">
                            Worked on Admin Dashboard project - BidChem<br/>
                            • Frontend development using ReactJs and Material UI.<br/>
                            • Backend development in FastAPI. Also, maintaining GitHub repo for merges & branching.
                        </div>
                    </div>
                    <div className="row">
                        <div className="toprow">
                            <div className="topleftrow">
                                Secretary at Machine Learning Club
                            </div>
                            <div className="toprightrow">
                                2022
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="toprow">
                            <div className="topleftrow">
                                Organiser of IIC National Hackathon 2K23
                            </div>
                            <div className="toprightrow">
                                2022
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="toprow">
                            <div className="topleftrow">
                                1st Runnerup in Tech Debate at VTAPP
                            </div>
                            <div className="toprightrow">
                                2022
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <img src={experience1} alt="" />
                    <img className='rightex' src={experience2} alt="" />
                </div>
            </div>
        </div>
    )
}

export default achievements