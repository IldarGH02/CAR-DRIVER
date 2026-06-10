import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { initDatabase } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import adminRoutes from './routes/adminRoutes.js';

const fastify = Fastify({
    logger: false, // Отключаем логгер в продакшене
    trustProxy: true,
    // Важно для Timeweb - увеличиваем таймауты
    connectionTimeout: 120000,
    keepAliveTimeout: 120000
});

fastify.decorate('authenticate', async (request, reply) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.code(401).send({ success: false, message: 'Unauthorized' });
    }
});

const start = async () => {
    try {
        console.log('🚀 Starting server...');

        await initDatabase();
        console.log('✅ Database initialized');

        await fastify.register(cors, {
            origin: (origin, cb) => {
                const allowedOrigins = [
                    'https://rugotrack.ru',
                    'https://www.rugotrack.ru',
                    'https://ildargh02-car-driver-2f75.twc1.net',
                    'https://ildargh02-car-driver-3fac.twc1.net',
                    'http://localhost:5173',
                    'http://localhost:3000'
                ];

                if (!origin || allowedOrigins.includes(origin)) {
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
        });
        console.log('✅ CORS registered');

        await fastify.register(jwt, {
            secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
            sign: { expiresIn: '7d' }
        });
        console.log('✅ JWT registered');

        await fastify.register(authRoutes, { prefix: '/api/auth' });
        await fastify.register(tripRoutes, { prefix: '/api/trips' });
        await fastify.register(reportRoutes, { prefix: '/api/reports' });
        await fastify.register(settingsRoutes, { prefix: '/api/settings' });
        await fastify.register(adminRoutes, { prefix: '/api/admin' });
        console.log('✅ Routes registered');

        fastify.setErrorHandler(errorHandler);

        fastify.get('/health', async () => ({
            status: 'ok',
            timestamp: new Date().toISOString()
        }));

        const port = parseInt(process.env.PORT || '3000');
        const host = '0.0.0.0';

        await fastify.listen({ port, host });

        console.log(`✅ Server running on port ${port}`);
        console.log(`✅ Health check: http://${host}:${port}/health`);

        // Важно для Timeweb App Platform - сигнал что сервер готов
        if (process.send) {
            process.send('ready');
        }

    } catch (err) {
        console.error('❌ Fatal error during startup:', err);
        process.exit(1);
    }
};

// Graceful shutdown для Timeweb App Platform
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing gracefully...');
    try {
        await fastify.close();
        console.log('Server closed');
        process.exit(0);
    } catch (err) {
        console.error('Error during close:', err);
        process.exit(1);
    }
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, closing gracefully...');
    try {
        await fastify.close();
        console.log('Server closed');
        process.exit(0);
    } catch (err) {
        console.error('Error during close:', err);
        process.exit(1);
    }
});

// Не выходим при необработанных ошибках, а логируем
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Не выходим, чтобы сервер продолжал работать
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    // Не выходим, чтобы сервер продолжал работать
});

start();