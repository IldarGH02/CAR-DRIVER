import { Button, ButtonProps } from "react-bootstrap"
interface IPropsButton {
    className: string
    handleClick: React.MouseEventHandler<HTMLButtonElement>
    buttonName: string
    handleKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>
}

export const MyButton: React.FC<IPropsButton & ButtonProps> = (
    {
        className,
        handleClick,
        handleKeyDown,
        buttonName
    }) => {
    return (
        <Button className={className} onClick={handleClick} onKeyDown={handleKeyDown}>{buttonName}</Button>
    )
}