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
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5" />
                    Дополнительные настройки
                </CardTitle>
                <CardDescription>Настройки интерфейса и уведомлений</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <SettingsIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium">Тёмная тема</p>
                            <p className="text-sm text-muted-foreground">
                                Переключить на тёмное оформление
                            </p>
                        </div>
                    </div>
                    <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium">Уведомления</p>
                            <p className="text-sm text-muted-foreground">
                                Получать напоминания о поездках
                            </p>
                        </div>
                    </div>
                    <Switch checked={notifications} onCheckedChange={onNotificationsChange} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Save className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-medium">Автосохранение</p>
                            <p className="text-sm text-muted-foreground">
                                Автоматически сохранять изменения
                            </p>
                        </div>
                    </div>
                    <Switch checked={autoSave} onCheckedChange={onAutoSaveChange} />
                </div>
            </CardContent>
        </Card>
    );
};