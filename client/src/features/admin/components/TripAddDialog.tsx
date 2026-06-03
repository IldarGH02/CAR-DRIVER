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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Добавление поездки</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Дата</Label>
                            <Input type="date" value={newTrip.date} onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Цель</Label>
                            <Input value={newTrip.purpose} onChange={(e) => setNewTrip({ ...newTrip, purpose: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Откуда</Label>
                            <Input value={newTrip.from} onChange={(e) => setNewTrip({ ...newTrip, from: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Куда</Label>
                            <Input value={newTrip.to} onChange={(e) => setNewTrip({ ...newTrip, to: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Пробег (км)</Label>
                            <Input type="number" value={newTrip.distance} onChange={(e) => setNewTrip({ ...newTrip, distance: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Топливо (л)</Label>
                            <Input type="number" value={newTrip.fuelAmount} onChange={(e) => setNewTrip({ ...newTrip, fuelAmount: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Амортизация (₽)</Label>
                            <Input type="number" value={newTrip.amortization} onChange={(e) => setNewTrip({ ...newTrip, amortization: e.target.value })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Строка расходов</Label>
                        <Input value={newTrip.expenseLine} onChange={(e) => setNewTrip({ ...newTrip, expenseLine: e.target.value })} />
                    </div>
                    <Button onClick={handleSubmit} className="w-full">Добавить</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};