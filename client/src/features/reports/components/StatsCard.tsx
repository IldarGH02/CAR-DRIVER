import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@shared/ui/card";
import { Separator } from "@shared/ui/separator";
import { ReportStats } from "../utils/reportHelpers";
import { Fuel } from "lucide-react";

interface StatsCardProps {
    stats: ReportStats | null;
}

export const StatsCard = ({ stats }: StatsCardProps) => {
    if (!stats) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Быстрая статистика</CardTitle>
                    <CardDescription>Данные за выбранный период</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4 text-muted-foreground">
                        Нет данных для отображения
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Быстрая статистика</CardTitle>
                <CardDescription>Данные за выбранный период</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Всего поездок</span>
                        <span className="font-semibold">{stats.totalTrips || 0}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Общий пробег</span>
                        <span className="font-semibold">{(stats.totalDistance || 0).toLocaleString()} км</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Fuel className="w-3 h-3" />
              Всего топлива
            </span>
                        <span className="font-semibold">{(stats.totalFuelAmount || 0).toLocaleString()} л</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Средний расход</span>
                        <span className="font-semibold">{stats.averageFuelConsumption || 0} л/100км</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};