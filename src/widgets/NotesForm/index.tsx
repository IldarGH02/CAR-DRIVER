import { useState } from 'react'
import { FormInput } from "../../shared/ui/FormInput"
import FormButton from '../../shared/ui/FormButton'

import { useAppDispatch } from '../../features/hooks'
import { addNote } from '../../app/store/slices/notesSlice'
import { nanoid } from '@reduxjs/toolkit'

const NotesForm = () => {
    const [title, setTitle] = useState<string>('')
    const [text, setText] = useState<string>('')
    const [date, setDate] = useState<string>('')

    const todoAddDispatch = useAppDispatch()
    const newID = nanoid()

    const handleInputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = e.target.value
        setTitle(targetValue)
    }

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
        if(title.length > 0 && text.length > 0) {
            todoAddDispatch(addNote({
                title: title,
                text: text,
                date: date,
                id: newID
            }))
            setTitle('')
            setText('')
            setDate('')
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if(e.key === 'Enter') {
            e.preventDefault()
            e.stopPropagation()
            if(title.length > 0 && text.length > 0) {
                todoAddDispatch(addNote({
                    title: title,
                    text: text,
                    date: new Date().toLocaleString(),
                    id: newID,
                    completed: false
                }))
                setTitle('')
                setText('')
                setDate('')
            }
        }
    }

    return (
        <form action="#" className="form__notes">
            <FormInput
                placeholder="Заголовок"
                className="form__input notes-input"
                value={title}
                type="text"
                handleInput={handleInputTitle}
            />
            <FormInput
                placeholder="Текст"
                className="form__input notes-input"
                value={text}
                type="text"
                handleInput={handleInputText}
            />
            <FormInput
                placeholder="Планируемая дата"
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