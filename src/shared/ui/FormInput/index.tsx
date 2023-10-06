import { Form } from "react-bootstrap"
import { FormControlProps } from "react-bootstrap"

interface IPropsInput {
    placeholder: string | undefined
    className: string | undefined
    type: string
    value: string | number | undefined | null 
    handleInput: React.ChangeEventHandler<HTMLInputElement>
}

export const FormInput: React.FC<IPropsInput & FormControlProps> = ({className, placeholder, type, value, handleInput}) => {
    return (
        <Form.Control 
            className={className} 
            type={type} 
            placeholder={placeholder}
            value={value}
            onInput={handleInput}
        />
    )
}