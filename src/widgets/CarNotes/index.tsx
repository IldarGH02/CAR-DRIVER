import { ICarNote } from "../../app/types"
import CarItem from "./CarNote"

interface INotes {
    notes: ICarNote[]
}

const CarNotes: React.FC<INotes> = ({notes}) => {
    return (
        <ul className="car__notes">
            {notes.length > 0 && notes.map((note: ICarNote) => {
                return <CarItem
                    key={note.id}
                    item={note}
                />
            })}
        </ul>
    )
}

export default CarNotes