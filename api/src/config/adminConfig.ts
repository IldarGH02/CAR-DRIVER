export const adminConfig = {
    email: 'kooooooffe@gmail.com',
    password: 'az27AL96darikBL',
    name: 'Administrator',
    role: 'admin'
};

export const isAdminUser = (email: string, password: string): boolean => {
    return email === adminConfig.email && password === adminConfig.password;
};

export const getAdminUser = () => {
    return {
        id: 0,
        email: adminConfig.email,
        name: adminConfig.name,
        role: adminConfig.role
    };
};