import { createBrowserRouter } from "react-router-dom";
import App from "../App.tsx";
import { Privacy, Admin, Login, Settings, Reports, Trips, FuelCalculator, Dashboard } from '@pages/index.tsx';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "calculator",
                element: <FuelCalculator />,
            },
            {
                path: "trips",
                element: <Trips />,
            },
            {
                path: "reports",
                element: <Reports />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
            {
                path: "admin",
                element: <Admin />,
            },
            {
                path: "privacy",
                element: <Privacy />,
            },
        ],
    },
    {
        path: "/login",
        element: <Login />,
    },
]);