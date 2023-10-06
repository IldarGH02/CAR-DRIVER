import { Title } from "../../widgets/Title";
import { routeMain } from "./routes";

const Home = () => {
    return (
        <section className="home">
            <div className="container">
                <div className="home__content">
                    <Title
                        className="home__title"
                        titleName="CarDriver"
                    />
                </div>
            </div>
        </section>
    )
}

export { routeMain }

export default Home