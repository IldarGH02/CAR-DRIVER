import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistStore, persistReducer } from "redux-persist"

import storage from "redux-persist/lib/storage";
import carTodoSlice from "./slices/todosSlice"
import calculationSlice from "./slices/calculationSlice";
import { ROOT } from "../../features/constants";

const rootReducer = combineReducers({
    todos: carTodoSlice,
    results: calculationSlice
})

const persistConfig = {
    key: ROOT,
    storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>

export const persistor = persistStore(store)