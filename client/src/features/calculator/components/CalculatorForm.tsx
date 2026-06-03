import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@shared/ui/card";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Button } from "@shared/ui/button";
import { Calculator } from "lucide-react";

interface CalculatorFormProps {
    distance: string;
    fuelConsumption: string;
    fuelPrice: string;
    amortizationRate: string;
    onDistanceChange: (value: string) => void;
    onFuelConsumptionChange: (value: string) => void;
    onFuelPriceChange: (value: string) => void;
    onAmortizationRateChange: (value: string) => void;
    onCalculate: () => void;
    onReset: () => void;
}

export const CalculatorForm = ({
                                   distance,
                                   fuelConsumption,
                                   fuelPrice,
                                   amortizationRate,
                                   onDistanceChange,
                                   onFuelConsumptionChange,
                                   onFuelPriceChange,
                                   onAmortizationRateChange,
                                   onCalculate,
                                   onReset,
                               }: CalculatorFormProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Введите данные
                </CardTitle>
                <CardDescription>
                    Заполните поля для расчёта расходов на поездку
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="distance">Пробег (км)</Label>
                    <Input
                        id="distance"
                        type="number"
                        placeholder="Например: 500"
                        value={distance}
                        onChange={(e) => onDistanceChange(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fuelConsumption">Расход топлива (л/100км)</Label>
                    <Input
                        id="fuelConsumption"
                        type="number"
                        step="0.1"
                        placeholder="Например: 8.5"
                        value={fuelConsumption}
                        onChange={(e) => onFuelConsumptionChange(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fuelPrice">Цена за литр (₽)</Label>
                    <Input
                        id="fuelPrice"
                        type="number"
                        step="0.01"
                        placeholder="Например: 54.50"
                        value={fuelPrice}
                        onChange={(e) => onFuelPriceChange(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="amortizationRate">Амортизация (₽/км)</Label>
                    <Input
                        id="amortizationRate"
                        type="number"
                        step="0.01"
                        placeholder="Например: 2.68"
                        value={amortizationRate}
                        onChange={(e) => onAmortizationRateChange(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                        Средняя стоимость эксплуатации автомобиля на 1 км
                    </p>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button onClick={onCalculate} className="flex-1">
                        Рассчитать
                    </Button>
                    <Button onClick={onReset} variant="outline">
                        Очистить
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};