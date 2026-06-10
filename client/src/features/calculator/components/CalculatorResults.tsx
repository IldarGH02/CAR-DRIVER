import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@shared/ui/card";
import { Fuel, TrendingUp, DollarSign } from "lucide-react";

interface CalculatorResultsProps {
    fuelAmount: number;
    fuelCost: number;
    amortization: number;
    total: number;
    distance: string;
    fuelConsumption: string;
}

export const CalculatorResults = ({
                                      fuelAmount,
                                      fuelCost,
                                      amortization,
                                      total,
                                      distance,
                                      fuelConsumption,
                                  }: CalculatorResultsProps) => {
    const costPerKm = total / parseFloat(distance);

    return (
        <div className="space-y-4 sm:space-y-6">
            <Card>
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Результаты расчёта</CardTitle>
                    <CardDescription className="text-sm">
                        Детальная информация о расходах на поездку
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                    {/* Необходимо топлива */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200 gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Fuel className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-muted-foreground">Необходимо топлива</p>
                                <p className="text-lg sm:text-2xl font-bold text-blue-600">
                                    {fuelAmount.toFixed(2)} л
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Стоимость топлива */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200 gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-muted-foreground">Стоимость топлива</p>
                                <p className="text-lg sm:text-2xl font-bold text-blue-600">
                                    {fuelCost.toFixed(2)} ₽
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Амортизация */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200 gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-muted-foreground">Амортизация</p>
                                <p className="text-lg sm:text-2xl font-bold text-slate-600">
                                    {amortization.toFixed(2)} ₽
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Общая стоимость */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/20 gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-muted-foreground">Общая стоимость</p>
                                <p className="text-lg sm:text-2xl font-bold text-primary">
                                    {total.toFixed(2)} ₽
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg sm:text-xl">Дополнительная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="text-sm text-muted-foreground">Расход топлива</span>
                        <span className="font-medium text-sm sm:text-base">
                            {fuelConsumption} л/100км
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="text-sm text-muted-foreground">Стоимость за километр</span>
                        <span className="font-medium text-sm sm:text-base">
                            {costPerKm.toFixed(2)} ₽/км
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="text-sm text-muted-foreground">Пробег</span>
                        <span className="font-medium text-sm sm:text-base">{distance} км</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};