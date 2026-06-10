import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@shared/ui/dialog';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Car } from 'lucide-react';
import { NewTrip } from '../types';

interface TripAddDialogProps {
    userId: number;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onAddTrip: (userId: number, trip: NewTrip) => Promise<boolean>;
}

const initialTrip: NewTrip = {
    date: new Date().toISOString().split('T')[0],
    from: '',
    to: '',
    distance: '',
    fuelAmount: '',
    amortization: '',
    purpose: '',
    expenseLine: ''
};

export const TripAddDialog = ({ userId, isOpen, onOpenChange, onAddTrip }: TripAddDialogProps) => {
    const [newTrip, setNewTrip] = useState(initialTrip);

    const handleSubmit = async () => {
        const success = await onAddTrip(userId, newTrip);
        if (success) {
            onOpenChange(false);
            setNewTrip(initialTrip);
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
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">Дата</Label>
                            <Input
                                type="date"
                                value={newTrip.date}
                                onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
                                className="w-full text-base sm:text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">Цель</Label>
                            <Input
                                value={newTrip.purpose}
                                onChange={(e) => setNewTrip({ ...newTrip, purpose: e.target.value })}
                                className="w-full text-base sm:text-sm"
                                placeholder="Встреча с клиентом"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">Откуда</Label>
                            <Input
                                value={newTrip.from}
                                onChange={(e) => setNewTrip({ ...newTrip, from: e.target.value })}
                                className="w-full text-base sm:text-sm"
                                placeholder="Москва"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">Куда</Label>
                            <Input
                                value={newTrip.to}
                                onChange={(e) => setNewTrip({ ...newTrip, to: e.target.value })}
                                className="w-full text-base sm:text-sm"
                                placeholder="Санкт-Петербург"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">Пробег (км)</Label>
                            <Input
                                type="number"
                                value={newTrip.distance}
                                onChange={(e) => setNewTrip({ ...newTrip, distance: e.target.value })}
                                className="w-full text-base sm:text-sm"
                                placeholder="500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">Топливо (л)</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={newTrip.fuelAmount}
                                onChange={(e) => setNewTrip({ ...newTrip, fuelAmount: e.target.value })}
                                className="w-full text-base sm:text-sm"
                                placeholder="45"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm sm:text-base">Амортизация (₽)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                value={newTrip.amortization}
                                onChange={(e) => setNewTrip({ ...newTrip, amortization: e.target.value })}
                                className="w-full text-base sm:text-sm"
                                placeholder="188"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm sm:text-base">Строка расходов</Label>
                        <Input
                            value={newTrip.expenseLine}
                            onChange={(e) => setNewTrip({ ...newTrip, expenseLine: e.target.value })}
                            className="w-full text-base sm:text-sm"
                            placeholder="Транспорт"
                        />
                    </div>

                    <Button onClick={handleSubmit} className="w-full text-sm sm:text-base py-2 sm:py-2.5">
                        Добавить
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};