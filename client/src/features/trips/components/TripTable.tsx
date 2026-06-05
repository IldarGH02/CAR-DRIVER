import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shared/ui/table";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";
import { MapPin, Calendar, Trash2, Fuel, Clock, CheckCircle } from "lucide-react";
import { Trip } from "../model/tripsStore";
import { formatDate, formatCurrency, formatDistance, roundToTwo } from "@shared/utils/formatters";

interface TripTableProps {
    trips: Trip[];
    isLoading: boolean;
    onDeleteTrip: (id: number) => Promise<void>;
    isMobile?: boolean;
}

const getStatusBadge = (status: string, date: string) => {
    // Определяем статус по дате, если он не установлен или устарел
    const tripDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentStatus = status;
    if (tripDate <= today && status !== "cancelled") {
        currentStatus = "completed";
    } else if (tripDate > today && status !== "cancelled") {
        currentStatus = "planned";
    }

    const variants: Record<string, { label: string; className: string; icon: any }> = {
        completed: {
            label: "Завершена",
            className: "bg-green-100 text-green-800",
            icon: CheckCircle
        },
        planned: {
            label: "Запланирована",
            className: "bg-blue-100 text-blue-800",
            icon: Clock
        },
        cancelled: {
            label: "Отменена",
            className: "bg-red-100 text-red-800",
            icon: CheckCircle
        },
    };

    const variant = variants[currentStatus] || variants.planned;
    const Icon = variant.icon;

    return (
        <Badge className={`${variant.className} flex items-center gap-1 w-fit`}>
            <Icon className="w-3 h-3" />
            {variant.label}
        </Badge>
    );
};

export const TripTable = ({ trips, isLoading, onDeleteTrip, isMobile }: TripTableProps) => {
    if (isLoading) {
        return <div className="text-center py-8">Загрузка...</div>;
    }

    if (trips.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                Нет добавленных поездок. Нажмите "Добавить поездку" чтобы создать первую запись.
            </div>
        );
    }

    const totalFuelAmount = trips.reduce((sum, trip) => sum + (trip.fuelAmount || 0), 0);

    // Мобильная версия - карточки
    if (isMobile) {
        return (
            <div className="space-y-4 p-4">
                {trips.map((trip) => (
                    <div key={trip.id} className="border rounded-lg p-4 space-y-3 bg-white">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{formatDate(trip.date)}</span>
                            </div>
                            {getStatusBadge(trip.status, trip.date)}
                        </div>

                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span className="text-sm">{trip.from} → {trip.to}</span>
                        </div>

                        <div className="text-sm text-muted-foreground">{trip.purpose}</div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Пробег:</span>
                                <span className="ml-2 font-medium">{formatDistance(trip.distance)}</span>
                            </div>
                            <div>
                <span className="text-muted-foreground flex items-center gap-1">
                  <Fuel className="w-3 h-3" /> Топливо:
                </span>
                                <span className="ml-2 font-medium">{roundToTwo(trip.fuelAmount || 0)} л</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Амортизация:</span>
                                <span className="ml-2 font-medium">{formatCurrency(trip.amortization)}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Строка:</span>
                                <span className="ml-2 font-medium text-xs">{(trip as any).expenseLine || "—"}</span>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive"
                                onClick={async () => await onDeleteTrip(trip.id)}
                            >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Удалить
                            </Button>
                        </div>
                    </div>
                ))}

                <div className="border-t pt-4 mt-4">
                    <div className="grid grid-cols-2 gap-2 font-bold">
                        <div>ИТОГО:</div>
                        <div>{formatDistance(trips.reduce((sum, t) => sum + t.distance, 0))}</div>
                        <div>Всего топлива:</div>
                        <div>{roundToTwo(totalFuelAmount)} л</div>
                        <div>Всего амортизация:</div>
                        <div>{formatCurrency(trips.reduce((sum, t) => sum + t.amortization, 0))}</div>
                    </div>
                </div>
            </div>
        );
    }

    // Десктопная версия - таблица
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Дата</TableHead>
                        <TableHead>Маршрут</TableHead>
                        <TableHead>Цель</TableHead>
                        <TableHead className="text-right">Пробег (км)</TableHead>
                        <TableHead className="text-right">Топливо (л)</TableHead>
                        <TableHead className="text-right">Амортизация (₽)</TableHead>
                        <TableHead>Строка расходов</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {trips.map((trip) => (
                        <TableRow key={trip.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    {formatDate(trip.date)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    <span>{trip.from} → {trip.to}</span>
                                </div>
                            </TableCell>
                            <TableCell>{trip.purpose}</TableCell>
                            <TableCell className="text-right">{formatDistance(trip.distance)}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <Fuel className="w-3 h-3 text-muted-foreground" />
                                    <span>{roundToTwo(trip.fuelAmount || 0)} л</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(trip.amortization)}</TableCell>
                            <TableCell>{(trip as any).expenseLine || "—"}</TableCell>
                            <TableCell>{getStatusBadge(trip.status, trip.date)}</TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive"
                                    onClick={async () => await onDeleteTrip(trip.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <tfoot>
                <TableRow className="bg-muted/50 font-medium">
                    <TableCell colSpan={3} className="text-right font-bold">
                        ИТОГО:
                    </TableCell>
                    <TableCell className="text-right font-bold">
                        {formatDistance(trips.reduce((sum, t) => sum + t.distance, 0))}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                        <div className="flex items-center justify-end gap-1">
                            <Fuel className="w-3 h-3" />
                            {roundToTwo(totalFuelAmount)} л
                        </div>
                    </TableCell>
                    <TableCell className="text-right font-bold">
                        {formatCurrency(trips.reduce((sum, t) => sum + t.amortization, 0))}
                    </TableCell>
                    <TableCell colSpan={3}></TableCell>
                </TableRow>
                </tfoot>
            </Table>
        </div>
    );
};