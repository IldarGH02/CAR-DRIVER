import { LogOut } from "lucide-react";

interface UserProfileProps {
    user: {
        id?: number;
        name?: string;
        email?: string;
        role?: string;
    } | null;
    onLogout: () => void;
    variant?: "mobile" | "desktop";
    isCollapsed?: boolean;
}

export const UserProfile = ({ user, onLogout, variant = "desktop", isCollapsed = false }: UserProfileProps) => {
    if (!user) return null;

    const isMobile = variant === "mobile";
    const isStaticAdmin = user?.email === 'kooooooffe@gmail.com' && user?.id === 0;

    // Свернутый режим на десктопе
    if (isCollapsed && variant === "desktop") {
        return (
            <div className="p-2 border-t border-sidebar-border">
                <button
                    onClick={onLogout}
                    className="w-full flex justify-center items-center rounded-lg text-red-600 hover:bg-red-50 transition-colors p-3 relative group"
                    aria-label="Выйти"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        Выйти
                    </div>
                </button>
            </div>
        );
    }

    // Полный режим на десктопе
    if (variant === "desktop") {
        return (
            <div className="p-4 border-t border-sidebar-border flex-shrink-0 overflow-hidden">
                <div className="flex items-center gap-3 px-2 py-2 mb-3 min-w-0">
                    <div className="w-10 h-10 bg-sidebar-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sidebar-foreground text-base font-medium">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                        <p className="text-sm text-sidebar-foreground font-medium truncate">
                            {user.name || "Пользователь"}
                        </p>
                        <p className="text-xs text-sidebar-foreground/60 truncate">
                            {user.email || "user@example.com"}
                        </p>
                        {(isStaticAdmin || user?.role === 'admin') && (
                            <p className="text-xs text-purple-400">Администратор</p>
                        )}
                    </div>
                </div>

                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors px-4 py-2 text-base"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <span>Выйти</span>
                </button>
            </div>
        );
    }

    // Мобильная версия
    return (
        <div className="p-4 border-t border-sidebar-border flex-shrink-0">
            <div className="flex items-center gap-3 px-2 py-2 mb-3">
                <div className="w-10 h-10 bg-sidebar-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sidebar-foreground text-base font-medium">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-sidebar-foreground font-medium truncate">
                        {user.name || "Пользователь"}
                    </p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                        {user.email || "user@example.com"}
                    </p>
                    {(isStaticAdmin || user?.role === 'admin') && (
                        <p className="text-xs text-purple-400">Администратор</p>
                    )}
                </div>
            </div>

            <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors px-4 py-2 text-base"
            >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span>Выход</span>
            </button>
        </div>
    );
};