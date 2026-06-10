import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card";
import { Button } from "@shared/ui/button";
import { Separator } from "@shared/ui/separator";
import { Save, Trash2, Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { useThemeStore } from "@entities/theme/model/themeStore";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@shared/ui/dropdown-menu";

interface ActionsCardProps {
    isLoading: boolean;
    currency: string;
    distanceUnit: string;
    fuelUnit: string;
    amortizationRate: string;
    onSave: () => void;
    onReset: () => void;
}

export const ActionsCard = ({
                                isLoading,
                                currency,
                                distanceUnit,
                                fuelUnit,
                                amortizationRate,
                                onSave,
                                onReset,
                            }: ActionsCardProps) => {
    const { theme, setTheme } = useThemeStore();

    const getThemeIcon = () => {
        switch (theme) {
            case 'light':
                return <Sun className="w-4 h-4 sm:w-5 sm:h-5" />;
            case 'dark':
                return <Moon className="w-4 h-4 sm:w-5 sm:h-5" />;
            default:
                return <Monitor className="w-4 h-4 sm:w-5 sm:h-5" />;
        }
    };

    const getThemeLabel = () => {
        switch (theme) {
            case 'light':
                return 'Светлая';
            case 'dark':
                return 'Тёмная';
            default:
                return 'Системная';
        }
    };

    return (
        <Card className="sticky top-4 md:top-6">
            <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
                <Button
                    onClick={onSave}
                    className="w-full gap-2 text-sm sm:text-base py-2 sm:py-2.5"
                    disabled={isLoading}
                >
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    {isLoading ? "Сохранение..." : "Сохранить настройки"}
                </Button>

                <Button
                    onClick={onReset}
                    variant="outline"
                    className="w-full gap-2 text-sm sm:text-base py-2 sm:py-2.5"
                >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    Сбросить настройки
                </Button>

                <Separator className="my-2 sm:my-4" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full gap-2 justify-between text-sm sm:text-base py-2 sm:py-2.5 px-3 sm:px-4"
                        >
                            <span className="flex items-center gap-2 min-w-0">
                                {getThemeIcon()}
                                <span className="truncate">Тема оформления</span>
                            </span>
                            <span className="flex items-center gap-1 flex-shrink-0">
                                <span className="text-muted-foreground text-xs sm:text-sm hidden xs:inline">
                                    {getThemeLabel()}
                                </span>
                                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 sm:w-56">
                        <DropdownMenuItem onClick={() => setTheme('light')} className="gap-2 py-2 sm:py-2.5">
                            <Sun className="w-4 h-4" />
                            <span>Светлая</span>
                            {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-2 py-2 sm:py-2.5">
                            <Moon className="w-4 h-4" />
                            <span>Тёмная</span>
                            {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('system')} className="gap-2 py-2 sm:py-2.5">
                            <Monitor className="w-4 h-4" />
                            <span>Системная</span>
                            {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Separator className="my-2 sm:my-4" />

                <div className="space-y-2">
                    <p className="text-sm font-medium">Текущие настройки:</p>
                    <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                        <p>Валюта: <span className="font-medium text-foreground">{currency}</span></p>
                        <p>Расстояние: <span className="font-medium text-foreground">{distanceUnit === "km" ? "Километры" : "Мили"}</span></p>
                        <p>Топливо: <span className="font-medium text-foreground">{fuelUnit === "liters" ? "Литры" : "Галлоны"}</span></p>
                        <p>Амортизация: <span className="font-medium text-foreground">{amortizationRate} ₽/км</span></p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};