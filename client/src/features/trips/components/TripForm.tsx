import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@shared/ui/dialog";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { calculateAmortization, calculateFuelAmount, calculateFuelCost } from "../utils/tripHelpers";

interface TripFormData {
    date: string;
    from: string;
    to: string;
    distance: string;
    avgConsumption: string;
    fuelPrice: string;
    expenseLine?: string;
    purpose: string;
}

const initialFormData: TripFormData = {
    date: new Date().toISOString().split('T')[0],
    from: "",
    to: "",
    distance: "",
    avgConsumption: "",
    fuelPrice: "",
    expenseLine: "",
    purpose: "",
};

interface TripFormProps {
    onAddTrip: (trip: any) => Promise<boolean>;
}

export const TripForm = ({ onAddTrip }: TripFormProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState<TripFormData>(initialFormData);

    const handleAddTrip = async () => {
        const distance = parseFloat(formData.distance);
        const avgConsumption = parseFloat(formData.avgConsumption) || 0;
        const fuelPrice = parseFloat(formData.fuelPrice) || 0;

        // Амортизация: пробег * 5
        const amortization = calculateAmortization(distance, 5);

        // Расчет количества топлива из среднего расхода
        const fuelAmount = calculateFuelAmount(avgConsumption, distance);

        // Расчет стоимости топлива (для внутреннего учета)
        const fuelCost = calculateFuelCost(fuelAmount, fuelPrice);

        const newTrip = {
            date: formData.date,
            from: formData.from,
            to: formData.to,
            distance: distance,
            fuelAmount: fuelAmount,
            fuelCost: fuelCost,
            amortization: amortization,
            purpose: formData.purpose,
            expenseLine: formData.expenseLine || "",
            avgConsumption: avgConsumption,
            status: "completed" as const,
        };

        const success = await onAddTrip(newTrip);

        if (success) {
            toast.success(`Поездка добавлена! Требуется топлива: ${fuelAmount.toFixed(2)} л (${fuelCost.toFixed(2)} ₽)`);
            setIsDialogOpen(false);
            setFormData(initialFormData);
        } else {
            toast.error("Ошибка при добавлении поездки");
        }
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Добавить поездку
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Новая поездка</DialogTitle>
                    <DialogDescription>
                        Добавьте информацию о командировке
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Дата</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="purpose">Цель поездки</Label>
                            <Input
                                id="purpose"
                                placeholder="Например: Встреча с клиентом"
                                value={formData.purpose}
                                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="from">Откуда</Label>
                            <Input
                                id="from"
                                placeholder="Город отправления"
                                value={formData.from}
                                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="to">Куда</Label>
                            <Input
                                id="to"
                                placeholder="Город назначения"
                                value={formData.to}
                                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="distance">Пробег (км)</Label>
                            <Input
                                id="distance"
                                type="number"
                                placeholder="500"
                                value={formData.distance}
                                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="avgConsumption">Ср.расход (л/100 км)</Label>
                            <Input
                                id="avgConsumption"
                                type="number"
                                step="0.1"
                                placeholder="11"
                                value={formData.avgConsumption}
                                onChange={(e) => setFormData({ ...formData, avgConsumption: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fuelPrice">Цена топлива (₽/л)</Label>
                            <Input
                                id="fuelPrice"
                                type="number"
                                step="0.01"
                                placeholder="54.50"
                                value={formData.fuelPrice}
                                onChange={(e) => setFormData({ ...formData, fuelPrice: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expenseLine">Строка расходов (опционально)</Label>
                        <Input
                            id="expenseLine"
                            placeholder="Укажите тип расходов"
                            value={formData.expenseLine}
                            onChange={(e) => setFormData({ ...formData, expenseLine: e.target.value })}
                        />
                    </div>

                    <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        * Амортизация: {formData.distance || 0} км × 5 ₽ = {(parseFloat(formData.distance) * 5 || 0).toFixed(2)} ₽
                        <br />
                        * Топливо: {((parseFloat(formData.avgConsumption) * parseFloat(formData.distance)) / 100 || 0).toFixed(2)} л × {(parseFloat(formData.fuelPrice) || 0).toFixed(2)} ₽ = {(((parseFloat(formData.avgConsumption) * parseFloat(formData.distance)) / 100) * parseFloat(formData.fuelPrice) || 0).toFixed(2)} ₽
                    </div>
                </div>
                <Button onClick={handleAddTrip} className="w-full">
                    Добавить поездку
                </Button>
            </DialogContent>
        </Dialog>
    );
};