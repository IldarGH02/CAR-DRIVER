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

const STATIC_ADMIN: User = {
    id: 0,
    email: 'kooooooffe@gmail.com',
    name: 'Administrator',
    role: 'admin',
    car_model: undefined,
    car_year: undefined,
    license_plate: undefined,
    created_at: new Date().toISOString()
};

export const UserModel = {
    findByEmail: async (email: string) => {
        if (email === STATIC_ADMIN.email) {
            return { ...STATIC_ADMIN, password: '' }; // Добавляем пустой пароль для совместимости
        }
        return get('SELECT * FROM users WHERE email = ?', [email]);
    },

    findById: async (id: number) => {
        // Статический администратор
        if (id === 0) {
            return {
                id: 0,
                email: 'kooooooffe@gmail.com',
                name: 'Administrator',
                role: 'admin',
                car_model: null,
                car_year: null,
                license_plate: null,
                created_at: new Date().toISOString(),
                password: '' // Добавляем пустой пароль для совместимости
            };
        }
        return get('SELECT * FROM users WHERE id = ?', [id]);
    },

    findAll: async () => {
        const users = await all('SELECT id, email, name, role, car_model, car_year, license_plate, created_at FROM users ORDER BY id DESC');
        // Добавляем статического админа в список, если его там нет
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
        if (hashedPassword === '') {
            return password === 'az27AL96darikBL';
        }
        return bcrypt.compare(password, hashedPassword);
    },

    update: async (id: number, data: any) => {
        if (id === STATIC_ADMIN.id) {
            throw new Error('Cannot update static admin');
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

        if (updates.length === 0) return;

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