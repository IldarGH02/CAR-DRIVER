import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Calculator, Car, Settings, FileText, LogOut, Menu, X, Shield } from "lucide-react";
import { useUserStoreData } from "@entities/user/model/userStore";
import { useAuthStoreData } from "@features/auth/model/authStore";

interface SidebarProps {
    isAuthenticated: boolean;
}

export function Sidebar({ isAuthenticated }: SidebarProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { user, logout: userLogout } = useUserStoreData();
    const { logout: authLogout } = useAuthStoreData();
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname.replace('/', '') || 'dashboard';

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Базовые пункты меню
    const baseMenuItems = [
        { id: "dashboard", label: "Главная", icon: Home, path: "/", requiresAuth: true, adminOnly: false },
        { id: "calculator", label: "Калькулятор", icon: Calculator, path: "/calculator", requiresAuth: false, adminOnly: false },
        { id: "trips", label: "Поездки", icon: Car, path: "/trips", requiresAuth: true, adminOnly: false },
        { id: "reports", label: "Отчёты", icon: FileText, path: "/reports", requiresAuth: true, adminOnly: false },
        { id: "settings", label: "Настройки", icon: Settings, path: "/settings", requiresAuth: true, adminOnly: false },
    ];

    // Админский пункт меню
    const adminMenuItem = { id: "admin", label: "Админ-панель", icon: Shield, path: "/admin", requiresAuth: true, adminOnly: true };

    // Формируем меню в зависимости от роли пользователя
    let menuItems = [...baseMenuItems];

    // Добавляем админ-панель только если пользователь админ
    if (isAuthenticated && user?.role === 'admin') {
        menuItems.push(adminMenuItem);
    }

    // Для неавторизованных пользователей показываем только калькулятор
    if (!isAuthenticated) {
        menuItems = [{ id: "calculator", label: "Калькулятор", icon: Calculator, path: "/calculator", requiresAuth: false, adminOnly: false }];
    }

    const handleLogout = () => {
        authLogout();
        userLogout();
        navigate('/calculator');
        setIsMobileOpen(false);
    };

    const handleLinkClick = () => {
        setIsMobileOpen(false);
    };

    // Общий компонент содержимого сайдбара
    const SidebarContent = () => (
        <>
            <div className="p-4 md:p-6 border-b border-sidebar-border flex-shrink-0">
                <Link to={isAuthenticated ? "/" : "/calculator"} className="flex items-center gap-3" onClick={handleLinkClick}>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
                        <Car className="w-5 h-5 md:w-6 md:h-6 text-sidebar-primary-foreground" />
                    </div>
                    <div>
                        <h1 className="text-sidebar-foreground font-semibold text-sm md:text-base">GoTrack</h1>
                        <p className="text-xs text-sidebar-foreground/60 hidden md:block">Учёт поездок</p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPath === item.id;

                        return (
                            <li key={item.id}>
                                <Link
                                    to={item.path}
                                    onClick={handleLinkClick}
                                    className={`w-full flex items-center gap-3 px-3 py-2 md:px-4 md:py-3 rounded-lg transition-colors text-sm md:text-base ${
                                        isActive
                                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                    }`}
                                >
                                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {isAuthenticated ? (
                <div className="p-4 border-t border-sidebar-border flex-shrink-0">
                    <div className="flex items-center gap-3 px-2 py-2 md:px-4 md:py-3 mb-2">
                        <div className="w-7 h-7 md:w-8 md:h-8 bg-sidebar-primary/20 rounded-full flex items-center justify-center">
                            <span className="text-sidebar-foreground text-xs md:text-sm font-medium">
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0 hidden md:block">
                            <p className="text-sm text-sidebar-foreground font-medium truncate">
                                {user?.name || "Пользователь"}
                            </p>
                            <p className="text-xs text-sidebar-foreground/60 truncate">
                                {user?.email || "user@example.com"}
                            </p>
                            {user?.role === 'admin' && (
                                <p className="text-xs text-purple-400">Администратор</p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 md:px-4 md:py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm md:text-base"
                    >
                        <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden md:inline">Выйти</span>
                    </button>

                    {/* Ссылка на политику конфиденциальности */}
                    <div className="mt-4 pt-3 border-t border-sidebar-border">
                        <Link
                            to="/privacy"
                            onClick={handleLinkClick}
                            className="block text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors text-center"
                        >
                            Политика конфиденциальности
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="p-4 border-t border-sidebar-border flex-shrink-0">
                    <Link
                        to="/login"
                        onClick={handleLinkClick}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm md:text-base"
                    >
                        <span className="font-medium">Войти</span>
                    </Link>

                    {/* Ссылка на политику конфиденциальности для неавторизованных */}
                    <div className="mt-3 pt-2">
                        <Link
                            to="/privacy"
                            onClick={handleLinkClick}
                            className="block text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors text-center"
                        >
                            Политика конфиденциальности
                        </Link>
                    </div>
                </div>
            )}
        </>
    );

    // Мобильная версия
    if (isMobile) {
        return (
            <>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar-primary text-white shadow-lg"
                    aria-label="Меню"
                >
                    <Menu className="w-5 h-5" />
                </button>

                {isMobileOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}

                <aside
                    className={`fixed top-0 left-0 w-64 h-full bg-sidebar z-50 transition-transform duration-300 flex flex-col ${
                        isMobileOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div className="p-4 border-b border-sidebar-border flex justify-between items-center flex-shrink-0">
                        <span className="text-sidebar-foreground font-semibold">Меню</span>
                        <button onClick={() => setIsMobileOpen(false)} className="text-sidebar-foreground">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <SidebarContent />
                    </div>
                </aside>
            </>
        );
    }

    // Десктопная версия
    return (
        <aside className="w-64 bg-sidebar h-full flex flex-col border-r border-sidebar-border">
            <SidebarContent />
        </aside>
    );
}