import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Save, Trash2 } from "lucide-react";

interface ActionsCardProps {
    isLoading: boolean;
    currency: string;
    distanceUnit: string;
    fuelUnit: string;
    amortizationRate: string;
    onSave: () => void;
    onReset: () => void;
}

export const ActionsCard = ({
                                isLoading,
                                currency,
                                distanceUnit,
                                fuelUnit,
                                amortizationRate,
                                onSave,
                                onReset,
                            }: ActionsCardProps) => {
    // Функция для форматирования валюты
    const getCurrencySymbol = () => {
        switch (currency) {
            case 'USD': return '$';
            case 'EUR': return '€';
            default: return '₽';
        }
    };

    return (
        <Card className="sticky top-4 md:top-6">
            <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
                <Button
                    onClick={onSave}
                    className="w-full gap-2 text-sm sm:text-base py-2 sm:py-2.5"
                    disabled={isLoading}
                >
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    {isLoading ? "Сохранение..." : "Сохранить настройки"}
                </Button>

                <Button
                    onClick={onReset}
                    variant="outline"
                    className="w-full gap-2 text-sm sm:text-base py-2 sm:py-2.5"
                >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    Сбросить настройки
                </Button>

                <div className="space-y-2 pt-2">
                    <p className="text-sm font-medium">Текущие настройки:</p>
                    <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                        <p>Валюта: <span className="font-medium text-foreground">{currency}</span></p>
                        <p>Расстояние: <span className="font-medium text-foreground">{distanceUnit === "km" ? "Километры" : "Мили"}</span></p>
                        <p>Топливо: <span className="font-medium text-foreground">{fuelUnit === "liters" ? "Литры" : "Галлоны"}</span></p>
                        <p>Амортизация: <span className="font-medium text-foreground">{amortizationRate} {getCurrencySymbol()}/{distanceUnit === "km" ? "км" : "mi"}</span></p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};