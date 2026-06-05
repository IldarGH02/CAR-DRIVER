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
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                        Всего поездок
                        <Calendar className="w-4 h-4 text-blue-500" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalTrips}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                        Общий пробег
                        <MapPin className="w-4 h-4 text-green-500" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatDistance(totalDistance)}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                        Всего топлива
                        <Fuel className="w-4 h-4 text-orange-500" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{roundToTwo(totalFuelAmount)} л</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                        Общая амортизация
                        <TrendingUp className="w-4 h-4 text-purple-500" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(totalAmortization)}</div>
                    <p className="text-xs text-muted-foreground mt-1">расчет: пробег × 5 ₽</p>
                </CardContent>
            </Card>
        </div>
    );
};