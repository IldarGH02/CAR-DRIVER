import { lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { routeMain as FuelRouteMain } from "./Fuel-calculator";
import { routeMain as CarTodoRouteMain } from './CarNote'
import { routeMain as HomeRouteMain } from "./Home";

const Layout = lazy(() => import('./Layout'))
const FuelCalculator = lazy(() => import('./Fuel-calculator'))
const CarTodo = lazy(() => import('./CarNote'))
const Home = lazy(() => import('./Home'))

export const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                <Route path={HomeRouteMain()} element={<Home/>}/>
                <Route path={FuelRouteMain()} element={<FuelCalculator/>}/>
                <Route path={CarTodoRouteMain()} element={<CarTodo/>}/>
                <Route path="*" element={<Navigate to="/"/>}/>
            </Route>
        </Routes>
    )
}