import { NavLink } from "react-router-dom"
const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="header__content">
                    <div className="header__logo">
                        <span className="header__logo-c logo-letter">C</span>AR-<span className="header__logo-d logo-letter">D</span>RIVER
                    </div>
                    <div className="header__nav">
                        <NavLink to='/' className="header__link home__link">
                            Главная
                        </NavLink>
                        <NavLink to='/calculator' className="header__link calc__link">
                            Топливный калькулятор
                        </NavLink>
                        <NavLink to='/notes' className="header__link calc__link">
                            Заметки
                        </NavLink>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header