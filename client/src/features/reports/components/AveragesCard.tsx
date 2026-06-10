import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Separator } from "@shared/ui/separator";
import { ReportStats } from "../utils/reportHelpers";

interface AveragesCardProps {
    stats: ReportStats | null;
    currency?: string;
}

export const AveragesCard = ({ stats, currency = "RUB" }: AveragesCardProps) => {
    if (!stats) {
        return (
            <Card>
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Средние показатели</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                    <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
                        Нет данных для отображения
                    </div>
                </CardContent>
            </Card>
        );
    }

    const getCurrencySymbol = () => {
        switch (currency) {
            case 'USD': return '$';
            case 'EUR': return '€';
            default: return '₽';
        }
    };

    const averageDistance = stats.totalTrips > 0 ? Math.round((stats.totalDistance || 0) / stats.totalTrips) : 0;
    const averageCost = stats.totalTrips > 0 ? (stats.totalExpenses / stats.totalTrips).toFixed(0) : 0;
    const avgFuelConsumption = stats.totalTrips > 0 && stats.averageFuelConsumption
        ? Number(stats.averageFuelConsumption).toFixed(1)
        : 0;

    return (
        <Card>
            <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Средние показатели</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-sm text-muted-foreground">Средний пробег</span>
                    <span className="font-semibold text-sm sm:text-base">
                        {averageDistance} км
                    </span>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-sm text-muted-foreground">Средний расход топлива</span>
                    <span className="font-semibold text-sm sm:text-base">
                        {avgFuelConsumption} л/100км
                    </span>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-sm text-muted-foreground">Средняя стоимость поездки</span>
                    <span className="font-semibold text-sm sm:text-base">
                        {averageCost} {getCurrencySymbol()}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};