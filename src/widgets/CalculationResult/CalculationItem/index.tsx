import { ICalculation } from "../../../app/types"

interface ICalculationItem {
    calculation: ICalculation
}

const CalculationItem: React.FC<ICalculationItem> = ({calculation}) => {
    return (
        <li className="fuel__result-calculation">                        
            <span className="result__calculation result__price">Заправить на: {calculation.fuelPrice} р.</span>
            <span className="result__calculation result__consumprion">Амортизация: {calculation.deprecationPrice} р.</span>
            <span className="result__calculation result__fuel-volume">Заправить {calculation.fuelVolume} л.</span>
            <span>Дата и время расчёта: {calculation.time}</span>
        </li>
    )
}

export default CalculationItem