import { NavLink } from "react-router-dom"

import { routeMain as routeFuelCalculator } from "../../pages/Fuel-calculator"
import { routeMain as routeHome } from "../../pages/Home"

import { IoIosCalculator } from "react-icons/io"
import { AiOutlineHome } from "react-icons/ai"

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
                        <NavLink to={routeHome()} className="footer__link home__link">
                            <AiOutlineHome/>
                        </NavLink>
                        <NavLink to={routeFuelCalculator()} className="footer__link calc__link">
                            <IoIosCalculator/>
                        </NavLink>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Navigation