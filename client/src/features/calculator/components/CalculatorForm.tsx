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
            <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Calculator className="w-5 h-5" />
                    Введите данные
                </CardTitle>
                <CardDescription className="text-sm">
                    Заполните поля для расчёта расходов на поездку
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                <div className="space-y-2">
                    <Label htmlFor="distance" className="text-sm sm:text-base">Пробег (км)</Label>
                    <Input
                        id="distance"
                        type="number"
                        placeholder="Например: 500"
                        value={distance}
                        onChange={(e) => onDistanceChange(e.target.value)}
                        className="w-full text-base sm:text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fuelConsumption" className="text-sm sm:text-base">Расход топлива (л/100км)</Label>
                    <Input
                        id="fuelConsumption"
                        type="number"
                        step="0.1"
                        placeholder="Например: 8.5"
                        value={fuelConsumption}
                        onChange={(e) => onFuelConsumptionChange(e.target.value)}
                        className="w-full text-base sm:text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="fuelPrice" className="text-sm sm:text-base">Цена за литр (₽)</Label>
                    <Input
                        id="fuelPrice"
                        type="number"
                        step="0.01"
                        placeholder="Например: 54.50"
                        value={fuelPrice}
                        onChange={(e) => onFuelPriceChange(e.target.value)}
                        className="w-full text-base sm:text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="amortizationRate" className="text-sm sm:text-base">Амортизация (₽/км)</Label>
                    <Input
                        id="amortizationRate"
                        type="number"
                        step="0.01"
                        placeholder="Например: 2.68"
                        value={amortizationRate}
                        onChange={(e) => onAmortizationRateChange(e.target.value)}
                        className="w-full text-base sm:text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                        Средняя стоимость эксплуатации автомобиля на 1 км
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button onClick={onCalculate} className="flex-1 text-sm sm:text-base py-2 sm:py-2.5">
                        Рассчитать
                    </Button>
                    <Button onClick={onReset} variant="outline" className="text-sm sm:text-base py-2 sm:py-2.5">
                        Очистить
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};