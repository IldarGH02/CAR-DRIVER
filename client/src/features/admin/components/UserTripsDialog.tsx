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
            <DialogContent className="w-[95vw] max-w-5xl max-h-[90vh] overflow-y-auto" aria-describedby="trips-dialog-description">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl">Поездки пользователя: {user.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col xs:flex-row gap-4 w-full sm:w-auto">
                            <div className="space-y-2 flex-1 xs:flex-none">
                                <Label className="text-sm">Дата от</Label>
                                <Input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => onDateFromChange(e.target.value)}
                                    className="w-full text-base sm:text-sm"
                                />
                            </div>
                            <div className="space-y-2 flex-1 xs:flex-none">
                                <Label className="text-sm">Дата до</Label>
                                <Input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => onDateToChange(e.target.value)}
                                    className="w-full text-base sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
                            <Button onClick={onApplyFilter} className="w-full xs:w-auto">
                                Применить фильтр
                            </Button>
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
                    ) : trips.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Нет поездок для отображения
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="whitespace-nowrap">Дата</TableHead>
                                        <TableHead className="whitespace-nowrap">Маршрут</TableHead>
                                        <TableHead className="whitespace-nowrap hidden sm:table-cell">Цель</TableHead>
                                        <TableHead className="whitespace-nowrap text-right">Пробег</TableHead>
                                        <TableHead className="whitespace-nowrap text-right hidden md:table-cell">Топливо (л)</TableHead>
                                        <TableHead className="whitespace-nowrap text-right hidden lg:table-cell">Амортизация</TableHead>
                                        <TableHead className="whitespace-nowrap hidden xl:table-cell">Строка расходов</TableHead>
                                        <TableHead className="whitespace-nowrap text-right">Действия</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {trips.map((trip) => (
                                        <TableRow key={trip.id}>
                                            <TableCell className="whitespace-nowrap">
                                                {new Date(trip.date).toLocaleDateString('ru-RU')}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">
                                                {trip.from} → {trip.to}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">{trip.purpose}</TableCell>
                                            <TableCell className="text-right whitespace-nowrap">{trip.distance} км</TableCell>
                                            <TableCell className="text-right whitespace-nowrap hidden md:table-cell">
                                                {(trip.fuelAmount || 0).toFixed(1)} л
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap hidden lg:table-cell">
                                                {trip.amortization} ₽
                                            </TableCell>
                                            <TableCell className="hidden xl:table-cell">{trip.expenseLine || '—'}</TableCell>
                                            <TableCell className="text-right whitespace-nowrap">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={() => onDeleteTrip(user.id, trip.id)}
                                                >
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