import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { runMigrations } from './migrate.js';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getDbPath = (): string => {
    if (process.env.DB_PATH) {
        return process.env.DB_PATH;
    }

    if (process.env.NODE_ENV === 'production') {
        return '/app/api/data/database.sqlite';
    }

    return path.resolve(process.cwd(), 'data', 'database.sqlite');
};

const dbPath = getDbPath();

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true, mode: 0o755 });
}

fs.accessSync(dbDir, fs.constants.W_OK);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

export const run = (sql: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
};

export const get = (sql: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

export const all = (sql: string, params: any[] = []): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
};

const ensureAdminUser = async (): Promise<void> => {
    const adminEmail = 'kooooooffe@gmail.com';
    const adminPassword = 'az27AL96darikBL';

    const existingUser = await get('SELECT id, role FROM users WHERE email = ?', [adminEmail]);

    if (existingUser) {
        if (existingUser.role !== 'admin') {
            await run('UPDATE users SET role = "admin" WHERE id = ?', [existingUser.id]);
        }
    } else {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await run(
            `INSERT INTO users (email, password, name, role, created_at) 
             VALUES (?, ?, 'Administrator', 'admin', datetime('now'))`,
            [adminEmail, hashedPassword]
        );
    }
};

export const initDatabase = async (): Promise<void> => {
    await runMigrations();

    await run(`
        CREATE TABLE IF NOT EXISTS verification_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            code TEXT NOT NULL,
            expires_at DATETIME NOT NULL,
            used INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await run(`CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes(expires_at)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_trips_user_id ON trips(user_id)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_trips_date ON trips(date)`);

    await ensureAdminUser();
};