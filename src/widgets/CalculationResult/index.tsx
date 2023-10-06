import { ICalculation } from "../../app/types"
import CalculationItem from "./CalculationItem"

interface IResults {
    results: ICalculation[]
}

const CalculationResults: React.FC<IResults> = ({results}) => {
    return (
        <ul className="fuel__results">
            {results.length > 0 && results.map((result: ICalculation) => {
                return <CalculationItem 
                    key={result.id}
                    calculation={result}
                />
            })}
        </ul>
    )
}

export default CalculationResults