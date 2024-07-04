import React from 'react'
import "./achievements.scss"
import experience from "../assets/exp.svg"

const achievements = () => {
    return (
        <div className='achievements' id='achievements'>
            <h2>Achievements & Experience</h2>
            <div className="experience">
                <div className="left">
                    <div className="row">
                        <div className="toprow">
                            <div className="topleftrow">
                                Intership at iConnect pvt info solutions, Navi Mumbai
                            </div>
                            <div className="toprightrow">
                                2023
                            </div>
                        </div>
                        <div className="bottomrow">
                            I was employed as a product engineer in iConnect pvt info solutions, Mumbai for a duration of 4 Months, worked in offline capacity
                        </div>
                    </div>
                    <div className="row">
                        <div className="toprow">
                            <div className="topleftrow">
                                Freshdesk Advance Certification in ITSM Tool
                            </div>
                            <div className="toprightrow">
                                2023
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="toprow">
                            <div className="topleftrow">
                                Senior Community Manager
                            </div>
                            <div className="toprightrow">
                                2023
                            </div>
                        </div>
                        <div className="bottomrow">
                            As a key member of the administrative team at CSI, I contribute by efficiently coordinating and supporting club activities.
                        </div>
                    </div>
                    <div className="row">
                        <div className="toprow">
                            <div className="topleftrow">
                                organizer for Voice of Vortex event at VTAPP
                            </div>
                            <div className="toprightrow">
                                2023
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="toprow">
                            <div className="topleftrow">
                                Admin Lead of VTalks Department
                            </div>
                            <div className="toprightrow">
                                2022
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="toprow">
                            <div className="topleftrow">
                                organizer for Tech Debate in VTAPP
                            </div>
                            <div className="toprightrow">
                                2022
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="toprow">
                            <div className="topleftrow">
                                Advanced Data Analytics Tools, VITAP
                            </div>
                            <div className="toprightrow">
                                2021
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <img src={experience} alt="" />
                </div>
            </div>
        </div>
    )
}

export default achievements