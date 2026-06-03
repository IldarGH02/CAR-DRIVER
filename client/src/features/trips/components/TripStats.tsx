import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { formatCurrency, formatDistance, roundToTwo } from "@shared/utils/formatters";
import { Fuel } from "lucide-react";

interface TripStatsProps {
    totalTrips: number;
    totalDistance: number;
    totalAmortization: number;
    totalFuelAmount: number;
}

export const TripStats = ({ totalTrips, totalDistance, totalAmortization, totalFuelAmount }: TripStatsProps) => {
    const stats = [
        {
            title: "Всего поездок",
            value: totalTrips,
            unit: "",
        },
        {
            title: "Общий пробег",
            value: formatDistance(totalDistance),
            unit: "",
        },
        {
            title: "Всего топлива",
            value: roundToTwo(totalFuelAmount),
            unit: "л",
            icon: Fuel,
        },
        {
            title: "Общая амортизация",
            value: formatCurrency(totalAmortization),
            unit: "",
        },
    ];

    return (
        <>
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="pb-2 md:pb-3">
                        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl md:text-2xl font-bold flex items-center gap-1 md:gap-2">
                            {stat.icon && <stat.icon className="w-4 h-4 md:w-5 md:h-5" />}
                            {stat.value} {stat.unit}
                        </div>
                        {stat.title === "Общая амортизация" && (
                            <p className="text-xs text-muted-foreground mt-1 hidden md:block">расчет: пробег × 5 ₽</p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </>
    );
};