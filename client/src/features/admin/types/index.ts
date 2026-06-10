export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    carModel?: string;
    carYear?: string;
    licensePlate?: string;
    createdAt?: string;
}

export interface Trip {
    id: number;
    date: string;
    from: string;
    to: string;
    distance: number;
    fuelAmount: number;
    fuelCost: number;
    amortization: number;
    purpose: string;
    expenseLine?: string;
    status?: string;
}

export interface NewUser {
    email: string;
    password: string;
    name: string;
    role: string;
}

export interface EditUser {
    name: string;
    role: string;
    carModel: string;
    carYear: string;
    licensePlate: string;
}

export interface NewTrip {
    date: string;
    from: string;
    to: string;
    distance: string;
    fuelAmount: string;
    amortization: string;
    purpose: string;
    expenseLine: string;
}