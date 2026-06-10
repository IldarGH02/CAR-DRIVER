import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@shared/ui/card";
import { Separator } from "@shared/ui/separator";
import { ReportStats } from "../utils/reportHelpers";
import { Fuel, DollarSign, TrendingUp } from "lucide-react";

interface StatsCardProps {
    stats: ReportStats | null;
    currency?: string;
}

export const StatsCard = ({ stats, currency = "RUB" }: StatsCardProps) => {
    const getCurrencySymbol = () => {
        switch (currency) {
            case 'USD': return '$';
            case 'EUR': return '€';
            default: return '₽';
        }
    };

    if (!stats) {
        return (
            <Card>
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Быстрая статистика</CardTitle>
                    <CardDescription className="text-sm">Данные за выбранный период</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
                        Нет данных для отображения
                    </div>
                </CardContent>
            </Card>
        );
    }

    const formatNumber = (num: number) => {
        return num.toLocaleString('ru-RU');
    };

    // Конвертируем строковые значения в числа
    const totalTrips = Number(stats.totalTrips) || 0;
    const totalDistance = Number(stats.totalDistance) || 0;
    const totalFuelAmount = Number(stats.totalFuelAmount) || 0;
    const totalExpenses = Number(stats.totalExpenses) || 0;
    const averageFuelConsumption = Number(stats.averageFuelConsumption) || 0;

    const averageCostPerTrip = totalTrips > 0 ? Math.round(totalExpenses / totalTrips) : 0;

    return (
        <Card>
            <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Быстрая статистика</CardTitle>
                <CardDescription className="text-sm">Данные за выбранный период</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-sm text-muted-foreground">Всего поездок</span>
                    <span className="font-semibold text-sm sm:text-base">{formatNumber(totalTrips)}</span>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-sm text-muted-foreground">Общий пробег</span>
                    <span className="font-semibold text-sm sm:text-base">{formatNumber(totalDistance)} км</span>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Fuel className="w-3 h-3 sm:w-4 sm:h-4" />
                        Всего топлива
                    </span>
                    <span className="font-semibold text-sm sm:text-base">{formatNumber(totalFuelAmount)} л</span>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-sm text-muted-foreground">Средний расход</span>
                    <span className="font-semibold text-sm sm:text-base">
                        {averageFuelConsumption.toFixed(1)} л/100км
                    </span>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                        Общие расходы
                    </span>
                    <span className="font-semibold text-sm sm:text-base">
                        {formatNumber(totalExpenses)} {getCurrencySymbol()}
                    </span>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        Средняя стоимость поездки
                    </span>
                    <span className="font-semibold text-sm sm:text-base">
                        {formatNumber(averageCostPerTrip)} {getCurrencySymbol()}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};