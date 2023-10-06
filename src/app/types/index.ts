export interface ICarTodo {
    title: string
    text: string
    date: string
    id: any
    comleted: boolean
}

export interface ICarTodos {
    todos: ICarTodo[]
}

export interface ICalculation {
    calculation: {
        fuelPrice: number
        deprecationPrice: number
        fuelVolume: number
        id: number
    }
}