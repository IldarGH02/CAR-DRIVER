import { useState, useEffect, useMemo, useCallback } from "react";
import { useTripsStoreData } from "@features/trips/model/tripsStore";
import { useSettingsStoreData } from "@features/settings/model/settingsStore";
import { useUserStoreData } from "@entities/user/model/userStore";
import { filterTripsByPeriod, calculateStats } from "../utils/reportHelpers";
import { toast } from "sonner";
import { generatePDF } from "../utils/pdfGenerator";
import { generateExcel } from "../utils/excelGenerator";
import { reportTypes } from "../config/reportTypes";

export const useReports = () => {
    const { trips, fetchTrips } = useTripsStoreData();
    const { settings, fetchSettings } = useSettingsStoreData();
    const { user, fetchUser } = useUserStoreData();
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [reportType, setReportType] = useState("full");
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        fetchTrips();
        fetchSettings();
        fetchUser();
    }, []);

    const period = useMemo(() => ({ dateFrom, dateTo }), [dateFrom, dateTo]);
    const filteredTrips = useMemo(() => filterTripsByPeriod(trips, period), [trips, period]);
    const stats = useMemo(() => calculateStats(filteredTrips), [filteredTrips]);
    const currentReportType = useMemo(() => reportTypes.find(t => t.id === reportType) || reportTypes[0], [reportType]);

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
                    user
                });
                toast.success("PDF отчет успешно сгенерирован!");
            } else {
                generateExcel({
                    trips: filteredTrips,
                    stats,
                    user
                });
                toast.success("Excel отчет успешно сгенерирован!");
            }
        } catch (error) {
            console.error("Report generation error:", error);
            toast.error("Ошибка при генерации отчета");
        } finally {
            setIsGenerating(false);
        }
    }, [filteredTrips, stats, period, user, currentReportType]);

    return {
        trips,
        filteredTrips,
        stats,
        dateFrom,
        dateTo,
        reportType,
        isGenerating,
        user,
        setDateFrom,
        setDateTo,
        setReportType,
        handleGenerateReport,
    };
};