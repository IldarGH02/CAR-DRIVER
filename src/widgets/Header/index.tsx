import { Title } from "../Title"
import { NavLink } from "react-router-dom"

import { routeMain as routeFuelCalculator } from "../../pages/Fuel-calculator"
import { routeMain as routeCarTodo } from "../../pages/CarNote"
import { routeMain as routeHome } from "../../pages/Home"

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="header__content">
                    <div className="header__logo">
                        <span className="header__logo-c logo-letter">C</span>AR-<span className="header__logo-d logo-letter">D</span>RIVER
                    </div>
                    <div className="header__nav">
                        <NavLink to={routeHome()} className="header__link home__link">
                            Главная
                        </NavLink>
                        <NavLink to={routeFuelCalculator()} className="header__link calc__link">
                            Топливный калькулятор
                        </NavLink>
                        <NavLink to={routeCarTodo()} className="header__link calc__link">
                            Заметки
                        </NavLink>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header