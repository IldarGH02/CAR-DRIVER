import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@shared/ui/card";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Gauge } from "lucide-react";

interface CalculationsCardProps {
    amortizationRate: string;
    currency: string;
    distanceUnit: string;
    onAmortizationRateChange: (value: string) => void;
}

export const CalculationsCard = ({
                                     amortizationRate,
                                     currency,
                                     distanceUnit,
                                     onAmortizationRateChange,
                                 }: CalculationsCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Gauge className="w-5 h-5" />
                    Параметры расчётов
                </CardTitle>
                <CardDescription>
                    Настройки для автоматических расчётов расходов
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="amortizationRate">
                        Стандартная амортизация ({currency === "RUB" ? "₽" : "$"}/
                        {distanceUnit === "km" ? "км" : "mi"})
                    </Label>
                    <Input
                        id="amortizationRate"
                        type="number"
                        step="0.01"
                        value={amortizationRate}
                        onChange={(e) => onAmortizationRateChange(e.target.value)}
                        className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                        Средняя стоимость эксплуатации автомобиля на единицу расстояния.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};