import { Trip } from "@features/trips/model/tripsStore";
import { ReportStats, formatPeriodText, ReportPeriod } from "./reportHelpers";
import { User } from "@entities/user/model/userStore";
import html2pdf from 'html2pdf.js';

interface PDFOptions {
    trips: Trip[];
    stats: ReportStats;
    period: ReportPeriod;
    settings?: {
        amortization_rate?: number;
    } | null;
    user?: User | null;
    visibleColumns?: string[];
}

export const generatePDF = async (options: PDFOptions): Promise<void> => {
    const { trips, stats, period, user, visibleColumns = ["date", "route", "purpose", "distance", "fuelAmount", "amortization"] } = options;

    // Определяем заголовки таблицы в зависимости от выбранных колонок
    const getTableHeaders = () => {
        const headers: { id: string; label: string; width: string }[] = [];
        if (visibleColumns.includes("date")) headers.push({ id: "date", label: "Дата", width: "10%" });
        if (visibleColumns.includes("route")) headers.push({ id: "route", label: "Маршрут", width: "20%" });
        if (visibleColumns.includes("purpose")) headers.push({ id: "purpose", label: "Цель", width: "15%" });
        if (visibleColumns.includes("distance")) headers.push({ id: "distance", label: "Пробег (км)", width: "10%" });
        if (visibleColumns.includes("fuelAmount")) headers.push({ id: "fuelAmount", label: "Топливо (л)", width: "10%" });
        if (visibleColumns.includes("amortization")) headers.push({ id: "amortization", label: "Амортизация (₽)", width: "15%" });
        if (visibleColumns.includes("expenseLine")) headers.push({ id: "expenseLine", label: "Строка расходов", width: "20%" });
        return headers;
    };

    // Получаем данные строки в зависимости от выбранных колонок
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

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Отчет о поездках</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'DejaVu Sans', 'Arial', 'Helvetica', sans-serif; 
            font-size: 10px;
            line-height: 1.3;
            color: #333;
            padding: 15px;
          }
          h1 { color: #1e293b; font-size: 18px; margin-bottom: 15px; text-align: center; }
          h2 { font-size: 14px; margin-top: 20px; margin-bottom: 10px; color: #2563eb; }
          h3 { font-size: 12px; margin-top: 10px; margin-bottom: 8px; color: #475569; }
          table { border-collapse: collapse; width: 100%; margin: 10px 0; font-size: 9px; }
          th, td { border: 1px solid #cbd5e1; padding: 6px 4px; text-align: left; vertical-align: top; }
          th { background-color: #2563eb; color: white; font-weight: 600; font-size: 9px; text-align: center; }
          .total { font-weight: bold; background-color: #f1f5f9; }
          .signature { margin-top: 40px; padding-top: 15px; border-top: 1px solid #cbd5e1; font-size: 10px; }
          .info-block { margin: 15px 0; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; }
          .info-block p { margin: 5px 0; }
          .date-info { margin: 10px 0; color: #64748b; }
          .text-center { text-align: center; }
        </style>
      </head>
      <body>
        <h1>Отчет о поездках</h1>
        
        <div class="date-info">
          <p><strong>Дата формирования:</strong> ${new Date().toLocaleString('ru-RU')}</p>
          <p><strong>${formatPeriodText(period)}</strong></p>
        </div>
        
        ${user ? `
          <div class="info-block">
            <h3>Информация о составителе</h3>
            <p><strong>ФИО:</strong> ${user.name || 'Не указано'}</p>
            <p><strong>Автомобиль:</strong> ${user.carModel || 'Не указан'}</p>
            <p><strong>Гос. номер:</strong> ${user.licensePlate || 'Не указан'}</p>
          </div>
        ` : ''}
        
        <h2>1. Общая статистика</h2>
        <table style="width: 100%;">
          <thead>
            <tr><th style="width: 60%;">Показатель</th><th style="width: 40%;">Значение</th></tr>
          </thead>
          <tbody>
            <tr><td style="padding: 6px;">Всего поездок</td><td class="text-center"><strong>${stats.totalTrips}</strong></td></tr>
            ${visibleColumns.includes("distance") ? `<tr><td style="padding: 6px;">Общий пробег</td><td class="text-center"><strong>${stats.totalDistance.toLocaleString()} км</strong></td></tr>` : ''}
            ${visibleColumns.includes("fuelAmount") ? `<tr><td style="padding: 6px;">Всего топлива</td><td class="text-center"><strong>${stats.totalFuelAmount.toLocaleString()} л</strong></td></tr>` : ''}
            ${visibleColumns.includes("amortization") ? `<tr><td style="padding: 6px;">Общая амортизация</td><td class="text-center"><strong>${stats.totalAmortization.toLocaleString()} ₽</strong></td></tr>` : ''}
            <tr class="total"><td style="padding: 6px;">Всего расходов</td><td class="text-center"><strong>${stats.totalExpenses.toLocaleString()} ₽</strong></td></tr>
            <tr><td style="padding: 6px;">Средний расход топлива</td><td class="text-center"><strong>${stats.averageFuelConsumption} л/100км</strong></td></tr>
          </tbody>
        </table>
        
        <h2>2. Детальный список поездок</h2>
        <table style="width: 100%;">
          <thead>
            <tr>
              ${headers.map(h => `<th style="width: ${h.width};">${h.label}</th>`).join('')}
            </tr>
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
              <td class="text-center"><strong>${stats.totalExpenses.toLocaleString()} ₽</strong></td>
            </tr>
          </tfoot>
        </table>
        
        <div class="signature">
          <p><strong>Подпись ответственного лица:</strong> _________________</p>
          <p><strong>Дата подписания:</strong> ${new Date().toLocaleDateString('ru-RU')}</p>
        </div>
        <div style="height: 48px" ></div>
      </body>
    </html>
  `;

    const container = document.createElement('div');
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    const opt: any = {
        margin: [10, 8, 22, 8],
        filename: `report_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 2, letterRendering: true, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    try {
        await html2pdf().set(opt).from(container).save();
    } catch (error) {
        console.error('PDF generation error:', error);
        throw error;
    } finally {
        document.body.removeChild(container);
    }
};