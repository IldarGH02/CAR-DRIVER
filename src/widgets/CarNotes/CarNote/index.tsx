import { removeNote } from "../../../app/store/slices/notesSlice"
import { ICarNote } from "../../../app/types"
import { useAppDispatch } from "../../../features/hooks"
import { MyButton } from "../../../shared/ui/MyButton"

interface INote {
    item: ICarNote
}

const CarNote: React.FC<INote> = ({item}) => {
    const dispatch = useAppDispatch()

    const deleteTodo = () => {
        dispatch(removeNote(item.id))
    }

    console.log(item)

    return (
        <li className="car__note card">
            <div className="car__note-content">
                <div className="note__description">
                    <p className="note__text">{item.text}</p>
                    <MyButton
                        className="note__button"
                        buttonName="Удалить"
                        handleClick={deleteTodo}
                    />
                </div>
                <span className='note__date'>{item.date}</span>
            </div>
        </li>
    )
}

export default CarNote