import { NavLink } from "react-router-dom"

import { IoIosCalculator } from "react-icons/io"
import { AiOutlineHome } from "react-icons/ai"
import { CgNotes } from 'react-icons/cg'

const Navigation = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__content">
                    <div className="footer__logo">
                        <span className="footer__logo-c footer__logo-elem">C</span>
                        <span className="footer__logo-d footer__logo-elem">D</span>
                    </div>
                    <div className="footer__nav">
                        <NavLink to='/' className="footer__link home__link">
                            <AiOutlineHome/>
                        </NavLink>
                        <NavLink to='/calculator' className="footer__link calc__link">
                            <IoIosCalculator/>
                        </NavLink>
                        <NavLink to='/notes' className="footer__link notes__link">
                            <CgNotes/>
                        </NavLink>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Navigation