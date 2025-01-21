import { useAppSelector } from "../../features/hooks"
import CalculationResults from "../../widgets/CalculationResult"
import FuelForm from "../../widgets/FuelForm"
import { Title } from "../../widgets/Title"
const FuelCalculator = () => {
    const results = useAppSelector(state => state.results.calculations)

    return (
        <section className="fuel">
            <div className="container">
                <div className="fuel__content">
                    <Title
                        className="fuel__title"
                        titleName="Топливный калькулятор"
                    />
                    <FuelForm/>
                    <CalculationResults
                        results={results}                        
                    />
                </div>
            </div>
        </section>
    )
}
export default FuelCalculator