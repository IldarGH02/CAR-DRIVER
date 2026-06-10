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
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
            <Card>
                <CardHeader className="pb-2 p-3 sm:p-4">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center justify-between">
                        <span>Всего поездок</span>
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                    <div className="text-xl sm:text-2xl font-bold">{totalTrips}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2 p-3 sm:p-4">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center justify-between">
                        <span>Общий пробег</span>
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                    <div className="text-xl sm:text-2xl font-bold">{formatDistance(totalDistance)}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2 p-3 sm:p-4">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center justify-between">
                        <span>Всего топлива</span>
                        <Fuel className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                    <div className="text-xl sm:text-2xl font-bold">{roundToTwo(totalFuelAmount)} л</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2 p-3 sm:p-4">
                    <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center justify-between">
                        <span>Общая амортизация</span>
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                    <div className="text-xl sm:text-2xl font-bold">{formatCurrency(totalAmortization)}</div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">расчет: пробег × 5 ₽</p>
                </CardContent>
            </Card>
        </div>
    );
};