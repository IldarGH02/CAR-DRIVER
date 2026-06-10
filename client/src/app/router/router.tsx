import { createBrowserRouter } from "react-router-dom";
import App from "../App.tsx";
import { Privacy, Admin, Login, Settings, Reports, Trips, FuelCalculator, Dashboard } from '@pages/index.tsx';
import { ProtectedRoute } from "@features/auth/components";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "calculator",
                element: (
                    <ProtectedRoute>
                        <FuelCalculator />
                    </ProtectedRoute>
                ),
            },
            {
                path: "trips",
                element: (
                    <ProtectedRoute>
                        <Trips />
                    </ProtectedRoute>
                ),
            },
            {
                path: "reports",
                element: (
                    <ProtectedRoute>
                        <Reports />
                    </ProtectedRoute>
                ),
            },
            {
                path: "settings",
                element: (
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                ),
            },
            {
                path: "admin",
                element: (
                    <ProtectedRoute>
                        <Admin />
                    </ProtectedRoute>
                ),
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