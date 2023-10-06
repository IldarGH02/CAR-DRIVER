import { removeNote } from "../../../app/store/slices/notesSlice"
import { ICarNote } from "../../../app/types"
import { useAppDispatch } from "../../../features/hooks"
import FormButton from "../../../shared/ui/FormButton"

interface INote {
    item: ICarNote
}

const CarNote: React.FC<INote> = ({item}) => {
    const dispatch = useAppDispatch()

    const deleteTodo = () => {
        dispatch(removeNote(item.id))
    }

    return (
        <li className="car__note">
            <div className="car__note-content">
                <div className="note__description">
                    <h3 className="note__title">{item.title}</h3>
                    <p className="note__text">{item.text}</p>
                    <p className="note__date"> Планируемая дата: <span>{item.date}</span></p>
                </div>
                <FormButton
                    className="note__button"
                    buttonName="Удалить"
                    handleClick={deleteTodo}
                />
            </div>
        </li>
    )
}

export default CarNote