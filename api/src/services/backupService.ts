import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand, HeadBucketCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT || 'https://s3.twcstorage.ru',
    region: process.env.S3_REGION || 'ru-1',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
    },
    forcePathStyle: true,
});

const BUCKET_NAME = process.env.S3_BUCKET || '';
const DB_PATH = process.env.DB_PATH || './data/database.sqlite';

const checkBucket = async (): Promise<boolean> => {
    try {
        await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
        console.log(`✅ Bucket ${BUCKET_NAME} exists`);
        return true;
    } catch (error: any) {
        console.error(`❌ Bucket ${BUCKET_NAME} not accessible:`, error.message);
        return false;
    }
};

// Проверка, есть ли данные в БД
const hasDatabaseData = async (): Promise<boolean> => {
    if (!fs.existsSync(DB_PATH)) return false;

    try {
        const sqlite3 = await import('sqlite3');
        const db = new sqlite3.default.Database(DB_PATH);
        const result = await new Promise((resolve) => {
            db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
                db.close();
                if (err) resolve(0);
                else resolve((row as any)?.count || 0);
            });
        });
        return (result as number) > 0;
    } catch (error) {
        console.error('Error checking database:', error);
        return false;
    }
};

export const backupDatabase = async (): Promise<string | null> => {
    try {
        if (!BUCKET_NAME) {
            console.log('⚠️ No bucket name configured, skipping backup');
            return null;
        }

        const bucketExists = await checkBucket();
        if (!bucketExists) {
            console.log('⚠️ Bucket not available, skipping backup');
            return null;
        }

        if (!fs.existsSync(DB_PATH)) {
            console.log('⚠️ Database file not found, skipping backup');
            return null;
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupKey = `backups/database-${timestamp}.sqlite`;

        const fileContent = fs.readFileSync(DB_PATH);

        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: backupKey,
            Body: fileContent,
            ContentType: 'application/x-sqlite3',
        }));

        console.log(`✅ Database backed up to S3: ${backupKey}`);

        // Очищаем старые бэкапы (оставляем последние 10)
        await cleanOldBackups();

        return backupKey;
    } catch (error) {
        console.error('❌ Failed to backup database:', error);
        return null;
    }
};

// Очистка старых бэкапов
const cleanOldBackups = async (): Promise<void> => {
    try {
        const listResponse = await s3Client.send(new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: 'backups/',
        }));

        const backups = listResponse.Contents || [];

        if (backups.length > 10) {
            const sortedBackups = backups.sort((a, b) =>
                (a.LastModified?.getTime() || 0) - (b.LastModified?.getTime() || 0)
            );

            const backupsToDelete = sortedBackups.slice(0, backups.length - 10);

            for (const backup of backupsToDelete) {
                if (backup.Key) {
                    await s3Client.send(new DeleteObjectCommand({
                        Bucket: BUCKET_NAME,
                        Key: backup.Key,
                    }));
                    console.log(`🗑️ Deleted old backup: ${backup.Key}`);
                }
            }
        }
    } catch (error) {
        console.error('Failed to clean old backups:', error);
    }
};

export const restoreDatabase = async (): Promise<boolean> => {
    try {
        if (!BUCKET_NAME) {
            console.log('⚠️ No bucket name configured, skipping restore');
            return false;
        }

        // Если БД уже существует и имеет данные - не восстанавливаем
        if (fs.existsSync(DB_PATH)) {
            const hasData = await hasDatabaseData();
            if (hasData) {
                console.log('✅ Database already has data, skipping restore');
                return false;
            }
        }

        const bucketExists = await checkBucket();
        if (!bucketExists) {
            console.log('⚠️ Bucket not available, skipping restore');
            return false;
        }

        const listResponse = await s3Client.send(new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: 'backups/',
        }));

        const backups = listResponse.Contents || [];

        if (backups.length === 0) {
            console.log('ℹ️ No backups found');
            return false;
        }

        const latestBackup = backups.sort((a, b) =>
            (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0)
        )[0];

        if (!latestBackup.Key) {
            return false;
        }

        console.log(`🔄 Restoring from: ${latestBackup.Key}`);

        const getResponse = await s3Client.send(new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: latestBackup.Key,
        }));

        const body = await getResponse.Body?.transformToByteArray();

        if (body) {
            const dbDir = path.dirname(DB_PATH);
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }

            fs.writeFileSync(DB_PATH, Buffer.from(body));
            console.log('✅ Database restored successfully');
            return true;
        }

        return false;
    } catch (error) {
        console.error('❌ Failed to restore database:', error);
        return false;
    }
};

export const setupAutoBackup = () => {
    process.on('SIGTERM', async () => {
        console.log('SIGTERM received, backing up...');
        await backupDatabase();
        process.exit(0);
    });

    process.on('SIGINT', async () => {
        console.log('SIGINT received, backing up...');
        await backupDatabase();
        process.exit(0);
    });

    // Бэкап каждые 6 часов (вместо 24)
    setInterval(async () => {
        console.log('⏰ Scheduled backup...');
        await backupDatabase();
    }, 6 * 60 * 60 * 1000);
};