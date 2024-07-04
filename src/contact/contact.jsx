import React from 'react'
import "./contact.scss"
import gmail from "../assets/conmail.svg"
import whatsapp from "../assets/conwha.svg"
import github from "../assets/congit.svg"
import instagram from "../assets/conins.svg"


const contact = () => {
    return (
        <div className='contact' id='contact'>
            <h2>Contact</h2>
            <p>Feel free to contact me</p>
            <div className='context'>
                <div className="row">
                    <img src={gmail} alt="mail" />
                    <p>puneethreddyt2004@gmail.com</p>
                </div>
                <div className="row">
                    <img src={whatsapp} alt="mail" />
                    <p>9502478335</p>
                </div>
                <a href='https://www.github.com/puneethx' target='_blank'>
                    <div className="row">
                        <img src={github} alt="mail" />
                        <p>puneethx</p>
                    </div>
                </a>
                <a href='https://www.instagram.com/puneethx' target='_blank'>
                    <div className="row">
                        <img src={instagram} alt="mail" />
                        <p>puneethx</p>
                    </div>
                </a>
            </div>
        </div>
    )
}

export default contact