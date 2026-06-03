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
        const { name, car_model, car_year, license_plate } = data;
        return run(
            'UPDATE users SET name = ?, car_model = ?, car_year = ?, license_plate = ? WHERE id = ?',
            [name, car_model, car_year, license_plate, id]
        );
    }
};