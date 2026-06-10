import { ChevronLeft } from "lucide-react";
import { MenuItems } from "./MenuItems";
import { UserProfile } from "./UserProfile";

interface DesktopSidebarProps {
    menuItems: any[];
    currentPath: string;
    user: any;
    onLogout: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const DesktopSidebar = ({
                                   menuItems,
                                   currentPath,
                                   user,
                                   onLogout,
                                   isCollapsed,
                                   onToggleCollapse
                               }: DesktopSidebarProps) => {
    return (
        <aside
            className={`bg-sidebar h-full flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out relative
                ${isCollapsed ? 'w-20' : 'w-64'}`}
        >

            <button
                onClick={onToggleCollapse}
                className={`absolute top-1/2 -translate-y-1/2 -right-3 z-20 p-1 rounded-full bg-sidebar border border-sidebar-border text-sidebar-foreground 
                    hover:bg-sidebar-accent transition-all duration-200 hover:scale-105 shadow-md
                    ${isCollapsed ? 'rotate-180' : ''}`}
                aria-label={isCollapsed ? "Развернуть меню" : "Свернуть меню"}
            >
                <ChevronLeft className="w-3 h-3" />
            </button>

            <div className={`py-6 border-b border-sidebar-border flex-shrink-0 transition-all duration-300
                ${isCollapsed ? 'px-2' : 'px-4'}`}>
                {isCollapsed ? (
                    <div className="flex justify-center">
                        <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
                            <span className="text-sidebar-primary-foreground font-bold text-lg">G</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-sidebar-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <span className="text-sidebar-primary-foreground font-bold text-xl">G</span>
                        </div>
                        <div className="overflow-hidden">
                            <h1 className="text-sidebar-foreground text-xl font-bold truncate">GoTrack</h1>
                            <p className="text-xs text-sidebar-foreground/60 truncate">Учёт поездок</p>
                        </div>
                    </div>
                )}
            </div>

            <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2 py-4' : 'px-2 py-4'}`}>
                <MenuItems
                    items={menuItems}
                    currentPath={currentPath}
                    isCollapsed={isCollapsed}
                />
            </div>

            <div className="flex-shrink-0">
                <UserProfile
                    user={user}
                    onLogout={onLogout}
                    isCollapsed={isCollapsed}
                />
            </div>
        </aside>
    );
};