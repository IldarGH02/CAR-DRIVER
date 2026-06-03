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
}

export const generatePDF = async (options: PDFOptions): Promise<void> => {
    const { trips, stats, period, user } = options;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Отчет о поездках</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body { 
            font-family: 'DejaVu Sans', 'Arial', 'Helvetica', sans-serif; 
            font-size: 12px;
            line-height: 1.3;
            color: #333;
            padding: 5px;
          }
          h1 { 
            color: #1e293b; 
            font-size: 14px; 
            margin-bottom: 8px;
            text-align: center;
          }
          h2 { 
            font-size: 11px; 
            margin-top: 10px;
            margin-bottom: 5px;
            color: #2563eb;
          }
          table { 
            border-collapse: collapse; 
            width: 100%; 
            margin: 5px 0;
            font-size: 10px;
          }
          th, td { 
            border: 1px solid #cbd5e1; 
            padding: 4px 3px; 
            text-align: left;
            vertical-align: top;
          }
          th { 
            background-color: #2563eb; 
            color: white;
            font-weight: 600;
            font-size: 10px;
            text-align: center;
          }
          .total { 
            font-weight: bold; 
            background-color: #f1f5f9; 
          }
          .signature { 
            margin-top: 20px; 
            padding-top: 10px;
            border-top: 1px solid #cbd5e1;
            font-size: 10px;
            page-break-inside: avoid;
          }
          .info-block { 
            margin: 8px 0; 
            padding: 8px; 
            background: #f8fafc; 
            border: 1px solid #e2e8f0;
            border-radius: 4px;
          }
          .info-block p {
            margin: 3px 0;
            font-size: 8px;
          }
          .date-info {
            margin: 8px 0;
            color: #64748b;
            font-size: 10px;
          }
          .text-center {
            text-align: center;
          }
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
            <p><strong>ФИО:</strong> ${user.name || 'Не указано'} | 
            <strong>Автомобиль:</strong> ${user.carModel || 'Не указан'} | 
            <strong>Госномер:</strong> ${user.licensePlate || 'Не указан'}</p>
          </div>
        ` : ''}
        
        <h2>1. Общая статистика</h2>
        <table style="width: 100%;">
          <thead>
            <tr><th style="width: 60%;">Показатель</th><th style="width: 40%;">Значение</th></tr>
          </thead>
          <tbody>
            <tr><td style="padding: 4px;">Всего поездок</td><td class="text-center"><strong>${stats.totalTrips}</strong></tr>
            <tr><td style="padding: 4px;">Общий пробег</td><td class="text-center"><strong>${stats.totalDistance.toLocaleString()} км</strong></td></tr>
            <tr><td style="padding: 4px;">Всего топлива</td><td class="text-center"><strong>${stats.totalFuelAmount.toLocaleString()} л</strong></td></tr>
            <tr><td style="padding: 4px;">Средний расход топлива</td><td class="text-center"><strong>${stats.averageFuelConsumption} л/100км</strong></td></tr>
          </tbody>
        </table>
        
        <h2>2. Детальный список поездок</h2>
        <table style="width: 100%;">
          <thead>
            <tr>
              <th style="width: 4%;">№</th>
              <th style="width: 9%;">Дата</th>
              <th style="width: 30%;">Маршрут</th>
              <th style="width: 25%;">Цель</th>
              <th style="width: 10%;">Пробег (км)</th>
              <th style="width: 10%;">Топливо (л)</th>
              <th style="width: 12%;">Строка расходов</th>
            </tr>
          </thead>
          <tbody>
            ${trips.map((trip, index) => `
              <tr>
                <td class="text-center">${index + 1}</td>
                <td class="text-center">${new Date(trip.date).toLocaleDateString('ru-RU')}</td>
                <td>${trip.from} → ${trip.to}</td>
                <td>${trip.purpose}</td>
                <td class="text-center">${trip.distance}</td>
                <td class="text-center"><strong>${(trip.fuelAmount || 0).toLocaleString()}</strong></td>
                <td>${(trip as any).expenseLine || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="total">
              <td colspan="4"><strong>ИТОГО:</strong></td>
              <td class="text-center"><strong>${stats.totalDistance.toLocaleString()}</strong></td>
              <td class="text-center"><strong>${stats.totalFuelAmount.toLocaleString()}</strong></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        
        <div class="signature">
          <p><strong>Подпись ответственного лица:</strong> _________________</p>
          <p><strong>Дата подписания:</strong> ${new Date().toLocaleDateString('ru-RU')}</p>
        </div>
        <div style="height: 48px"></div>
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
        html2canvas: {
            scale: 2,
            letterRendering: true,
            useCORS: true,
            logging: false
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'landscape'
        }
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