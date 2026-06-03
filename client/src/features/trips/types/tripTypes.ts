export interface TripFormData {
    date: string;
    from: string;
    to: string;
    distance: string;
    fuelCost: string;
    expenseLine?: string;
    purpose: string;
}

export const initialFormData: TripFormData = {
    date: new Date().toISOString().split('T')[0],
    from: "",
    to: "",
    distance: "",
    fuelCost: "",
    expenseLine: "",
    purpose: "",
};