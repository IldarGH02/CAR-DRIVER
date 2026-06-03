import { Trip } from "@features/trips/model/tripsStore";
import { roundToOne, roundToTwo } from "@shared/utils/formatters";

export interface ReportStats {
    totalTrips: number;
    totalDistance: number;
    totalFuelAmount: number;
    averageFuelConsumption: string;
}

export interface ReportPeriod {
    dateFrom: string;
    dateTo: string;
}

export const filterTripsByPeriod = (trips: Trip[], period: ReportPeriod): Trip[] => {
    let filtered = [...trips];
    if (period.dateFrom) {
        filtered = filtered.filter(trip => trip.date >= period.dateFrom);
    }
    if (period.dateTo) {
        filtered = filtered.filter(trip => trip.date <= period.dateTo);
    }
    return filtered;
};

export const calculateStats = (trips: Trip[]): ReportStats => {
    const totalTrips = trips.length;
    const totalDistance = roundToOne(trips.reduce((sum, t) => sum + t.distance, 0));
    const totalFuelAmount = roundToTwo(trips.reduce((sum, t) => sum + (t.fuelAmount || 0), 0));

    // Берем средний расход из сохраненного значения avgConsumption
    let avgFuelConsumption = 0;
    if (trips.length > 0) {
        const totalConsumption = trips.reduce((sum, t) => {
            if ((t as any).avgConsumption && (t as any).avgConsumption > 0) {
                return sum + (t as any).avgConsumption;
            }
            return sum;
        }, 0);
        avgFuelConsumption = roundToOne(totalConsumption / trips.length);
    }

    return {
        totalTrips,
        totalDistance,
        totalFuelAmount,
        averageFuelConsumption: avgFuelConsumption.toFixed(1)
    };
};

export const formatPeriodText = (period: ReportPeriod): string => {
    const { dateFrom, dateTo } = period;
    if (dateFrom && dateTo) return `Период: ${dateFrom} - ${dateTo}`;
    if (dateFrom) return `Период: с ${dateFrom}`;
    if (dateTo) return `Период: по ${dateTo}`;
    return "За весь период";
};