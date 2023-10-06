import { removeCalculation } from "../../../app/store/slices/calculationSlice"
import { ICalculation } from "../../../app/types"
import { useAppDispatch } from "../../../features/hooks"

interface ICalculationItem {
    calculation: ICalculation
}

const CalculationItem: React.FC<ICalculationItem> = ({calculation}) => {
    const dispatch = useAppDispatch()

    const deleteCalculation = () => {
        dispatch(removeCalculation(calculation.id))
    }

    return (
        <li className="fuel__result-calculation">                        
            <span className="result__calculation result__price">Заправить на: <span>{calculation.fuelPrice}</span> р.</span>
            <span className="result__calculation result__consumprion">Амортизация: <span>{calculation.deprecationPrice}</span> р.</span>
            <span className="result__calculation result__fuel-volume">Заправить <span>{calculation.fuelVolume}</span> л.</span>
            <span className="result__calculation result__fuel-time">Дата и время расчёта: <span>{calculation.time}</span></span>
            <button onClick={deleteCalculation} className="result__delete">X</button>
        </li>
    )
}

export default CalculationItem