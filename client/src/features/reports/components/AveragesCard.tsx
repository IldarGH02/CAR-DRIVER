import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Separator } from "@shared/ui/separator";
import { ReportStats } from "../utils/reportHelpers";

interface AveragesCardProps {
    stats: ReportStats | null;
}

export const AveragesCard = ({ stats }: AveragesCardProps) => {
    if (!stats) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Средние показатели</CardTitle>
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
                <CardTitle>Средние показатели</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Средний пробег</span>
                        <span className="font-semibold">
              {stats.totalTrips > 0 ? Math.round((stats.totalDistance || 0) / stats.totalTrips) : 0} км
            </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Среднее топливо</span>
                        <span className="font-semibold">
              {stats.totalTrips > 0 ? (stats.totalFuelAmount / stats.totalTrips).toFixed(1) : 0} л
            </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};