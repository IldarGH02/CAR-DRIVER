import { useState } from "react"
import { Form } from "react-bootstrap"

import FormButton from "../../shared/ui/FormButton"

import { FormInput } from "../../shared/ui/FormInput"
import { useAppDispatch } from "../../features/hooks"
import { prepareValue } from "../../features/func/fuel-func"
// import { deprecationPriceResult, fuelPriceResult, fuelVolumeResult } from "../../app/store/slices/calculatorSlice"

import { fuelPriceResult} from "../../app/store/slices/calculatorSlice"
import { validation } from "../../features/func/validation"

const FuelForm = () => {
    const [distace, setDistace] = useState<string>('')
    const [price, setPrice] = useState<string>('')
    const [consuption, setConsuption] = useState<string>('')
    const [deprecation, setDeprecation] = useState<string>('')

    const fuelPriceDispatch = useAppDispatch()
    const fuelVolumeDispatch = useAppDispatch()
    const deprecationPriceDisptach = useAppDispatch()


    const getDistanceValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target

        setDistace(input.value)
        validation(input)

        return true
    }

    const getConsuptionValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target

        setConsuption(input.value)
        validation(input)

        return true
    }

    const getPriceValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target

        setPrice(input.value)
        validation(input)

        return true
    }

    const getDeprecationValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target      

        setDeprecation(input.value)
        validation(input)

        return true
    }

    const calculationFuelPrice = (
        distance: string, 
        consuption: string, 
        price: string, 
        depreciation: string) => 
        
        {
            let _distance = prepareValue(distance)
            let _consumption = prepareValue(consuption)
            let _price = prepareValue(price)
            let _depreciationPrice = prepareValue(depreciation)

            const Calculation = {
                fuelPrice: Number(Math.floor((_distance * (_consumption / 100)) * _price).toFixed(2)),
                depreciationPrice: Number(Math.floor(_distance * _depreciationPrice).toFixed(2)),
                fuelVolume: Number(Math.floor(_distance * (_consumption / 100)).toFixed(2))
            }

            if(!isNaN(Calculation.fuelPrice) && !isNaN(Calculation.depreciationPrice)) {
                fuelPriceDispatch(fuelPriceResult(Calculation))
            }
            
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        calculationFuelPrice(distace, consuption, price, deprecation)
        setDistace('')
        setPrice('')
        setDeprecation('')
        setConsuption('')
    }

    return (
        <Form className="fuel__form">
            <FormInput
                placeholder="Расстояние"
                className="form__input distance"
                value={distace}
                type="number"
                handleInput={getDistanceValue}
            />
            <FormInput
                placeholder="Средний расход топлива"
                className="form__input consumption"
                value={consuption}
                type="number"
                handleInput={getConsuptionValue}
            />
            <FormInput
                placeholder="Стоимость топлива"
                className="form__input price"
                value={price}
                type="number"
                handleInput={getPriceValue}
            />
            <FormInput
                placeholder="Амортизация"
                className="form__input derpecation"
                value={deprecation}
                type="number"
                handleInput={getDeprecationValue}
            />
            <FormButton className="form__button" handleClick={handleClick}/>
        </Form>
    )
}

export default FuelForm
