import { Link } from "react-router-dom";
import { X, Car } from "lucide-react";
import { MenuItems } from "./MenuItems";
import { UserProfile } from "./UserProfile";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    menuItems: any[];
    currentPath: string;
    user: any;
    onLogout: () => void;
    isAuthenticated: boolean;
}

export const MobileMenu = ({
                               isOpen,
                               onClose,
                               menuItems,
                               currentPath,
                               user,
                               onLogout,
                               isAuthenticated
                           }: MobileMenuProps) => {
    return (
        <>
            {/* Оверлей с плавным появлением */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-all duration-300 ease-in-out
                    ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={onClose}
            />

            {/* Меню с плавным выезжанием */}
            <aside
                className={`fixed top-0 left-0 w-80 h-full bg-sidebar z-50 shadow-xl flex flex-col
                    transition-transform duration-300 ease-in-out transform
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Шапка с анимацией содержимого */}
                <div className={`p-4 border-b border-sidebar-border flex justify-between items-center bg-sidebar
                    transition-all duration-300 delay-100
                    ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <Link
                        to={isAuthenticated ? "/" : "/calculator"}
                        className="flex items-center gap-3"
                        onClick={onClose}
                    >
                        <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                            <Car className="w-5 h-5 text-sidebar-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-sidebar-foreground font-semibold">GoTrack</h1>
                            <p className="text-xs text-sidebar-foreground/60">Учёт поездок</p>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="text-sidebar-foreground p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Контент с анимацией появления */}
                <div className={`flex-1 overflow-y-auto p-4 transition-all duration-300 delay-150
                    ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <MenuItems
                        items={menuItems}
                        currentPath={currentPath}
                        onItemClick={onClose}
                        variant="mobile"
                    />
                </div>

                {/* Профиль с анимацией появления */}
                <div className={`transition-all duration-300 delay-200
                    ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {user && <UserProfile user={user} onLogout={onLogout} variant="mobile" />}
                </div>
            </aside>
        </>
    );
};