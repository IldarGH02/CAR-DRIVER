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
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Результаты расчёта</CardTitle>
                    <CardDescription>
                        Детальная информация о расходах на поездку
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Fuel className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Необходимо топлива</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {fuelAmount.toFixed(2)} л
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Стоимость топлива</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {fuelCost.toFixed(2)} ₽
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-600 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Амортизация</p>
                                <p className="text-2xl font-bold text-slate-600">
                                    {amortization.toFixed(2)} ₽
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Общая стоимость</p>
                                <p className="text-2xl font-bold text-primary">
                                    {total.toFixed(2)} ₽
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Дополнительная информация</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Расход топлива</span>
                            <span className="font-medium">
                {fuelConsumption} л/100км
              </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Стоимость за километр</span>
                            <span className="font-medium">
                {(total / parseFloat(distance)).toFixed(2)} ₽/км
              </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Пробег</span>
                            <span className="font-medium">{distance} км</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};