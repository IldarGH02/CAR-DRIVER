import { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Sidebar } from "@widgets/Sidebar/Sidebar";
import { Toaster } from "@shared/ui/sonner";
import { useUserStore } from "@entities/user/model/userStore";
import { useMediaQuery } from "@shared/hooks/useMediaQuery";
import { CookieConsent } from '@shared/ui/CookieConsent';

export default function App() {
    const { isAuthenticated, setIsAuthenticated, setUser } = useUserStore();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        document.title = "GoTrack - Учёт поездок";
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token && !isAuthenticated) {
            const storedUser = localStorage.getItem('user-storage');
            if (storedUser) {
                try {
                    const userData = JSON.parse(storedUser);
                    if (userData.state?.user) {
                        setUser(userData.state.user);
                        setIsAuthenticated(true);
                    }
                } catch (e) {
                    console.error('Error restoring session', e);
                }
            }
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            if (location.pathname !== '/login' && location.pathname !== '/calculator') {
                navigate('/calculator');
            }
        } else {
            if (location.pathname === '/login') {
                navigate('/');
            }
        }
    }, [isAuthenticated, location.pathname, navigate]);

    const contentPadding = isMobile ? "pt-16" : "";

    return (
        <div className="h-screen flex overflow-hidden">
            <Sidebar isAuthenticated={isAuthenticated} />
            <div className={`flex-1 overflow-y-auto bg-background ${contentPadding}`}>
                <Outlet />
            </div>
            <Toaster />
            <CookieConsent />
        </div>
    );
}