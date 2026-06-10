import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Save, Trash2 } from "lucide-react";
import { useThemeStore } from "@entities/theme/model/themeStore";

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

    return (
        <Card className="sticky top-6">
            <CardHeader>
                <CardTitle>Действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Button onClick={onSave} className="w-full gap-2" disabled={isLoading}>
                    <Save className="w-4 h-4" />
                    {isLoading ? "Сохранение..." : "Сохранить настройки"}
                </Button>

                <Button onClick={onReset} variant="outline" className="w-full gap-2">
                    <Trash2 className="w-4 h-4" />
                    Сбросить настройки
                </Button>

                <div className="space-y-2">
                    <p className="text-sm font-medium">Текущие настройки:</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                        <p>Валюта: {currency}</p>
                        <p>Расстояние: {distanceUnit === "km" ? "Километры" : "Мили"}</p>
                        <p>Топливо: {fuelUnit === "liters" ? "Литры" : "Галлоны"}</p>
                        <p>Амортизация: {amortizationRate} ₽/км</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};