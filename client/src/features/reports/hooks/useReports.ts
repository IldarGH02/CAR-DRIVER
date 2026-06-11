import { useState, useEffect, useMemo, useCallback } from "react";
import { useTripsStoreData } from "@features/trips/model/tripsStore";
import { useSettingsStore } from "@features/settings/model/settingsStore";
import { useUserStoreData } from "@entities/user/model/userStore";
import { filterTripsByPeriod, calculateStats } from "../utils/reportHelpers";
import { toast } from "sonner";
import { generatePDF } from "../utils/pdfGenerator";
import { generateExcel } from "../utils/excelGenerator";
import { reportTypes, availableColumns } from "../config/reportTypes";

export const useReports = () => {
    const { trips, fetchTrips } = useTripsStoreData();
    const { settings, fetchSettings } = useSettingsStore();
    const { user, fetchUser } = useUserStoreData();
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [reportType, setReportType] = useState("full");
    const [isGenerating, setIsGenerating] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
        // Загружаем сохранённые настройки из localStorage
        const saved = localStorage.getItem("report_visible_columns");
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return availableColumns.filter(c => c.defaultVisible).map(c => c.id);
            }
        }
        return availableColumns.filter(c => c.defaultVisible).map(c => c.id);
    });

    useEffect(() => {
        fetchTrips();
        fetchSettings();
        fetchUser();
    }, []);

    // Сохраняем настройки колонок
    useEffect(() => {
        localStorage.setItem("report_visible_columns", JSON.stringify(visibleColumns));
    }, [visibleColumns]);

    const period = useMemo(() => ({ dateFrom, dateTo }), [dateFrom, dateTo]);
    const filteredTrips = useMemo(() => filterTripsByPeriod(trips, period), [trips, period]);
    const stats = useMemo(() => calculateStats(filteredTrips), [filteredTrips]);
    const currentReportType = useMemo(() => reportTypes.find(t => t.id === reportType) || reportTypes[0], [reportType]);

    const toggleColumn = useCallback((columnId: string) => {
        setVisibleColumns(prev =>
            prev.includes(columnId)
                ? prev.filter(id => id !== columnId)
                : [...prev, columnId]
        );
    }, []);

    const handleGenerateReport = useCallback(async () => {
        if (filteredTrips.length === 0) {
            toast.warning("Нет данных для выбранного периода");
            return;
        }

        setIsGenerating(true);

        try {
            if (currentReportType.format === "pdf") {
                await generatePDF({
                    trips: filteredTrips,
                    stats,
                    period,
                    user,
                    visibleColumns,
                });
                toast.success("PDF отчет успешно сгенерирован!");
            } else {
                generateExcel({
                    trips: filteredTrips,
                    stats,
                    user,
                    visibleColumns,
                });
                toast.success("Excel отчет успешно сгенерирован!");
            }
        } catch (error) {
            console.error("Report generation error:", error);
            toast.error("Ошибка при генерации отчета");
        } finally {
            setIsGenerating(false);
        }
    }, [filteredTrips, stats, period, user, currentReportType, visibleColumns]);

    return {
        trips,
        filteredTrips,
        stats,
        dateFrom,
        dateTo,
        reportType,
        isGenerating,
        user,
        visibleColumns,
        setDateFrom,
        setDateTo,
        setReportType,
        handleGenerateReport,
        toggleColumn,
    };
};