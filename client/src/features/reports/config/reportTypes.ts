import { FileText, TrendingUp, Table as TableIcon, Calendar, FileSpreadsheet, Settings } from "lucide-react";

export interface ReportType {
    id: string;
    title: string;
    description: string;
    icon: any;
    format: "pdf" | "excel";
}

export const reportTypes: ReportType[] = [
    {
        id: "full",
        title: "Полный отчёт (PDF)",
        description: "Все поездки и расходы за выбранный период",
        icon: FileText,
        format: "pdf"
    },
    {
        id: "full-excel",
        title: "Полный отчёт (Excel)",
        description: "Все поездки и расходы в формате Excel",
        icon: FileSpreadsheet,
        format: "excel"
    },
    {
        id: "expenses",
        title: "Отчёт по расходам",
        description: "Детализация всех расходов на топливо и амортизацию",
        icon: TrendingUp,
        format: "excel"
    },
    {
        id: "trips",
        title: "Список поездок",
        description: "Таблица всех командировок с маршрутами",
        icon: TableIcon,
        format: "pdf"
    },
    {
        id: "monthly",
        title: "Месячный отчёт",
        description: "Сводка за календарный месяц",
        icon: Calendar,
        format: "excel"
    },
    {
        id: "custom",
        title: "Настраиваемый отчёт",
        description: "Выберите параметры для отображения",
        icon: Settings,
        format: "pdf"
    }
];

export interface ReportColumn {
    id: string;
    label: string;
    defaultVisible: boolean;
}

export const availableColumns: ReportColumn[] = [
    { id: "date", label: "Дата", defaultVisible: true },
    { id: "route", label: "Маршрут", defaultVisible: true },
    { id: "purpose", label: "Цель", defaultVisible: true },
    { id: "distance", label: "Пробег (км)", defaultVisible: true },
    { id: "fuelAmount", label: "Топливо (л)", defaultVisible: true },
    { id: "amortization", label: "Амортизация (₽)", defaultVisible: true },
    { id: "expenseLine", label: "Строка расходов", defaultVisible: false }
];