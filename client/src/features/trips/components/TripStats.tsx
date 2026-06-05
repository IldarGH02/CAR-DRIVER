import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { formatCurrency, formatDistance, roundToTwo } from "@shared/utils/formatters";
import { Fuel, TrendingUp, MapPin, Calendar } from "lucide-react";

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
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Общий пробег",
            value: formatDistance(totalDistance),
            unit: "",
            icon: MapPin,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Всего топлива",
            value: roundToTwo(totalFuelAmount),
            unit: "л",
            icon: Fuel,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Общая амортизация",
            value: formatCurrency(totalAmortization),
            unit: "",
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            {stats.map((stat, index) => (
                <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                                    {stat.title}
                                </p>
                                <p className="text-lg md:text-2xl font-bold tracking-tight">
                                    {stat.value} {stat.unit}
                                </p>
                            </div>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <stat.icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};