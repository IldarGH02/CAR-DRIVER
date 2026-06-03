export interface ICarNote {
    title: string
    text: string
    date: string
    id: any
}

export interface ICarNotes {
    notes: ICarNote[]
}

export interface ICalculation {
    fuelPrice: number
    deprecationPrice: number
    fuelVolume: number
    id: string  
    time: string  
}