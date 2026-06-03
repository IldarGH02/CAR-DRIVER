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
    findByEmail: async (email: string): Promise<UserWithPassword | undefined> => {
        return await get('SELECT * FROM users WHERE email = ?', [email]);
    },

    findById: async (id: number): Promise<Omit<User, 'created_at'> | undefined> => {
        const result = await get(
            `SELECT id, email, name, role, car_model, car_year, license_plate, created_at
             FROM users WHERE id = ?`,
            [id]
        );

        if (result) {
            const { created_at, ...userWithoutCreatedAt } = result;
            return userWithoutCreatedAt;
        }
        return undefined;
    },

    findAll: async (): Promise<Omit<User, 'created_at'>[]> => {
        const users = await all(
            `SELECT id, email, name, role, car_model, car_year, license_plate, created_at
             FROM users ORDER BY created_at DESC`
        );
        return users.map((user: any) => {
            const { created_at, ...userWithoutCreatedAt } = user;
            return {
                ...userWithoutCreatedAt,
                carModel: user.car_model,
                carYear: user.car_year,
                licensePlate: user.license_plate
            };
        });
    },

    create: async (email: string, password: string, name: string, role: string = 'user'): Promise<{ id: number; email: string; name: string; role: string }> => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await run(
            'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, name, role]
        );

        await run('INSERT INTO settings (user_id) VALUES (?)', [result.lastID]);

        return { id: result.lastID, email, name, role };
    },

    update: async (id: number, data: Partial<User>): Promise<void> => {
        const fields: string[] = [];
        const values: any[] = [];

        if (data.name !== undefined) {
            fields.push('name = ?');
            values.push(data.name);
        }
        if (data.role !== undefined) {
            fields.push('role = ?');
            values.push(data.role);
        }
        if (data.car_model !== undefined) {
            fields.push('car_model = ?');
            values.push(data.car_model);
        }
        if (data.car_year !== undefined) {
            fields.push('car_year = ?');
            values.push(data.car_year);
        }
        if (data.license_plate !== undefined) {
            fields.push('license_plate = ?');
            values.push(data.license_plate);
        }

        if (fields.length === 0) return;

        values.push(id);
        await run(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    },

    delete: async (id: number): Promise<void> => {
        await run('DELETE FROM users WHERE id = ?', [id]);
    },

    getSettings: async (userId: number) => {
        const settings = await get('SELECT * FROM settings WHERE user_id = ?', [userId]);

        if (settings) {
            return {
                ...settings,
                notifications: settings.notifications === 1,
                auto_save: settings.auto_save === 1
            };
        }
        return null;
    },

    createSettings: async (userId: number): Promise<void> => {
        await run(
            `INSERT INTO settings (user_id, currency, distance_unit, fuel_unit, amortization_rate, notifications, auto_save) 
       VALUES (?, 'RUB', 'km', 'liters', 2.68, 1, 1)`,
            [userId]
        );
    },

    updateSettings: async (userId: number, data: any): Promise<void> => {
        const fields: string[] = [];
        const values: any[] = [];

        if (data.currency !== undefined) {
            fields.push('currency = ?');
            values.push(data.currency);
        }
        if (data.distance_unit !== undefined) {
            fields.push('distance_unit = ?');
            values.push(data.distance_unit);
        }
        if (data.fuel_unit !== undefined) {
            fields.push('fuel_unit = ?');
            values.push(data.fuel_unit);
        }
        if (data.amortization_rate !== undefined) {
            fields.push('amortization_rate = ?');
            values.push(data.amortization_rate);
        }
        if (data.notifications !== undefined) {
            fields.push('notifications = ?');
            values.push(data.notifications ? 1 : 0);
        }
        if (data.auto_save !== undefined) {
            fields.push('auto_save = ?');
            values.push(data.auto_save ? 1 : 0);
        }

        if (fields.length === 0) return;

        values.push(userId);
        await run(`UPDATE settings SET ${fields.join(', ')} WHERE user_id = ?`, values);
    },

    verifyPassword: async (password: string, hash: string): Promise<boolean> => {
        return await bcrypt.compare(password, hash);
    }
};