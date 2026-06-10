import { get, run, all } from '../config/database';
import bcrypt from 'bcryptjs';

export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    car_model?: string;
    car_year?: string;
    license_plate?: string;
    created_at: string;
}

export interface UserWithPassword extends User {
    password: string;
}

// Статический администратор
const STATIC_ADMIN: UserWithPassword = {
    id: 0,
    email: 'kooooooffe@gmail.com',
    name: 'Administrator',
    role: 'admin',
    car_model: undefined,
    car_year: undefined,
    license_plate: undefined,
    created_at: new Date().toISOString(),
    password: ''
};

export const UserModel = {
    findByEmail: async (email: string) => {
        if (email === STATIC_ADMIN.email) {
            return STATIC_ADMIN;
        }
        return get('SELECT * FROM users WHERE email = ?', [email]);
    },

    findById: async (id: number) => {
        if (id === STATIC_ADMIN.id) {
            return STATIC_ADMIN;
        }
        return get('SELECT * FROM users WHERE id = ?', [id]);
    },

    findAll: async () => {
        const users = await all('SELECT id, email, name, role, car_model, car_year, license_plate, created_at FROM users ORDER BY id DESC');
        const hasStaticAdmin = users.some((u: any) => u.id === STATIC_ADMIN.id);
        if (!hasStaticAdmin) {
            return [STATIC_ADMIN, ...users];
        }
        return users;
    },

    create: async (email: string, password: string, name: string) => {
        if (email === STATIC_ADMIN.email) {
            throw new Error('This email is reserved');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await run(
            'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, "user")',
            [email, hashedPassword, name]
        );
        return { id: result.lastID, email, name };
    },

    verifyPassword: async (password: string, hashedPassword: string) => {
        // Для статического админа (пустой пароль) проверяем специальный пароль
        if (hashedPassword === '') {
            return password === 'az27AL96darikBL';
        }
        return bcrypt.compare(password, hashedPassword);
    },

    update: async (id: number, data: any) => {
        // Запрещаем обновление статического админа
        if (id === STATIC_ADMIN.id) {
            console.log('Blocked update attempt for static admin');
            return { lastID: 0, changes: 0 };
        }

        const { name, car_model, car_year, license_plate, role } = data;

        const updates = [];
        const values = [];

        if (name !== undefined) {
            updates.push('name = ?');
            values.push(name);
        }
        if (car_model !== undefined) {
            updates.push('car_model = ?');
            values.push(car_model);
        }
        if (car_year !== undefined) {
            updates.push('car_year = ?');
            values.push(car_year);
        }
        if (license_plate !== undefined) {
            updates.push('license_plate = ?');
            values.push(license_plate);
        }
        if (role !== undefined) {
            updates.push('role = ?');
            values.push(role);
        }

        if (updates.length === 0) return { lastID: id, changes: 0 };

        values.push(id);
        return run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    },

    delete: async (id: number) => {
        if (id === STATIC_ADMIN.id) {
            throw new Error('Cannot delete static admin');
        }

        await run('DELETE FROM trips WHERE user_id = ?', [id]);
        await run('DELETE FROM settings WHERE user_id = ?', [id]);
        const result = await run('DELETE FROM users WHERE id = ?', [id]);
        return { lastID: result.lastID, changes: result.changes };
    }
};