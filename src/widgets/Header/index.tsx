import { Title } from "../Title"
import { NavLink } from "react-router-dom"

import { routeMain as routeFuelCalculator } from "../../pages/Fuel-calculator"
import { routeMain as routeHome } from "../../pages/Home"

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="header__content">
                    <Title
                        className="header__title"
                        titleName="CAR-DRIVER"
                    />
                    <div className="header__nav">
                        <NavLink to={routeHome()} className="header__link home__link">
                            Главная
                        </NavLink>
                        <NavLink to={routeFuelCalculator()} className="header__link calc__link">
                            Топливный калькулятор
                        </NavLink>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header