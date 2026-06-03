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

export const UserModel = {
    findByEmail: async (email: string) => {
        return get('SELECT * FROM users WHERE email = ?', [email]);
    },

    findById: async (id: number) => {
        return get('SELECT * FROM users WHERE id = ?', [id]);
    },

    // НОВЫЙ МЕТОД: получить всех пользователей
    findAll: async () => {
        return all('SELECT id, email, name, role, car_model, car_year, license_plate, created_at FROM users ORDER BY id DESC');
    },

    create: async (email: string, password: string, name: string) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await run(
            'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, "user")',
            [email, hashedPassword, name]
        );
        return { id: result.lastID, email, name };
    },

    verifyPassword: async (password: string, hashedPassword: string) => {
        return bcrypt.compare(password, hashedPassword);
    },

    update: async (id: number, data: any) => {
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

    // НОВЫЙ МЕТОД: удалить пользователя
    delete: async (id: number) => {
        // Удаляем связанные данные
        await run('DELETE FROM trips WHERE user_id = ?', [id]);
        await run('DELETE FROM settings WHERE user_id = ?', [id]);
        // Удаляем пользователя
        const result = await run('DELETE FROM users WHERE id = ?', [id]);
        return { lastID: result.lastID, changes: result.changes };
    }
};