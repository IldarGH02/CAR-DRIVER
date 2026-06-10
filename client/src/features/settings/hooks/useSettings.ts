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

    const [darkMode, setDarkMode] = useState(theme === 'dark');
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
        }

        // Загружаем сохраненные настройки из localStorage
        const savedNotifications = localStorage.getItem('notifications');
        const savedAutoSave = localStorage.getItem('autoSave');

        if (savedNotifications !== null) {
            setNotifications(savedNotifications === 'true');
        }
        if (savedAutoSave !== null) {
            setAutoSave(savedAutoSave === 'true');
        }
    }, [user]);

    // Синхронизация darkMode с темой из стора
    useEffect(() => {
        setDarkMode(theme === 'dark');
    }, [theme]);

    // Обработчик изменения darkMode
    const handleDarkModeChange = (value: boolean) => {
        setDarkMode(value);
        setTheme(value ? 'dark' : 'light');
        // Сохраняем выбор темы в localStorage (делает сам themeStore)
    };

    const handleSaveSettings = async () => {
        setIsLoading(true);
        try {
            // Сохраняем профиль (только если есть ID и это не статический админ)
            if (user && user.id !== 0) {
                await api.put('/settings/profile', {
                    name: profileData.name,
                    carModel: profileData.carModel,
                    carYear: profileData.carYear,
                    licensePlate: profileData.licensePlate
                });

                // Обновляем пользователя в сторе
                updateUser(profileData);
            }

            // Сохраняем системные настройки в localStorage
            localStorage.setItem('notifications', String(notifications));
            localStorage.setItem('autoSave', String(autoSave));

            toast.success('Настройки сохранены');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Ошибка сохранения');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetSettings = () => {
        // Сброс настроек валюты и единиц измерения
        setCurrency('RUB');
        setDistanceUnit('km');
        setFuelUnit('liters');
        setAmortizationRate('2.68');

        // Сброс темы
        setDarkMode(false);
        setTheme('light');

        // Сброс уведомлений и автосохранения
        setNotifications(true);
        setAutoSave(true);

        // Сброс профиля
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                carModel: '',
                carYear: '',
                licensePlate: ''
            });
        }

        // Сброс localStorage
        localStorage.setItem('notifications', 'true');
        localStorage.setItem('autoSave', 'true');

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
        darkMode,
        setDarkMode: handleDarkModeChange,
        notifications,
        setNotifications,
        autoSave,
        setAutoSave,
        isLoading,
        handleSaveSettings,
        handleResetSettings,
    };
};