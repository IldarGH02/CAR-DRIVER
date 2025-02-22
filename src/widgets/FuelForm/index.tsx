import { useState } from "react"
import { Form } from "react-bootstrap"

import { MyButton } from "../../shared/ui/MyButton"

import { MyInput } from "../../shared/ui/MyInput"
import { useAppDispatch } from "../../features/hooks"
import { prepareValue } from "../../features/func/fuel-func"
import { calculation } from "../../app/store/slices/calculationSlice"
import { validation } from "../../features/func/validation"

import { nanoid } from "nanoid"

const FuelForm = () => {
    const [distace, setDistace] = useState<string>('')
    const [price, setPrice] = useState<string>('')
    const [consuption, setConsuption] = useState<string>('')
    const [deprecation, setDeprecation] = useState<string>('')

    const newID = nanoid()

    const calculationDispatch = useAppDispatch()

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
        deprecation: string) => 
        
        {
            let _distance = prepareValue(distance)
            let _consumption = prepareValue(consuption)
            let _price = prepareValue(price)
            let _deprecationPrice = prepareValue(deprecation)

            const fuelPrice = Number(Math.floor((_distance * (_consumption / 100)) * _price).toFixed(2))
            const deprecationPrice = Number(Math.floor(_distance * _deprecationPrice).toFixed(2))
            const fuelVolume = Number(Math.floor(_distance * (_consumption / 100)).toFixed(2))

            if(!isNaN(fuelPrice) && !isNaN(deprecationPrice)) {
                calculationDispatch(calculation({
                    fuelPrice: fuelPrice,
                    deprecationPrice: deprecationPrice,
                    fuelVolume: fuelVolume,
                    id: newID,
                    time: new Date().toLocaleString()
                }))
            }
            
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(
            distace.length > 0 && 
            consuption.length > 0 && 
            price.length > 0 && 
            deprecation.length > 0) {
                calculationFuelPrice(distace, consuption, price, deprecation)
                setDistace('')
                setPrice('')
                setDeprecation('')
                setConsuption('')
            } else {
                alert('Поля не заполнены')
            }        
    }

    return (
        <Form className="fuel__form">
            <MyInput
                placeholder="Расстояние"
                className="form__input distance"
                value={distace}
                type="number"
                handleInput={getDistanceValue}
            />
            <MyInput
                placeholder="Средний расход топлива"
                className="form__input consumption"
                value={consuption}
                type="number"
                handleInput={getConsuptionValue}
            />
            <MyInput
                placeholder="Стоимость топлива"
                className="form__input price"
                value={price}
                type="number"
                handleInput={getPriceValue}
            />
            <MyInput
                placeholder="Амортизация"
                className="form__input derpecation"
                value={deprecation}
                type="number"
                handleInput={getDeprecationValue}
            />
            <MyButton
                className="form__button"
                handleClick={handleClick}
                buttonName='Рассчитать'
            />
        </Form>
    )
}

export default FuelForm
