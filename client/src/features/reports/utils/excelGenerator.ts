import { Trip } from "@features/trips/model/tripsStore";
import { ReportStats } from "./reportHelpers";
import { User } from "@entities/user/model/userStore";

interface ExcelOptions {
    trips: Trip[];
    stats: ReportStats;
    user?: User | null;
    visibleColumns?: string[];
}

export const generateExcel = (options: ExcelOptions): void => {
    const { trips, stats, user, visibleColumns = ["date", "route", "purpose", "distance", "fuelAmount", "amortization"] } = options;

    // Определяем заголовки
    const getTableHeaders = () => {
        const headers: string[] = [];
        if (visibleColumns.includes("date")) headers.push("Дата");
        if (visibleColumns.includes("route")) headers.push("Маршрут");
        if (visibleColumns.includes("purpose")) headers.push("Цель");
        if (visibleColumns.includes("distance")) headers.push("Пробег (км)");
        if (visibleColumns.includes("fuelAmount")) headers.push("Топливо (л)");
        if (visibleColumns.includes("amortization")) headers.push("Амортизация (₽)");
        if (visibleColumns.includes("expenseLine")) headers.push("Строка расходов");
        return headers;
    };

    // Получаем данные строки
    const getRowData = (trip: Trip) => {
        const row: (string | number)[] = [];
        if (visibleColumns.includes("date")) row.push(new Date(trip.date).toLocaleDateString('ru-RU'));
        if (visibleColumns.includes("route")) row.push(`${trip.from} → ${trip.to} → ${trip.from}`);
        if (visibleColumns.includes("purpose")) row.push(trip.purpose);
        if (visibleColumns.includes("distance")) row.push(trip.distance);
        if (visibleColumns.includes("fuelAmount")) row.push((trip.fuelAmount || 0).toLocaleString());
        if (visibleColumns.includes("amortization")) row.push(trip.amortization.toLocaleString());
        if (visibleColumns.includes("expenseLine")) row.push((trip as any).expenseLine || "—");
        return row;
    };

    const headers = getTableHeaders();

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Отчет о поездках</title>
        <style>
          th { background-color: #2563eb; color: white; padding: 8px; }
          td { padding: 6px; border: 1px solid #ccc; }
          table { border-collapse: collapse; width: 100%; }
          .total { font-weight: bold; background-color: #f0f0f0; }
          h2 { color: #1e293b; }
          .info-block { margin: 20px 0; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <h2>Отчет о поездках</h2>
        <p><strong>Сгенерировано:</strong> ${new Date().toLocaleString('ru-RU')}</p>
        
        <div class="info-block">
          <h3>Информация о составителе</h3>
          <p><strong>ФИО:</strong> ${user?.name || 'Не указано'}</p>
          <p><strong>Автомобиль:</strong> ${user?.carModel || 'Не указан'}</p>
          <p><strong>Гос. номер:</strong> ${user?.licensePlate || 'Не указан'}</p>
        </div>
        
        <h3>Статистика</h3>
        <table>
          <thead><tr><th>Показатель</th><th>Значение</th></tr></thead>
          <tbody>
            <tr><td style="padding: 6px;">Всего поездок</td><td class="text-center"><strong>${stats.totalTrips}</strong></td></tr>
            ${visibleColumns.includes("distance") ? `<tr><td style="padding: 6px;">Общий пробег</td><td class="text-center"><strong>${stats.totalDistance.toLocaleString()} км</strong></td></tr>` : ''}
            ${visibleColumns.includes("fuelAmount") ? `<tr><td style="padding: 6px;">Всего топлива</td><td class="text-center"><strong>${stats.totalFuelAmount.toLocaleString()} л</strong></td></tr>` : ''}
            ${visibleColumns.includes("amortization") ? `<tr><td style="padding: 6px;">Общая амортизация</td><td class="text-center"><strong>${stats.totalAmortization.toLocaleString()} ₽</strong></td></tr>` : ''}
            <tr class="total"><td style="padding: 6px;">Всего расходов</td><td class="text-center"><strong>${stats.totalExpenses.toLocaleString()} ₽</strong></td></tr>
            <tr><td style="padding: 6px;">Средний расход топлива</td><td class="text-center"><strong>${stats.averageFuelConsumption} л/100км</strong></td></tr>
          </tbody>
        </table>
        
        <h3>Список поездок</h3>
        <table>
          <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${trips.map((trip, index) => `
              <tr>
                ${getRowData(trip).map(cell => `<td>${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="total">
              <td colspan="${headers.length - 1}"><strong>ИТОГО:</strong></td>
              <td><strong>${stats.totalExpenses.toLocaleString()} ₽</strong></td>
            </tr>
          </tfoot>
        </table>
        
        <div style="margin-top: 40px;">
          <p><strong>Подпись ответственного лица:</strong> _________________</p>
          <p><strong>Дата подписания:</strong> ${new Date().toLocaleDateString('ru-RU')}</p>
        </div>
      </body>
    </html>
  `;

    const blob = new Blob(["\uFEFF" + html], {
        type: "application/vnd.ms-excel;charset=utf-8"
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `report_${new Date().toISOString().split('T')[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};