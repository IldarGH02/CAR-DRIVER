import {
    S3Client,
    PutObjectCommand,
    ListObjectsV2Command,
    GetObjectCommand,
    DeleteObjectCommand
} from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT || 'https://s3.timeweb.ru', // URL хранилища
    region: process.env.S3_REGION || 'ru-1',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || '',
        secretAccessKey: process.env.S3_SECRET_KEY || '',
    },
    forcePathStyle: true, // Нужно для некоторых S3-совместимых хранилищ
});

const BUCKET_NAME = process.env.S3_BUCKET || 'gotrack-backups';
const DB_PATH = process.env.DB_PATH || './data/database.sqlite';

// Создание бэкапа
export const backupDatabase = async (): Promise<string | null> => {
    try {
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

        await cleanOldBackups();

        return backupKey;
    } catch (error) {
        console.error('❌ Failed to backup database:', error);
        return null;
    }
};

export const restoreDatabase = async (): Promise<boolean> => {
    try {
        const listResponse = await s3Client.send(new ListObjectsV2Command({
            Bucket: BUCKET_NAME,
            Prefix: 'backups/',
        }));

        const backups = listResponse.Contents || [];

        if (backups.length === 0) {
            console.log('ℹ️ No backups found, starting with fresh database');
            return false;
        }

        // Сортируем по дате и берем последний
        const latestBackup = backups.sort((a, b) =>
            (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0)
        )[0];

        if (!latestBackup.Key) {
            console.log('ℹ️ No valid backup key found');
            return false;
        }

        console.log(`🔄 Restoring database from backup: ${latestBackup.Key}`);

        // Скачиваем бэкап
        const getResponse = await s3Client.send(new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: latestBackup.Key,
        }));

        const body = await getResponse.Body?.transformToByteArray();

        if (body) {
            // Создаем директорию если её нет
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

export const setupAutoBackup = () => {
    process.on('SIGTERM', async () => {
        console.log('SIGTERM received, backing up database...');
        await backupDatabase();
        process.exit(0);
    });

    process.on('SIGINT', async () => {
        console.log('SIGINT received, backing up database...');
        await backupDatabase();
        process.exit(0);
    });

    setInterval(async () => {
        console.log('⏰ Scheduled backup...');
        await backupDatabase();
    }, 24 * 60 * 60 * 1000);
};