import { Trip } from "../model/tripsStore";
import { roundToOne, roundToTwo } from "@shared/utils/formatters";

// Амортизация = пробег * 5 рублей
export const calculateAmortization = (distance: number, rate: number = 5): number => {
    return roundToTwo(distance * rate);
};

// Расчет количества топлива из среднего расхода
export const calculateFuelAmount = (avgConsumption: number, distance: number): number => {
    return roundToTwo((avgConsumption * distance) / 100);
};

// Расчет стоимости топлива
export const calculateFuelCost = (fuelAmount: number, fuelPrice: number): number => {
    return roundToTwo(fuelAmount * fuelPrice);
};

// Расчет общей стоимости поездки (только амортизация, топливо не учитываем в отчете)
export const calculateTotalTripCost = (amortization: number): number => {
    return roundToTwo(amortization);
};

export const calculateTotalStats = (trips: Trip[]) => {
    const totalTrips = trips.length;
    const totalDistance = roundToOne(trips.reduce((sum, t) => sum + t.distance, 0));
    const totalAmortization = roundToTwo(trips.reduce((sum, t) => sum + t.amortization, 0));
    const totalFuelAmount = roundToTwo(trips.reduce((sum, t) => sum + (t.fuelAmount || 0), 0));

    // Средний расход топлива из сохраненных значений
    let avgConsumption = 0;
    if (trips.length > 0) {
        const totalAvgConsumption = trips.reduce((sum, t) => {
            if ((t as any).avgConsumption) {
                return sum + (t as any).avgConsumption;
            }
            return sum;
        }, 0);
        avgConsumption = roundToOne(totalAvgConsumption / trips.length);
    }

    return {
        totalTrips,
        totalDistance,
        totalAmortization,
        totalExpenses: roundToTwo(totalAmortization),
        totalFuelAmount,
        averageFuelConsumption: avgConsumption
    };
};