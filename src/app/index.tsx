import { Provider as ReduxProvider } from "react-redux"
import { withProviders } from "./providers";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react"

import "./styles/index.scss"
import { Routing } from "../pages";
import Navigation from "../widgets/Navigation";

const App = () => {
    return (
        <div className="wrapper">
            <ReduxProvider store={store}>
                <PersistGate persistor={persistor}>
                    <Routing/>
                    <Navigation/>
                </PersistGate>
            </ReduxProvider>
        </div>
    )
}

export default withProviders(App);
