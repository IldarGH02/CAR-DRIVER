import { Title } from "../../widgets/Title";
import { routeMain } from "./routes";

const Home = () => {
    return (
        <section className="home">
            <div className="container">
                <div className="home__content">
                    <Title
                        className="home__title"
                        titleName="CAR-DRIVER"
                    />
                    <div className="home__description">
                        <p className="home__text">
                            <span>CAR-DRIVER</span> - полностью бесплатное приложение, разработанное 
                            с целью помочь водителям организоваться свою деятельность,
                            связанную с автомобилями.<br/><br/>
                            Тем, кто часто использует личный автомобиль для поездок в 
                            командировки подойдет "Топливный калькулятор", который по
                            введенным параметрам расчитает для Вас необходимые данные: <br/>
                            1) Стоимость топлива по количеству заправленных литров в бак; <br/>
                            2) Аммортизацию за пройденный пробег. <br/><br/>
                            В настоящий момент приложение находится в разработке.
                            Функционал приложения будет расширяться, будет добавляться
                            всё самое необходимое для комфортного использования.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export { routeMain }

export default Home