import { Button, ButtonProps } from "react-bootstrap"

interface IPropsButton {
    className: string
    handleClick: React.MouseEventHandler<HTMLButtonElement>
}

const FormButton: React.FC<IPropsButton & ButtonProps> = ({className, handleClick}) => {
    return (
        <Button className={className} onClick={handleClick}>Рассчитать</Button>
    )
}

export default FormButton