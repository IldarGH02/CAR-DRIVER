import { createSlice } from "@reduxjs/toolkit"

import { ICalculation } from "../../../types"
import { CALCULATION } from "../../../../features/constants"

interface ICalcResults {
    calculations: ICalculation[]
}

const initialState: ICalcResults = {
    calculations: []
}

const calculationSlice = createSlice({
    name: CALCULATION,
    initialState,
    reducers: {
        calculation: (state, action) => {
            state.calculations.push(action.payload)
        }}
})

export const { calculation } = calculationSlice.actions

export default calculationSlice.reducer