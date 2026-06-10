import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@shared/ui/card";
import { Switch } from "@shared/ui/switch";
import { Separator } from "@shared/ui/separator";
import { Settings as SettingsIcon, Bell, Save } from "lucide-react";
import { useThemeStore } from "@entities/theme/model/themeStore";

interface PreferencesCardProps {
    darkMode: boolean;
    notifications: boolean;
    autoSave: boolean;
    onDarkModeChange: (value: boolean) => void;
    onNotificationsChange: (value: boolean) => void;
    onAutoSaveChange: (value: boolean) => void;
}

export const PreferencesCard = ({
                                    darkMode,
                                    notifications,
                                    autoSave,
                                    onDarkModeChange,
                                    onNotificationsChange,
                                    onAutoSaveChange,
                                }: PreferencesCardProps) => {
    const { toggleTheme } = useThemeStore();

    const handleDarkModeToggle = (checked: boolean) => {
        toggleTheme();
        onDarkModeChange(checked);
    };

    return (
        <Card>
            <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <SettingsIcon className="w-5 h-5" />
                    Дополнительные настройки
                </CardTitle>
                <CardDescription className="text-sm">
                    Настройки интерфейса и уведомлений
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-4 sm:p-6 pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            <SettingsIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium text-sm sm:text-base">Тёмная тема</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Переключить на тёмное оформление
                            </p>
                        </div>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} className="flex-shrink-0" />
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium text-sm sm:text-base">Уведомления</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Получать напоминания о поездках
                            </p>
                        </div>
                    </div>
                    <Switch checked={notifications} onCheckedChange={onNotificationsChange} className="flex-shrink-0" />
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                            <Save className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium text-sm sm:text-base">Автосохранение</p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Автоматически сохранять изменения
                            </p>
                        </div>
                    </div>
                    <Switch checked={autoSave} onCheckedChange={onAutoSaveChange} className="flex-shrink-0" />
                </div>
            </CardContent>
        </Card>
    );
};