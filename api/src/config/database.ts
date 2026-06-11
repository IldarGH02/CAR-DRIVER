import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { runMigrations } from './migrate.js';
import bcrypt from 'bcryptjs';
import { restoreDatabase, backupDatabase, setupAutoBackup } from '../services/backupService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getDbPath = (): string => {
    if (process.env.DB_PATH) {
        return process.env.DB_PATH;
    }
    return path.resolve(process.cwd(), 'data', 'database.sqlite');
};

const dbPath = getDbPath();
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true, mode: 0o755 });
}

// Функция для проверки, существует ли уже БД с данными
const isDatabaseExists = (): boolean => {
    return fs.existsSync(dbPath);
};

const initBackup = async () => {
    if (process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY) {
        console.log('🔄 Checking for existing backup...');

        // Восстанавливаем БД только если файл не существует
        if (!isDatabaseExists()) {
            console.log('Database file not found, restoring from backup...');
            await restoreDatabase();
        } else {
            console.log('Database file exists, checking if it has data...');
            // Проверяем, есть ли данные в БД
            const hasData = await checkIfDatabaseHasData();
            if (!hasData) {
                console.log('Database is empty, restoring from backup...');
                await restoreDatabase();
            } else {
                console.log('Database has data, skipping restore');
            }
        }

        setupAutoBackup();
    } else {
        console.log('ℹ️ S3 not configured, backups disabled');
    }
};

// Функция для проверки наличия данных в БД
const checkIfDatabaseHasData = async (): Promise<boolean> => {
    if (!fs.existsSync(dbPath)) return false;

    try {
        // Временное подключение для проверки
        const tempDb = new sqlite3.Database(dbPath);
        const result = await new Promise((resolve) => {
            tempDb.get("SELECT COUNT(*) as count FROM users", (err, row) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(row);
                }
            });
        });
        tempDb.close();

        const count = (result as any)?.count || 0;
        console.log(`Found ${count} users in database`);
        return count > 0;
    } catch (error) {
        console.error('Error checking database:', error);
        return false;
    }
};

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

    try {
        const existingUser = await get('SELECT id, role FROM users WHERE email = ?', [adminEmail]);

        if (existingUser) {
            if (existingUser.role !== 'admin') {
                await run('UPDATE users SET role = "admin" WHERE id = ?', [existingUser.id]);
                console.log('✅ User promoted to admin');
            }
        } else {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await run(
                `INSERT INTO users (email, password, name, role, created_at)
                 VALUES (?, ?, 'Administrator', 'admin', datetime('now'))`,
                [adminEmail, hashedPassword]
            );
            console.log('✅ Admin user created');
        }
    } catch (error) {
        console.error('Failed to ensure admin user:', error);
    }
};

export const initDatabase = async (): Promise<void> => {
    console.log('=== INITIALIZING DATABASE ===');

    // Сначала проверяем и восстанавливаем из бэкапа если нужно
    await initBackup();

    // Запускаем миграции (они безопасны - CREATE TABLE IF NOT EXISTS)
    await runMigrations();

    // Создаем дополнительные таблицы
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

    // Создаем админа только если его нет
    await ensureAdminUser();

    // Делаем бэкап текущего состояния
    await backupDatabase();

    console.log('=== DATABASE INITIALIZATION COMPLETE ===');
};