import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserStoreData } from '@entities/user/model/userStore';
import { useAuthStoreData } from '@features/auth/model/authStore';

const baseMenuItems = [
    { id: "dashboard", label: "Главная", icon: "Home", path: "/", requiresAuth: true },
    { id: "calculator", label: "Калькулятор", icon: "Calculator", path: "/calculator", requiresAuth: false },
    { id: "trips", label: "Поездки", icon: "Car", path: "/trips", requiresAuth: true },
    { id: "reports", label: "Отчёты", icon: "FileText", path: "/reports", requiresAuth: true },
    { id: "settings", label: "Настройки", icon: "Settings", path: "/settings", requiresAuth: true },
];

export const useSidebar = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(() => {
        // Загружаем состояние из localStorage
        const saved = localStorage.getItem('sidebar-collapsed');
        return saved === 'true';
    });
    const [isMobile, setIsMobile] = useState(false);
    const { user, logout: userLogout } = useUserStoreData();
    const { logout: authLogout } = useAuthStoreData();
    const location = useLocation();

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // На мобильных всегда развернуто
            if (mobile && isCollapsed) {
                setIsCollapsed(false);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Сохраняем состояние в localStorage
    useEffect(() => {
        localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
    }, [isCollapsed]);

    const toggleCollapse = () => {
        if (!isMobile) {
            setIsCollapsed(!isCollapsed);
        }
    };

    const getMenuItems = () => {
        const isAuthenticated = !!user;

        if (!isAuthenticated) {
            return [{ id: "calculator", label: "Калькулятор", icon: "Calculator", path: "/calculator", requiresAuth: false }];
        }

        const items = [...baseMenuItems];

        if (user?.role === 'admin') {
            items.push({ id: "admin", label: "Админ-панель", icon: "Shield", path: "/admin", requiresAuth: true });
        }

        return items;
    };

    const handleLogout = () => {
        authLogout();
        userLogout();
        setIsMobileOpen(false);
    };

    const closeMobileMenu = () => setIsMobileOpen(false);
    const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);

    return {
        isMobile,
        isMobileOpen,
        isCollapsed,
        user,
        currentPath: location.pathname.replace('/', '') || 'dashboard',
        menuItems: getMenuItems(),
        handleLogout,
        closeMobileMenu,
        toggleMobileMenu,
        toggleCollapse,
    };
};