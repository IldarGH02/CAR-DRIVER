import { Trip } from "@features/trips/model/tripsStore";
import { ReportStats } from "./reportHelpers";

export const generateCSV = (trips: Trip[], stats: ReportStats): void => {
    const csv: string[] = [];

    // Заголовок
    csv.push("ОТЧЕТ О ПОЕЗДКАХ");
    csv.push(`Сгенерировано: ${new Date().toLocaleString('ru-RU')}`);
    csv.push("");

    // Статистика
    csv.push("СТАТИСТИКА");
    csv.push(`Всего поездок,${stats.totalTrips}`);
    csv.push(`Общий пробег,${stats.totalDistance} км`);
    csv.push(`Расход топлива,${stats.totalFuelCost} ₽`);
    csv.push(`Амортизация,${stats.totalAmortization} ₽`);
    csv.push(`Всего расходов,${stats.totalExpenses} ₽`);
    csv.push(`Средний расход топлива,${stats.averageFuelConsumption} л/100км`);
    csv.push("");

    // Таблица поездок
    csv.push("СПИСОК ПОЕЗДОК");
    csv.push("Дата,Откуда,Куда,Цель,Пробег,Топливо,Амортизация,Итого");

    trips.forEach(trip => {
        csv.push([
            new Date(trip.date).toLocaleDateString('ru-RU'),
            trip.from,
            trip.to,
            trip.purpose,
            `${trip.distance} км`,
            `${trip.fuelCost} ₽`,
            `${trip.amortization} ₽`,
            `${trip.fuelCost + trip.amortization} ₽`
        ].join(","));
    });

    const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};