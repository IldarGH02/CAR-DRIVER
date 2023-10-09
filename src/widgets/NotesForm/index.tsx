import { useState } from 'react'
import { FormInput } from "../../shared/ui/FormInput"
import FormButton from '../../shared/ui/FormButton'

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

    const handleInputDate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = e.target.value
        setDate(targetValue)
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(text.length > 0) {
            todoAddDispatch(addNote({
                text: text,
                date: date,
                id: newID
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
            <FormInput
                placeholder="Введите текст"
                className="form__input notes-input"
                value={text}
                type="text"
                handleInput={handleInputText}
            />
            <FormInput
                placeholder="Дата"
                className="form__input notes-date"
                value={date}
                type="text"
                handleInput={handleInputDate}
            />

            <FormButton
                className='notes__button'
                buttonName='Добавить заметку'
                handleClick={handleClick}
                handleKeyDown={handleKeyDown}
            />
        </form>
    )
}

export default NotesForm