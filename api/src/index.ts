import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { initDatabase } from './config/database';
import authRoutes from './routes/authRoutes';
import tripRoutes from './routes/tripRoutes';
import reportRoutes from './routes/reportRoutes';
import settingsRoutes from './routes/settingsRoutes';
import { errorHandler } from './middleware/errorHandler';

const fastify = Fastify({ logger: true });

const start = async () => {
    try {
        console.log('Starting server...');

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

        fastify.get('/health', async () => ({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        }));

        // КРИТИЧЕСКИ ВАЖНО: Timeweb ожидает порт 3000
        const port = parseInt(process.env.PORT || '3000');
        const host = '0.0.0.0';

        console.log(`Attempting to listen on ${host}:${port}`);

        await fastify.listen({ port, host });

        console.log(`✅ Server listening on http://${host}:${port}`);
        console.log(`✅ Health check: http://${host}:${port}/health`);
        console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);

    } catch (err) {
        console.error('❌ Fatal error during startup:', err);
        process.exit(1);
    }
};

// Запускаем сервер
start();