import { useState, useEffect } from "react";
import { useUserStoreData } from "@entities/user/model/userStore";
import { useSettingsStoreData } from "@features/settings/model/settingsStore";
import { api } from "@shared/api/axiosInstance";
import { toast } from "sonner";

export const useSettings = () => {
    const { user, updateUser, fetchUser } = useUserStoreData();
    const { settings, fetchSettings, updateSettings, isLoading } = useSettingsStoreData();

    const [currency, setCurrency] = useState("RUB");
    const [distanceUnit, setDistanceUnit] = useState("km");
    const [fuelUnit, setFuelUnit] = useState("liters");
    const [amortizationRate, setAmortizationRate] = useState("2.68");
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);

    const [profileData, setProfileData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        carModel: user?.carModel || "",
        carYear: user?.carYear || "",
        licensePlate: user?.licensePlate || "",
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || "",
                email: user.email || "",
                carModel: user.carModel || "",
                carYear: user.carYear || "",
                licensePlate: user.licensePlate || "",
            });
        }
    }, [user]);

    useEffect(() => {
        fetchSettings();
        fetchUser();
    }, [fetchSettings, fetchUser]);

    useEffect(() => {
        if (settings) {
            setCurrency(settings.currency || "RUB");
            setDistanceUnit(settings.distance_unit || "km");
            setFuelUnit(settings.fuel_unit || "liters");
            setAmortizationRate(String(settings.amortization_rate || "2.68"));
            setNotifications(settings.notifications === 1);
            setAutoSave(settings.auto_save === 1);
        }
    }, [settings]);

    const handleSaveSettings = async () => {
        try {
            const profileResponse = await api.put('/settings/profile', {
                name: profileData.name,
                carModel: profileData.carModel,
                carYear: profileData.carYear,
                licensePlate: profileData.licensePlate
            });

            if (profileResponse.data.success) {
                updateUser(profileResponse.data.user);
                toast.success("Профиль успешно обновлен!");
            }

            await updateSettings({
                currency,
                distance_unit: distanceUnit,
                fuel_unit: fuelUnit,
                amortization_rate: parseFloat(amortizationRate),
                notifications: notifications ? 1 : 0,
                auto_save: autoSave ? 1 : 0,
            });

            toast.success("Настройки успешно сохранены!");
            await fetchUser();

        } catch (error: any) {
            console.error('Save error:', error);
            toast.error(error.response?.data?.message || "Ошибка при сохранении настроек");
        }
    };

    const handleResetSettings = () => {
        setCurrency("RUB");
        setDistanceUnit("km");
        setFuelUnit("liters");
        setAmortizationRate("2.68");
        setDarkMode(false);
        setNotifications(true);
        setAutoSave(true);
        toast.info("Настройки сброшены до значений по умолчанию");
    };

    return {
        profileData,
        setProfileData,
        currency,
        setCurrency,
        distanceUnit,
        setDistanceUnit,
        fuelUnit,
        setFuelUnit,
        amortizationRate,
        setAmortizationRate,
        darkMode,
        setDarkMode,
        notifications,
        setNotifications,
        autoSave,
        setAutoSave,
        isLoading,
        handleSaveSettings,
        handleResetSettings,
    };
};