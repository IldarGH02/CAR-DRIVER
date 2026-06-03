import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@shared/ui/dialog';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/ui/table';
import { Trash2 } from 'lucide-react';
import { User, Trip } from '../types';
import { TripAddDialog } from './TripAddDialog';

interface UserTripsDialogProps {
    user: User | null;
    trips: Trip[];
    isOpen: boolean;
    isLoading: boolean;
    dateFrom: string;
    dateTo: string;
    onClose: () => void;
    onDateFromChange: (value: string) => void;
    onDateToChange: (value: string) => void;
    onApplyFilter: () => void;
    onAddTrip: (userId: number, trip: any) => Promise<boolean>;
    onDeleteTrip: (userId: number, tripId: number) => Promise<boolean>;
}

export const UserTripsDialog = ({
                                    user,
                                    trips,
                                    isOpen,
                                    isLoading,
                                    dateFrom,
                                    dateTo,
                                    onClose,
                                    onDateFromChange,
                                    onDateToChange,
                                    onApplyFilter,
                                    onAddTrip,
                                    onDeleteTrip,
                                }: UserTripsDialogProps) => {
    const [isAddTripOpen, setIsAddTripOpen] = useState(false);

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Поездки пользователя: {user.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Дата от</Label>
                                <Input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Дата до</Label>
                                <Input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={onApplyFilter}>Применить фильтр</Button>
                            <TripAddDialog
                                userId={user.id}
                                isOpen={isAddTripOpen}
                                onOpenChange={setIsAddTripOpen}
                                onAddTrip={onAddTrip}
                            />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">Загрузка...</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Дата</TableHead>
                                        <TableHead>Маршрут</TableHead>
                                        <TableHead>Цель</TableHead>
                                        <TableHead>Пробег</TableHead>
                                        <TableHead>Топливо (л)</TableHead>
                                        <TableHead>Амортизация</TableHead>
                                        <TableHead>Строка расходов</TableHead>
                                        <TableHead>Действия</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trips.map((trip) => (
                                        <TableRow key={trip.id}>
                                            <TableCell>{new Date(trip.date).toLocaleDateString('ru-RU')}</TableCell>
                                            <TableCell>{trip.from} → {trip.to}</TableCell>
                                            <TableCell>{trip.purpose}</TableCell>
                                            <TableCell>{trip.distance} км</TableCell>
                                            <TableCell>{(trip.fuelAmount || 0).toFixed(1)} л</TableCell>
                                            <TableCell>{trip.amortization} ₽</TableCell>
                                            <TableCell>{trip.expenseLine || '—'}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDeleteTrip(user.id, trip.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};