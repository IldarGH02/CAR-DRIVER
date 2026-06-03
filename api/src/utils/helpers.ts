export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export const calculateFuelConsumption = (fuelAmount: number, distance: number): number => {
    if (distance === 0) return 0;
    return (fuelAmount / distance) * 100;
};

export const calculateCostPerKm = (totalCost: number, distance: number): number => {
    if (distance === 0) return 0;
    return totalCost / distance;
};