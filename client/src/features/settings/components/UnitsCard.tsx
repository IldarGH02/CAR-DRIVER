import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@shared/ui/card";
import { Label } from "@shared/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@shared/ui/select";
import { DollarSign } from "lucide-react";

interface UnitsCardProps {
    currency: string;
    distanceUnit: string;
    fuelUnit: string;
    onCurrencyChange: (value: string) => void;
    onDistanceUnitChange: (value: string) => void;
    onFuelUnitChange: (value: string) => void;
}

export const UnitsCard = ({
                              currency,
                              distanceUnit,
                              fuelUnit,
                              onCurrencyChange,
                              onDistanceUnitChange,
                              onFuelUnitChange,
                          }: UnitsCardProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Валюта и единицы измерения
                </CardTitle>
                <CardDescription>
                    Настройте отображение денежных сумм и расстояний
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* На мобильных колонка, на планшетах и выше - 3 колонки */}
                <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="currency">Валюта</Label>
                        <Select value={currency} onValueChange={onCurrencyChange}>
                            <SelectTrigger id="currency" className="w-full">
                                <SelectValue placeholder="Выберите валюту" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="RUB">Рубль (₽)</SelectItem>
                                <SelectItem value="USD">Доллар ($)</SelectItem>
                                <SelectItem value="EUR">Евро (€)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="distanceUnit">Расстояние</Label>
                        <Select value={distanceUnit} onValueChange={onDistanceUnitChange}>
                            <SelectTrigger id="distanceUnit" className="w-full">
                                <SelectValue placeholder="Выберите единицу" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="km">Километры (км)</SelectItem>
                                <SelectItem value="miles">Мили (mi)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fuelUnit">Топливо</Label>
                        <Select value={fuelUnit} onValueChange={onFuelUnitChange}>
                            <SelectTrigger id="fuelUnit" className="w-full">
                                <SelectValue placeholder="Выберите единицу" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="liters">Литры (л)</SelectItem>
                                <SelectItem value="gallons">Галлоны (gal)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};