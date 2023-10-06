interface IPropsTitle {
    className: string
    titleName: string
}

export const Title: React.FC<IPropsTitle> = (props) => {
    return <h2 className={props.className}>{props.titleName}</h2>
}