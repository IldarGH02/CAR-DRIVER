import { createSlice } from "@reduxjs/toolkit"
import { ICarNotes } from "../../../types"
import { CAR_NOTE } from "../../../../features/constants"

const initialState: ICarNotes = {
    notes: []
}

const notesSlice = createSlice({
    name: CAR_NOTE,
    initialState,
    reducers: {
        addNote: (state, action) => {
            state.notes.push(action.payload)
        },
        removeNote: (state, action) => {
            const id = action.payload;
            state.notes = state.notes.filter(item => item.id !== id)
        }
    }
});

export const { addNote, removeNote } = notesSlice.actions

export default notesSlice.reducer