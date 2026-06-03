import { User, Trip } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const getStats = (users: User[], trips?: Trip[]) => {
    return {
        totalUsers: users.length,
        totalAdmins: users.filter(u => u.role === 'admin').length,
        totalRegularUsers: users.filter(u => u.role === 'user').length,
    };
};

export const generateUserReport = async (user: User, trips: Trip[]) => {
    if (trips.length === 0) return false;

    const stats = {
        totalTrips: trips.length,
        totalDistance: trips.reduce((sum, t) => sum + t.distance, 0),
        totalFuelAmount: trips.reduce((sum, t) => sum + (t.fuelAmount || 0), 0),
        totalAmortization: trips.reduce((sum, t) => sum + t.amortization, 0),
    };

    const doc = new jsPDF({ orientation: 'landscape' });

    doc.setFontSize(20);
    doc.text(`Отчёт по поездкам: ${user.name}`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Сгенерировано: ${new Date().toLocaleString('ru-RU')}`, 14, 30);

    const statsData = [
        ['Всего поездок', stats.totalTrips.toString()],
        ['Общий пробег', `${stats.totalDistance.toLocaleString()} км`],
        ['Всего топлива', `${stats.totalFuelAmount.toLocaleString()} л`],
        ['Общая амортизация', `${stats.totalAmortization.toLocaleString()} ₽`],
    ];

    autoTable(doc, {
        startY: 40,
        head: [['Показатель', 'Значение']],
        body: statsData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
    });

    const tableData = trips.map((trip: Trip) => [
        new Date(trip.date).toLocaleDateString('ru-RU'),
        `${trip.from} → ${trip.to}`,
        trip.purpose,
        `${trip.distance} км`,
        `${(trip.fuelAmount || 0).toLocaleString()} л`,
        `${trip.amortization.toLocaleString()} ₽`,
        trip.expenseLine || '—'
    ]);

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [['Дата', 'Маршрут', 'Цель', 'Пробег', 'Топливо', 'Амортизация', 'Строка расходов']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 8 },
    });

    doc.save(`report_${user.name}_${new Date().toISOString().split('T')[0]}.pdf`);
    return true;
};