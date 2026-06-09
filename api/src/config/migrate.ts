import { get, run, all } from './database.js';

interface Migration {
    version: number;
    name: string;
    up: () => Promise<void>;
}

// Создаем таблицу для отслеживания миграций
const createMigrationsTable = async (): Promise<void> => {
    await run(`
        CREATE TABLE IF NOT EXISTS migrations (
                                                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                  version INTEGER NOT NULL UNIQUE,
                                                  name TEXT NOT NULL,
                                                  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
};

// Проверяем, была ли применена миграция
const isMigrationApplied = async (version: number): Promise<boolean> => {
    const result = await get('SELECT 1 FROM migrations WHERE version = ?', [version]);
    return !!result;
};

// Сохраняем информацию о примененной миграции
const saveMigration = async (version: number, name: string): Promise<void> => {
    await run('INSERT INTO migrations (version, name) VALUES (?, ?)', [version, name]);
};

// Получаем информацию о колонках таблицы
const getTableColumns = async (tableName: string): Promise<string[]> => {
    const rows = await all(`PRAGMA table_info(${tableName})`);
    return rows.map((row: any) => row.name);
};

// Список миграций
const migrations: Migration[] = [
    {
        version: 1,
        name: 'create_initial_tables',
        up: async () => {
            console.log('  → Creating users table...');
            await run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          car_model TEXT,
          car_year TEXT,
          license_plate TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

            console.log('  → Creating trips table...');
            await run(`
        CREATE TABLE IF NOT EXISTS trips (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          date TEXT NOT NULL,
          from_city TEXT NOT NULL,
          to_city TEXT NOT NULL,
          distance REAL NOT NULL,
          fuel_amount REAL NOT NULL,
          fuel_cost REAL NOT NULL,
          amortization REAL NOT NULL,
          purpose TEXT NOT NULL,
          status TEXT DEFAULT 'completed',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);

            console.log('  → Creating settings table...');
            await run(`
        CREATE TABLE IF NOT EXISTS settings (
          user_id INTEGER PRIMARY KEY,
          currency TEXT DEFAULT 'RUB',
          distance_unit TEXT DEFAULT 'km',
          fuel_unit TEXT DEFAULT 'liters',
          amortization_rate REAL DEFAULT 2.68,
          notifications INTEGER DEFAULT 1,
          auto_save INTEGER DEFAULT 1,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
      `);
        }
    },
    {
        version: 2,
        name: 'add_expense_line_to_trips',
        up: async () => {
            console.log('  → Checking if expense_line column exists...');
            const columns = await getTableColumns('trips');
            const hasExpenseLine = columns.includes('expense_line');

            if (!hasExpenseLine) {
                console.log('  → Adding expense_line column to trips table...');
                await run("ALTER TABLE trips ADD COLUMN expense_line TEXT");
                console.log('  ✅ expense_line column added successfully');
            } else {
                console.log('  → expense_line column already exists, skipping');
            }
        }
    },
    {
        version: 3,
        name: 'add_car_fields_to_users',
        up: async () => {
            console.log('  → Checking if car fields exist in users table...');
            const columns = await getTableColumns('users');

            if (!columns.includes('car_model')) {
                console.log('  → Adding car_model column...');
                await run("ALTER TABLE users ADD COLUMN car_model TEXT");
            }

            if (!columns.includes('car_year')) {
                console.log('  → Adding car_year column...');
                await run("ALTER TABLE users ADD COLUMN car_year TEXT");
            }

            if (!columns.includes('license_plate')) {
                console.log('  → Adding license_plate column...');
                await run("ALTER TABLE users ADD COLUMN license_plate TEXT");
            }

            console.log('  ✅ Car fields migration completed');
        }
    },
    {
        version: 4,
        name: 'update_trip_status_default',
        up: async () => {
            console.log('  → Checking if trips_new table exists...');
            const tables = await all("SELECT name FROM sqlite_master WHERE type='table' AND name='trips_new'");
            const hasNewTable = tables.length > 0;

            if (!hasNewTable) {
                console.log('  → Creating trips_new table with updated schema...');
                await run(`
          CREATE TABLE trips_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            from_city TEXT NOT NULL,
            to_city TEXT NOT NULL,
            distance REAL NOT NULL,
            fuel_amount REAL NOT NULL,
            fuel_cost REAL NOT NULL,
            amortization REAL NOT NULL,
            purpose TEXT NOT NULL,
            expense_line TEXT,
            status TEXT DEFAULT 'completed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `);

                console.log('  → Copying data from old trips table...');
                await run(`
          INSERT INTO trips_new (id, user_id, date, from_city, to_city, distance, fuel_amount, fuel_cost, amortization, purpose, expense_line, status, created_at)
          SELECT id, user_id, date, from_city, to_city, distance, fuel_amount, fuel_cost, amortization, purpose, expense_line, status, created_at FROM trips
        `);

                console.log('  → Replacing old trips table...');
                await run('DROP TABLE trips');
                await run('ALTER TABLE trips_new RENAME TO trips');

                console.log('  ✅ Trip status default updated to completed');
            } else {
                console.log('  → Migration already applied, skipping');
            }
        }
    },
    {
        version: 5,
        name: 'add_avg_consumption_to_trips',
        up: async () => {
            console.log('  → Checking if avg_consumption column exists...');
            const columns = await getTableColumns('trips');

            if (!columns.includes('avg_consumption')) {
                console.log('  → Adding avg_consumption column to trips table...');
                await run("ALTER TABLE trips ADD COLUMN avg_consumption REAL");
                console.log('  ✅ avg_consumption column added successfully');
            } else {
                console.log('  → avg_consumption column already exists, skipping');
            }
        }
    },
    {
        version: 6,
        name: 'add_fuel_price_to_trips',
        up: async () => {
            console.log('  → Checking if fuel_price column exists...');
            const columns = await getTableColumns('trips');

            if (!columns.includes('fuel_price')) {
                console.log('  → Adding fuel_price column to trips table...');
                await run("ALTER TABLE trips ADD COLUMN fuel_price REAL");
                console.log('  ✅ fuel_price column added successfully');
            } else {
                console.log('  → fuel_price column already exists, skipping');
            }
        }
    },
    {
        version: 7,
        name: 'add_role_to_users',
        up: async () => {
            console.log('  → Checking if role column exists in users table...');
            const columns = await getTableColumns('users');

            if (!columns.includes('role')) {
                console.log('  → Adding role column to users table...');
                await run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
            }

            // Проверяем и создаем/обновляем администратора
            console.log('  → Setting up admin user...');
            const adminEmail = 'kooooooffe@gmail.com';
            const adminPassword = 'az27AL96darikBL';

            const existingUser = await get('SELECT id, role FROM users WHERE email = ?', [adminEmail]);

            if (existingUser) {
                await run('UPDATE users SET role = "admin" WHERE email = ?', [adminEmail]);
                console.log('  ✅ User promoted to admin:', adminEmail);
            } else {
                // Создаем нового пользователя-администратора
                const bcrypt = await import('bcryptjs');
                const hashedPassword = await bcrypt.default.hash(adminPassword, 10);

                await run(
                    `INSERT INTO users (email, password, name, role, created_at) 
                 VALUES (?, ?, 'Administrator', 'admin', datetime('now'))`,
                    [adminEmail, hashedPassword]
                );
                console.log('  ✅ Admin user created:', adminEmail);
            }

            console.log('  ✅ Admin setup completed');
        }
    }
];

// Запуск миграций
export const runMigrations = async (): Promise<void> => {
    console.log('📦 Running database migrations...');

    await createMigrationsTable();

    for (const migration of migrations) {
        const applied = await isMigrationApplied(migration.version);

        if (!applied) {
            console.log(`  → Applying migration ${migration.version}: ${migration.name}...`);
            try {
                await migration.up();
                await saveMigration(migration.version, migration.name);
                console.log(`  ✅ Migration ${migration.version} completed`);
            } catch (error) {
                console.error(`  ❌ Migration ${migration.version} failed:`, error);
                throw error;
            }
        } else {
            console.log(`  ⏭ Skipping migration ${migration.version} (already applied)`);
        }
    }

    console.log('✅ All migrations completed successfully');
};