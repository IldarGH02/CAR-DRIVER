import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { runMigrations } from './migrate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Улучшенное определение пути к БД
const getDbPath = (): string => {
    // Приоритет у переменной окружения DB_PATH
    if (process.env.DB_PATH) {
        return process.env.DB_PATH;
    }

    // Для production окружения
    if (process.env.NODE_ENV === 'production') {
        return '/app/api/data/database.sqlite';
    }

    // Для development - абсолютный путь для избежания проблем
    return path.resolve(process.cwd(), 'data', 'database.sqlite');
};

const dbPath = getDbPath();
console.log(`📁 Database path: ${dbPath}`);

// Создаём директорию, если её нет
const dbDir = path.dirname(dbPath);
try {
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true, mode: 0o755 });
        console.log(`📁 Created database directory: ${dbDir}`);
    }

    // Проверяем права на запись в директорию
    fs.accessSync(dbDir, fs.constants.W_OK);
    console.log(`📁 Directory writable: ${dbDir}`);
} catch (error) {
    console.error(`❌ Cannot write to directory ${dbDir}:`, error);
    // Пробуем альтернативный путь
    const altPath = path.resolve(process.cwd(), 'database.sqlite');
    console.log(`📁 Trying alternative path: ${altPath}`);
    throw error;
}

// Создаем экземпляр базы данных с дополнительными опциями
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('❌ Failed to open database:', err);
        console.error(`❌ Database path: ${dbPath}`);
        console.error(`❌ Current working directory: ${process.cwd()}`);
        console.error(`❌ NODE_ENV: ${process.env.NODE_ENV}`);
    } else {
        console.log('✅ Database connection opened successfully');
    }
});

// Обработка ошибок при открытии БД
db.on('error', (err) => {
    console.error('❌ Database error event:', err);
});

// Функция для проверки соединения
export const checkConnection = async (): Promise<boolean> => {
    try {
        await get('SELECT 1');
        return true;
    } catch (error) {
        console.error('❌ Database connection check failed:', error);
        return false;
    }
};

// Обертка для run с лучшей обработкой ошибок
export const run = (sql: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                console.error('❌ SQL Error:', err.message);
                console.error('❌ SQL Query:', sql);
                console.error('❌ SQL Params:', params);
                reject(err);
            } else {
                resolve({ lastID: this.lastID, changes: this.changes });
            }
        });
    });
};

// Обертка для get с лучшей обработкой ошибок
export const get = (sql: string, params: any[] = []): Promise<any> => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                console.error('❌ SQL Get Error:', err.message);
                console.error('❌ SQL Query:', sql);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

// Обертка для all с лучшей обработкой ошибок
export const all = (sql: string, params: any[] = []): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error('❌ SQL All Error:', err.message);
                console.error('❌ SQL Query:', sql);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
};

// Транзакции
export const beginTransaction = async (): Promise<void> => {
    await run('BEGIN TRANSACTION');
};

export const commitTransaction = async (): Promise<void> => {
    await run('COMMIT');
};

export const rollbackTransaction = async (): Promise<void> => {
    await run('ROLLBACK');
};

// Инициализация базы данных
export const initDatabase = async (): Promise<void> => {
    try {
        console.log('🔧 Initializing database...');

        // Сначала проверяем соединение
        const isConnected = await checkConnection();
        if (!isConnected) {
            throw new Error('Cannot establish database connection');
        }

        // Запускаем миграции
        await runMigrations();

        // Создаем дополнительные таблицы
        await run(`
            CREATE TABLE IF NOT EXISTS verification_codes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                code TEXT NOT NULL,
                expires_at DATETIME NOT NULL,
                used BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Создаем индексы для оптимизации
        await run(`
            CREATE INDEX IF NOT EXISTS idx_verification_codes_email 
            ON verification_codes(email)
        `);

        await run(`
            CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at 
            ON verification_codes(expires_at)
        `);

        // Проверка целостности базы данных
        const integrityCheck = await get('PRAGMA integrity_check');
        if (integrityCheck && integrityCheck.integrity_check === 'ok') {
            console.log('✅ Database integrity check passed');
        } else {
            console.warn('⚠️ Database integrity check warning:', integrityCheck);
        }

        console.log('✅ Database initialized successfully');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
};

// Закрытие соединения с БД
export const closeDatabase = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        db.close((err) => {
            if (err) {
                console.error('❌ Error closing database:', err);
                reject(err);
            } else {
                console.log('✅ Database connection closed');
                resolve();
            }
        });
    });
};

// Получение экземпляра БД для прямого доступа (с осторожностью)
export const getDb = () => db;

// Вспомогательная функция для проверки существования таблицы
export const tableExists = async (tableName: string): Promise<boolean> => {
    const result = await get(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
        [tableName]
    );
    return !!result;
};

// Вспомогательная функция для получения статистики БД
export const getDbStats = async () => {
    try {
        const pageCount = await get('PRAGMA page_count');
        const pageSize = await get('PRAGMA page_size');
        const freelistCount = await get('PRAGMA freelist_count');

        return {
            pageCount: pageCount?.page_count,
            pageSize: pageSize?.page_size,
            freelistCount: freelistCount?.freelist_count,
            sizeInMB: ((pageCount?.page_count || 0) * (pageSize?.page_size || 0)) / (1024 * 1024)
        };
    } catch (error) {
        console.error('Error getting DB stats:', error);
        return null;
    }
};

