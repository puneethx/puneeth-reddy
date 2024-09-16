import React from 'react'
import "./Home.scss"
import Puneeth from "../assets/puneeth.png"
import instagram from "../assets/instagram.svg"
import twitter from "../assets/twitter.svg"
import linkedin from "../assets/linkedin.svg"
import github from "../assets/github.svg"
import s1 from "../assets/s1.svg"
import s2 from "../assets/s2.svg"



const Home = () => {
    return (
        <div className='home'>
            <div className="left">
                <p className='text1'>Hello it's me,</p>
                <p className='text2'>Puneeth Reddy.</p>
                <p className='text3'>An enthusiastic Web Developer with a proven track record of building and deploying high-performing websites. Passionate about web development, eager to innovate and create impactful solutions.</p>
                <p className='text4'>SCROLL FOR MORE</p>
                <div className='random'>
                    <p>Web <br />Developer</p>
                </div>
                <div className='links'>
                <a href='https://www.instagram.com/puneethx' target='_blank'>
                    <img src={instagram} alt="instagram" />
                </a>
                <a href='https://www.github.com/puneethx' target='_blank'>
                    <img src={github} alt="github" />
                </a>
                <a href='https://www.x.com/puneeth2x/' target='_blank'>
                    <img src={twitter} alt="twitter" />
                </a>
                <a href='https://www.linkedin.com/in/puneethx05/' target='_blank'>
                    <img src={linkedin} alt="linkedin" />
                </a>    
                </div>
                <div className='grad-mob'></div>
            </div>
            <div className="right">
                <div className="rightimg">
                <img src={Puneeth} alt="img" />
                <div className="robinson">
                    <img src={s1} alt="s1" />
                    <img src={s2} alt="s2" />
                </div>
                </div>
            </div>
        </div>
    )
}

export default Home