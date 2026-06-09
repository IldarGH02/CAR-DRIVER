import { Link } from "react-router-dom";
import { Home, Calculator, Car, FileText, Settings, Shield } from "lucide-react";

const iconMap = {
    Home, Calculator, Car, FileText, Settings, Shield
};

interface MenuItemsProps {
    items: Array<{
        id: string;
        label: string;
        icon: keyof typeof iconMap;
        path: string;
    }>;
    currentPath: string;
    onItemClick?: () => void;
    variant?: "mobile" | "desktop";
    isCollapsed?: boolean;
}

export const MenuItems = ({
                              items,
                              currentPath,
                              onItemClick,
                              variant = "desktop",
                              isCollapsed = false
                          }: MenuItemsProps) => {
    const getItemClasses = (isActive: boolean) => {
        const baseClasses = "flex items-center gap-3 rounded-lg transition-all duration-200 group relative";
        const activeClasses = "bg-sidebar-primary text-sidebar-primary-foreground shadow-md";
        const inactiveClasses = "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

        let sizeClasses = "px-3 py-2 text-sm";
        if (variant === "desktop") {
            sizeClasses = isCollapsed ? "justify-center px-2 py-3 mx-1" : "px-4 py-3 text-base";
        } else {
            sizeClasses = "px-3 py-2 text-sm";
        }

        return `${baseClasses} ${sizeClasses} ${isActive ? activeClasses : inactiveClasses}`;
    };

    const Tooltip = ({ label }: { label: string }) => (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
            {label}
        </div>
    );

    return (
        <ul className="space-y-1">
            {items.map((item) => {
                const Icon = iconMap[item.icon];
                const isActive = currentPath === item.id;

                return (
                    <li key={item.id}>
                        <Link
                            to={item.path}
                            onClick={onItemClick}
                            className={getItemClasses(isActive)}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${variant === "desktop" && !isCollapsed ? "group-hover:scale-110" : ""}`} />
                            {(!isCollapsed || variant === "mobile") && (
                                <span className="truncate">{item.label}</span>
                            )}
                            {isCollapsed && variant === "desktop" && (
                                <Tooltip label={item.label} />
                            )}
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};