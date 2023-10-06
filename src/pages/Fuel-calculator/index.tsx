import { useAppSelector } from "../../features/hooks"
import FuelForm from "../../widgets/FuelForm"
import { Title } from "../../widgets/Title"

import { routeMain } from "./routes"

const FuelCalculator = () => {
    // const fuelPrice = useAppSelector(state => state.results.results)
    // const deprecationPrice = useAppSelector(state => state.results.results)
    // const fuelVolume = useAppSelector(state => state.results.results)

    const results = useAppSelector(state => state.results.calculations)
    console.log(results)

    return (
        <section className="fuel">
            <div className="container">
                <div className="fuel__content">
                    <Title
                        className="fuel__title"
                        titleName="Топливный калькулятор"
                    />
                    <FuelForm/>
                    <div className="fuel__result-calculation">
                        <span className="result__calculation result__price">{}</span>
                        <span className="result__calculation result__consumprion">{}</span>
                        <span className="result__calculation result__fuel-volume">{}</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export { routeMain }

export default FuelCalculator