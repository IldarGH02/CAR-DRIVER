import { useSidebar } from "./useSidebar";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileMenu } from "./MobileMenu";
import { MenuButton } from "./MenuButton";

interface SidebarProps {
    isAuthenticated: boolean;
}

export function Sidebar({ isAuthenticated }: SidebarProps) {
    const {
        isMobile,
        isMobileOpen,
        isCollapsed,
        user,
        currentPath,
        menuItems,
        handleLogout,
        closeMobileMenu,
        toggleMobileMenu,
        toggleCollapse,
    } = useSidebar();

    if (isMobile) {
        return (
            <>
                <MenuButton
                    onClick={toggleMobileMenu}
                    isAuthenticated={isAuthenticated}
                    isOpen={isMobileOpen}
                />
                <MobileMenu
                    isOpen={isMobileOpen}
                    onClose={closeMobileMenu}
                    menuItems={menuItems}
                    currentPath={currentPath}
                    user={user}
                    onLogout={handleLogout}
                    isAuthenticated={isAuthenticated}
                />
            </>
        );
    }

    return (
        <DesktopSidebar
            menuItems={menuItems}
            currentPath={currentPath}
            user={user}
            onLogout={handleLogout}
            isCollapsed={isCollapsed}
            onToggleCollapse={toggleCollapse}
        />
    );
}