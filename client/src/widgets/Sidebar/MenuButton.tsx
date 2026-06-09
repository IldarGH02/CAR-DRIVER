import { Menu } from "lucide-react";

interface MenuButtonProps {
    onClick: () => void;
    isAuthenticated: boolean;
    isOpen?: boolean;
}

export const MenuButton = ({ onClick, isAuthenticated, isOpen }: MenuButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`fixed z-50 p-2.5 rounded-lg shadow-lg transition-all duration-300 ease-in-out
                hover:scale-105 active:scale-95
                ${isAuthenticated
                ? 'top-4 left-4 bg-sidebar text-white hover:bg-sidebar-accent'
                : 'top-4 right-4 bg-primary text-white hover:bg-primary/90'
            }
                ${isOpen ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}`}
            aria-label="Меню"
        >
            <Menu className="w-5 h-5" />
        </button>
    );
};