import { lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { routes } from "../app/router/router";

const Layout = lazy(() => import('./Layout'))
export const Routing = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                { routes ? routes.map(
                    (
                        {
                            path,
                            component: Component
                        }) => {
                            return <Route
                                        key={path}
                                        path={path}
                                        element={<Component/>}
                                    />
                }) :
                    <Route path="*" element={<Navigate to="/"/>}/>
                }
            </Route>
        </Routes>
    )
}