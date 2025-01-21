import { useState } from 'react'
import { MyInput } from "../../shared/ui/MyInput"
import { MyButton } from '../../shared/ui/MyButton'

import { useAppDispatch } from '../../features/hooks'
import { addNote } from '../../app/store/slices/notesSlice'
import { nanoid } from '@reduxjs/toolkit'

const NotesForm = () => {
    const [text, setText] = useState<string>('')
    const [date, setDate] = useState<string>('')

    const todoAddDispatch = useAppDispatch()
    const newID = nanoid()

    const handleInputText = (e: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = e.target.value
        setText(targetValue)
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(text.length > 0) {
            todoAddDispatch(addNote({
                text: text,
                date: new Date().toLocaleString(),
                id: newID,
                completed: false
            }))
            setText('')
            setDate('')
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if(e.key === 'Enter') {
            e.preventDefault()
            e.stopPropagation()
            if(text.length > 0) {
                todoAddDispatch(addNote({
                    text: text,
                    date: new Date().toLocaleString(),
                    id: newID,
                    completed: false
                }))
                setText('')
                setDate('')
            }
        }
    }

    return (
        <form action="#" className="form__notes">
            <MyInput
                placeholder="Введите текст"
                className="form__input notes-input"
                value={text}
                type="text"
                handleInput={handleInputText}
            />
            <MyButton
                className='notes__button'
                buttonName='Добавить заметку'
                handleClick={handleClick}
                handleKeyDown={handleKeyDown}
            />
        </form>
    )
}

export default NotesForm