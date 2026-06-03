import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { initDatabase, closeDatabase } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const fastify = Fastify({
    logger: {
        level: process.env.LOG_LEVEL || 'info',
        transport: process.env.NODE_ENV === 'development' ? {
            target: 'pino-pretty',
            options: { translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' }
        } : undefined
    }
});

// Флаг для отслеживания состояния завершения
let isShuttingDown = false;

const start = async () => {
    try {
        console.log('Starting server...');
        console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
        console.log(`PORT: ${process.env.PORT || '3000'}`);

        await initDatabase();
        console.log('Database initialized');

        await fastify.register(cors, {
            origin: process.env.CLIENT_URL || '*',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        });
        console.log('CORS registered');

        await fastify.register(jwt, {
            secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
            sign: { expiresIn: '7d' }
        });
        console.log('JWT registered');

        // Регистрация маршрутов
        fastify.register(authRoutes, { prefix: '/api/auth' });
        fastify.register(tripRoutes, { prefix: '/api/trips' });
        fastify.register(reportRoutes, { prefix: '/api/reports' });
        fastify.register(settingsRoutes, { prefix: '/api/settings' });
        console.log('Routes registered');

        fastify.setErrorHandler(errorHandler);

        // Health check endpoint
        fastify.get('/health', async () => ({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            pid: process.pid
        }));

        // Корневой путь для проверки
        fastify.get('/', async () => ({
            message: 'API is running',
            version: '1.0.0',
            status: 'healthy'
        }));

        const port = parseInt(process.env.PORT || '3000');
        const host = process.env.HOST || '0.0.0.0';

        console.log(`Attempting to listen on ${host}:${port}`);

        await fastify.listen({ port, host });

        console.log(`✅ Server listening on http://${host}:${port}`);
        console.log(`✅ Health check: http://${host}:${port}/health`);
        console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`✅ PID: ${process.pid}`);

    } catch (err) {
        console.error('❌ Fatal error during startup:', err);
        process.exit(1);
    }
};

// Graceful shutdown функция
const gracefulShutdown = async (signal: string) => {
    if (isShuttingDown) {
        console.log('⚠️ Already shutting down, ignoring signal:', signal);
        return;
    }

    isShuttingDown = true;
    console.log(`\n📡 Received ${signal}, starting graceful shutdown...`);

    // Устанавливаем таймаут для принудительного завершения
    const forceExitTimeout = setTimeout(() => {
        console.error('❌ Graceful shutdown timeout, forcing exit...');
        process.exit(1);
    }, 30000); // 30 seconds timeout

    try {
        console.log('📡 Closing Fastify server...');
        await fastify.close();
        console.log('✅ Fastify server closed');

        console.log('📡 Closing database connection...');
        await closeDatabase();
        console.log('✅ Database connection closed');

        clearTimeout(forceExitTimeout);
        console.log('👋 Graceful shutdown completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during graceful shutdown:', error);
        clearTimeout(forceExitTimeout);
        process.exit(1);
    }
};

// Обработка сигналов завершения
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Обработка необработанных ошибок
process.on('uncaughtException', async (error) => {
    console.error('❌ Uncaught Exception:', error);
    await gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', async (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    await gracefulShutdown('unhandledRejection');
});

// Запускаем сервер
start().catch(async (error) => {
    console.error('❌ Failed to start server:', error);
    await gracefulShutdown('startupError');
});