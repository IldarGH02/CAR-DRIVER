import { createSlice } from "@reduxjs/toolkit"

import { ICalculation } from "../../../types"
import { CALCULATOR } from "../../../../features/constants"

interface ICalcResults {
    calculations: Array<ICalculation>
}

const initialState: ICalcResults = {
    calculations: []
}

const calculatorSlice = createSlice({
    name: CALCULATOR,
    initialState,
    reducers: {
        fuelPriceResult: (state, action) => {
            state.calculations.push(action.payload)
            return state
        }}
})

export const { fuelPriceResult } = calculatorSlice.actions

export default calculatorSlice.reducer