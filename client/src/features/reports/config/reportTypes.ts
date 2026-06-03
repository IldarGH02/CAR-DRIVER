import { FileText, TrendingUp, Table as TableIcon, Calendar, FileSpreadsheet } from "lucide-react";

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
        title: "Полный отчёт",
        description: "Все поездки и расходы за выбранный период",
        icon: FileText,
        format: "pdf",
    },
    {
        id: "full-excel",
        title: "Полный отчёт (Excel)",
        description: "Все поездки и расходы в формате Excel",
        icon: FileSpreadsheet,
        format: "excel",
    },
    {
        id: "expenses",
        title: "Отчёт по расходам",
        description: "Детализация всех расходов на топливо и амортизацию",
        icon: TrendingUp,
        format: "excel",
    },
    {
        id: "trips",
        title: "Список поездок",
        description: "Таблица всех командировок с маршрутами",
        icon: TableIcon,
        format: "pdf",
    },
    {
        id: "monthly",
        title: "Месячный отчёт",
        description: "Сводка за календарный месяц",
        icon: Calendar,
        format: "excel",
    },
];