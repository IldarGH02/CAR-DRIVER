import { useState, useEffect } from 'react';
import { useUserStore } from '@entities/user/model/userStore';
import { useThemeStore } from '@entities/theme/model/themeStore';
import { toast } from 'sonner';
import { api } from '@shared/api/axiosInstance';

export const useSettings = () => {
    const { user, updateUser } = useUserStore();
    const { theme, setTheme } = useThemeStore();

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        carModel: '',
        carYear: '',
        licensePlate: ''
    });

    const [currency, setCurrency] = useState('RUB');
    const [distanceUnit, setDistanceUnit] = useState('km');
    const [fuelUnit, setFuelUnit] = useState('liters');
    const [amortizationRate, setAmortizationRate] = useState('2.68');

    const [notifications, setNotifications] = useState(true);
    const [autoSave, setAutoSave] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                carModel: user.carModel || '',
                carYear: user.carYear || '',
                licensePlate: user.licensePlate || ''
            });
            fetchSettings();
        }
    }, [user]);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            if (response.data.success) {
                const settings = response.data.settings;
                setCurrency(settings.currency || 'RUB');
                setDistanceUnit(settings.distance_unit || 'km');
                setFuelUnit(settings.fuel_unit || 'liters');
                setAmortizationRate(String(settings.amortization_rate || '2.68'));
                setNotifications(settings.notifications === 1 || settings.notifications === true);
                setAutoSave(settings.auto_save === 1 || settings.auto_save === true);
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        }
    };

    const handleSaveSettings = async () => {
        setIsLoading(true);
        try {
            if (user && user.id !== 0) {
                await api.put('/settings/profile', {
                    name: profileData.name,
                    carModel: profileData.carModel,
                    carYear: profileData.carYear,
                    licensePlate: profileData.licensePlate
                });
                updateUser(profileData);
            }

            await api.put('/settings', {
                currency,
                distance_unit: distanceUnit,
                fuel_unit: fuelUnit,
                amortization_rate: Number(amortizationRate),
                notifications: notifications ? 1 : 0,
                auto_save: autoSave ? 1 : 0
            });

            toast.success('Настройки сохранены');
        } catch (error: any) {
            console.error('Save error:', error);
            toast.error(error.response?.data?.message || 'Ошибка сохранения');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSettings = () => {
        setCurrency('RUB');
        setDistanceUnit('km');
        setFuelUnit('liters');
        setAmortizationRate('2.68');
        setNotifications(true);
        setAutoSave(true);

        setTheme('light');

        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                carModel: '',
                carYear: '',
                licensePlate: ''
            });
        }

        toast.success('Настройки сброшены');
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
        darkMode: theme === 'dark',
        setDarkMode: (value: boolean) => setTheme(value ? 'dark' : 'light'),
        notifications,
        setNotifications,
        autoSave,
        setAutoSave,
        isLoading,
        handleSaveSettings,
        handleResetSettings,
    };
};