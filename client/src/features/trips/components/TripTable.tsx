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
            className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            icon: CheckCircle
        },
        planned: {
            label: "Запланирована",
            className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
            icon: Clock
        },
        cancelled: {
            label: "Отменена",
            className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
            icon: CheckCircle
        },
    };

    const variant = variants[currentStatus] || variants.planned;
    const Icon = variant.icon;

    return (
        <Badge className={`${variant.className} flex items-center gap-1 w-fit`}>
            <Icon className="w-3 h-3" />
            <span className="text-xs sm:text-sm">{variant.label}</span>
        </Badge>
    );
};

export const TripTable = ({ trips, isLoading, onDeleteTrip, isMobile }: TripTableProps) => {
    if (isLoading) {
        return <div className="text-center py-8">Загрузка...</div>;
    }

    if (trips.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
                Нет добавленных поездок. Нажмите "Добавить поездку" чтобы создать первую запись.
            </div>
        );
    }

    const totalFuelAmount = trips.reduce((sum, trip) => sum + (trip.fuelAmount || 0), 0);
    const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);
    const totalAmortization = trips.reduce((sum, t) => sum + t.amortization, 0);

    if (isMobile) {
        return (
            <div className="space-y-3 sm:space-y-4 p-3 sm:p-4">
                {trips.map((trip) => (
                    <div key={trip.id} className="border rounded-lg p-3 sm:p-4 space-y-3 bg-white dark:bg-gray-800">
                        <div className="flex justify-between items-start gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <span className="font-medium text-sm sm:text-base">{formatDate(trip.date)}</span>
                            </div>
                            {getStatusBadge(trip.status, trip.date)}
                        </div>

                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm sm:text-base break-words">{trip.from} → {trip.to}</span>
                        </div>

                        <div className="text-sm sm:text-base text-muted-foreground break-words">{trip.purpose}</div>

                        <div className="grid grid-cols-2 gap-2 text-sm sm:text-base">
                            <div className="break-words">
                                <span className="text-muted-foreground">Пробег:</span>
                                <span className="ml-2 font-medium">{formatDistance(trip.distance)}</span>
                            </div>
                            <div className="break-words">
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <Fuel className="w-3 h-3 flex-shrink-0" /> Топливо:
                                </span>
                                <span className="ml-2 font-medium">{roundToTwo(trip.fuelAmount || 0)} л</span>
                            </div>
                            <div className="break-words">
                                <span className="text-muted-foreground">Амортизация:</span>
                                <span className="ml-2 font-medium">{formatCurrency(trip.amortization)}</span>
                            </div>
                            <div className="break-words">
                                <span className="text-muted-foreground">Строка:</span>
                                <span className="ml-2 font-medium text-xs sm:text-sm">{(trip as any).expenseLine || "—"}</span>
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
                                <span className="text-sm">Удалить</span>
                            </Button>
                        </div>
                    </div>
                ))}

                <div className="border-t pt-4 mt-4">
                    <div className="grid grid-cols-2 gap-2 font-bold text-sm sm:text-base">
                        <div>ИТОГО:</div>
                        <div className="text-right">{formatDistance(totalDistance)}</div>
                        <div>Всего топлива:</div>
                        <div className="text-right">{roundToTwo(totalFuelAmount)} л</div>
                        <div>Всего амортизация:</div>
                        <div className="text-right">{formatCurrency(totalAmortization)}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="whitespace-nowrap">Дата</TableHead>
                        <TableHead className="whitespace-nowrap">Маршрут</TableHead>
                        <TableHead className="whitespace-nowrap">Цель</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Пробег (км)</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Топливо (л)</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Амортизация (₽)</TableHead>
                        <TableHead className="whitespace-nowrap">Строка расходов</TableHead>
                        <TableHead className="whitespace-nowrap">Статус</TableHead>
                        <TableHead className="text-right whitespace-nowrap">Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {trips.map((trip) => (
                        <TableRow key={trip.id}>
                            <TableCell className="whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    {formatDate(trip.date)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 min-w-[150px]">
                                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                                    <span className="break-words">{trip.from} → {trip.to}</span>
                                </div>
                            </TableCell>
                            <TableCell className="break-words min-w-[120px]">{trip.purpose}</TableCell>
                            <TableCell className="text-right whitespace-nowrap">{formatDistance(trip.distance)}</TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1">
                                    <Fuel className="w-3 h-3 text-muted-foreground" />
                                    <span>{roundToTwo(trip.fuelAmount || 0)} л</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">{formatCurrency(trip.amortization)}</TableCell>
                            <TableCell className="whitespace-nowrap">{(trip as any).expenseLine || "—"}</TableCell>
                            <TableCell className="whitespace-nowrap">{getStatusBadge(trip.status, trip.date)}</TableCell>
                            <TableCell className="text-right whitespace-nowrap">
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
                    <TableCell className="text-right font-bold whitespace-nowrap">
                        {formatDistance(totalDistance)}
                    </TableCell>
                    <TableCell className="text-right font-bold whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                            <Fuel className="w-3 h-3" />
                            {roundToTwo(totalFuelAmount)} л
                        </div>
                    </TableCell>
                    <TableCell className="text-right font-bold whitespace-nowrap">
                        {formatCurrency(totalAmortization)}
                    </TableCell>
                    <TableCell colSpan={3}></TableCell>
                </TableRow>
                </tfoot>
            </Table>
        </div>
    );
};