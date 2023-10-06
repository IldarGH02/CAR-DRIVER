import { routeMain } from "./routes"
import { useAppSelector } from "../../features/hooks"
import CarNotes from "../../widgets/CarNotes"
import NotesForm from "../../widgets/NotesForm"
import { Title } from "../../widgets/Title"

const CarNotePage = () => {
    const notes = useAppSelector(state => state.notes.notes)

    return (
        <section className="notePage">
            <div className="container">
                <div className="notePage__content">
                    <Title
                        className="notePage__title"
                        titleName="Заметки"
                    />
                    <NotesForm/>
                    <div className="notePage__notes">
                        {notes.length > 0 && <CarNotes notes={notes}/>}
                    </div>
                </div>
            </div>
        </section>
    )
}

export {routeMain}

export default CarNotePage