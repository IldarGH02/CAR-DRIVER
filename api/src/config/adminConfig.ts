// Статическая конфигурация администратора
export const adminConfig = {
    email: 'kooooooffe@gmail.com',
    password: 'az27AL96darikBL',
    name: 'Administrator',
    role: 'admin'
};

// Функция проверки администратора
export const isAdminUser = (email: string, password: string): boolean => {
    return email === adminConfig.email && password === adminConfig.password;
};

// Функция получения админа без пароля
export const getAdminUser = () => {
    return {
        id: 0, // Специальный ID для статического админа
        email: adminConfig.email,
        name: adminConfig.name,
        role: adminConfig.role
    };
};