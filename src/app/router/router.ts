import Home from "../../pages/Home";
import FuelCalculator from "../../pages/Fuel-calculator";
import CarNotePage from "../../pages/CarNote";
import { JSX } from "react";

interface IPath {
    path: string,
    component: () => JSX.Element
}

export const routes: IPath[] = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/calculator',
        component: FuelCalculator
    },
    {
        path: '/notes',
        component: CarNotePage
    }
]