import { createSlice } from "@reduxjs/toolkit"
import { ICarTodos } from "../../../types"
import { CAR_TODO } from "../../../../features/constants"

const initialState: ICarTodos = {
    todos: []
}

const carTodoSlice = createSlice({
    name: CAR_TODO,
    initialState,
    reducers: {
        addTodo: (state, action) => {
            state.todos.push(action.payload)
        },
        removeTodo: (state, action) => {
            const id = action.payload;
            state.todos = state.todos.filter(item => item.id !== id)
        },
        toggleCompleted: (state, action) => {
            const toggleTodo = state.todos.find(todo => todo.id === action.payload.id);
            toggleTodo!.comleted = !toggleTodo!.comleted
        }
    }
});

export const { addTodo, removeTodo, toggleCompleted } = carTodoSlice.actions

export default carTodoSlice.reducer