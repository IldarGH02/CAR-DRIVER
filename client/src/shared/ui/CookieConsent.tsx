import { useState, useEffect } from 'react';
import { Button } from './button';
import { X } from 'lucide-react';

interface CookieSettings {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
}

export const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState<CookieSettings>({
        necessary: true,
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setIsVisible(true);
        } else {
            try {
                const parsed = JSON.parse(consent);
                setSettings(parsed);
            } catch (e) {
                setIsVisible(true);
            }
        }
    }, []);

    const acceptAll = () => {
        const allSettings = {
            necessary: true,
            analytics: true,
            marketing: true,
        };
        localStorage.setItem('cookie-consent', JSON.stringify(allSettings));
        setSettings(allSettings);
        setIsVisible(false);
        setShowSettings(false);
        applyCookies(allSettings);
    };

    const acceptNecessary = () => {
        const necessaryOnly = {
            necessary: true,
            analytics: false,
            marketing: false,
        };
        localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
        setSettings(necessaryOnly);
        setIsVisible(false);
        setShowSettings(false);
        applyCookies(necessaryOnly);
    };

    const saveSettings = () => {
        localStorage.setItem('cookie-consent', JSON.stringify(settings));
        setIsVisible(false);
        setShowSettings(false);
        applyCookies(settings);
    };

    const applyCookies = (cookieSettings: CookieSettings) => {
        document.cookie = "necessary=true; path=/; max-age=31536000";

        if (cookieSettings.analytics) {
            document.cookie = "analytics=enabled; path=/; max-age=31536000";
        } else {
            document.cookie = "analytics=disabled; path=/; max-age=31536000";
        }

        if (cookieSettings.marketing) {
            document.cookie = "marketing=enabled; path=/; max-age=31536000";
        } else {
            document.cookie = "marketing=disabled; path=/; max-age=31536000";
        }
    };

    const declineAll = () => {
        const declineSettings = {
            necessary: true,
            analytics: false,
            marketing: false,
        };
        localStorage.setItem('cookie-consent', JSON.stringify(declineSettings));
        setSettings(declineSettings);
        setIsVisible(false);
        setShowSettings(false);
        applyCookies(declineSettings);
    };

    if (!isVisible) return null;

    if (showSettings) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg animate-in slide-in-from-bottom-5">
                <div className="container mx-auto max-w-4xl p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold">Настройки cookie</h3>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Необходимые cookie</p>
                                <p className="text-sm text-gray-500">Необходимы для работы сайта. Не могут быть отключены.</p>
                            </div>
                            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                Всегда включены
                            </div>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Аналитические cookie</p>
                                <p className="text-sm text-gray-500">Помогают нам анализировать использование сайта.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.analytics}
                                    onChange={(e) => setSettings({ ...settings, analytics: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Маркетинговые cookie</p>
                                <p className="text-sm text-gray-500">Используются для персонализации рекламы.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.marketing}
                                    onChange={(e) => setSettings({ ...settings, marketing: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <Button onClick={saveSettings} className="flex-1">
                            Сохранить настройки
                        </Button>
                        <Button onClick={acceptAll} variant="outline" className="flex-1">
                            Принять все
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg animate-in slide-in-from-bottom-5">
            <div className="container mx-auto max-w-4xl p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">Мы используем cookie</h3>
                        <p className="text-sm text-gray-600">
                            Мы используем файлы cookie для улучшения работы сайта, анализа трафика и персонализации.
                            Вы можете настроить параметры cookie или принять их все.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={acceptAll} size="sm">
                            Принять все
                        </Button>
                        <Button onClick={acceptNecessary} variant="outline" size="sm">
                            Только необходимые
                        </Button>
                        <Button onClick={declineAll} variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            Отклонить
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};