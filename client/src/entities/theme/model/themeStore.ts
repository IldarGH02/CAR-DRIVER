import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set) => ({
            theme: (localStorage.getItem('theme') as Theme) || 'light',
            setTheme: (theme) => {
                set({ theme });
                if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            },
            toggleTheme: () => {
                set((state) => {
                    const newTheme = state.theme === 'light' ? 'dark' : 'light';
                    if (newTheme === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                    return { theme: newTheme };
                });
            },
        }),
        {
            name: 'theme-storage',
        }
    )
);

const initTheme = () => {
    const savedTheme = localStorage.getItem('theme-storage');
    let theme: Theme = 'light';

    if (savedTheme) {
        try {
            const parsed = JSON.parse(savedTheme);
            theme = parsed.state?.theme || 'light';
        } catch (e) {
            console.error('Failed to parse theme:', e);
        }
    }

    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

initTheme();