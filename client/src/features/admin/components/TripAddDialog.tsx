import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Car } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@shared/api/axiosInstance';

interface TripFormData {
    date: string;
    from: string;
    to: string;
    distance: string;
    fuelCost: string;
    expenseLine?: string;
    purpose: string;
}

const initialFormData: TripFormData = {
    date: new Date().toISOString().split('T')[0],
    from: "",
    to: "",
    distance: "",
    fuelCost: "",
    expenseLine: "",
    purpose: "",
};

interface TripAddDialogProps {
    userId: number;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAddTrip: (userId: number, trip: any) => Promise<boolean>;
}

export const TripAddDialog = ({ userId, isOpen, onOpenChange, onAddTrip }: TripAddDialogProps) => {
    const [formData, setFormData] = useState<TripFormData>(initialFormData);
    const [amortizationRate, setAmortizationRate] = useState<number>(2.68);

    // Загружаем настройки пользователя для получения амортизации
    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                const response = await api.get(`/settings`);
                if (response.data.success) {
                    const rate = response.data.settings?.amortization_rate;
                    if (rate) {
                        setAmortizationRate(rate);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch settings:', error);
                // Используем значение по умолчанию
            }
        };

        if (isOpen) {
            fetchUserSettings();
        }
    }, [isOpen]);

    const handleAddTrip = async () => {
        const distance = parseFloat(formData.distance);
        const fuelCost = parseFloat(formData.fuelCost);

        if (!distance || distance <= 0) {
            toast.error("Введите корректный пробег");
            return;
        }

        if (!fuelCost || fuelCost <= 0) {
            toast.error("Введите корректную стоимость топлива");
            return;
        }

        // Рассчитываем амортизацию на основе настроек пользователя
        const amortization = distance * amortizationRate;

        // Рассчитываем количество топлива (если цена за литр 50 ₽)
        const fuelAmount = fuelCost / 50;

        // Рассчитываем средний расход
        const avgConsumption = (fuelAmount / distance) * 100;

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
            status: "completed",
        };

        const success = await onAddTrip(userId, newTrip);

        if (success) {
            toast.success("Поездка добавлена!");
            onOpenChange(false);
            setFormData(initialFormData);
        } else {
            toast.error("Ошибка при добавлении поездки");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Car className="w-4 h-4" />
                    Добавить поездку
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Добавление поездки</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Дата и Цель */}
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">Дата</Label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full text-base sm:text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">Цель</Label>
                            <Input
                                value={formData.purpose}
                                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                className="w-full text-base sm:text-sm"
                                placeholder="Встреча с клиентом"
                            />
                        </div>
                    </div>

                    {/* Откуда и Куда */}
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">Откуда</Label>
                            <Input
                                value={formData.from}
                                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                                className="w-full text-base sm:text-sm"
                                placeholder="Москва"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">Куда</Label>
                            <Input
                                value={formData.to}
                                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                                className="w-full text-base sm:text-sm"
                                placeholder="Санкт-Петербург"
                            />
                        </div>
                    </div>

                    {/* Пробег и Стоимость топлива */}
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">Пробег (км)</Label>
                            <Input
                                type="number"
                                value={formData.distance}
                                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                                className="w-full text-base sm:text-sm"
                                placeholder="500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">Стоимость топлива (₽)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.fuelCost}
                                onChange={(e) => setFormData({ ...formData, fuelCost: e.target.value })}
                                className="w-full text-base sm:text-sm"
                                placeholder="2500"
                            />
                        </div>
                    </div>

                    {/* Строка расходов */}
                    <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Строка расходов</Label>
                        <Input
                            value={formData.expenseLine}
                            onChange={(e) => setFormData({ ...formData, expenseLine: e.target.value })}
                            className="w-full text-base sm:text-sm"
                            placeholder="Транспорт"
                        />
                    </div>

                    <div className="text-xs text-muted-foreground text-center">
                        Амортизация рассчитывается автоматически: {amortizationRate} ₽/км
                    </div>

                    <Button onClick={handleAddTrip} className="w-full text-sm sm:text-base py-2 sm:py-2.5">
                        Добавить поездку
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};