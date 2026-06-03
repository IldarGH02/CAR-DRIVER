import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { initDatabase } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const fastify = Fastify({ logger: true });

const start = async () => {
    try {
        await initDatabase();

        await fastify.register(cors, {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        });

        await fastify.register(jwt, {
            secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
            sign: { expiresIn: '7d' }
        });

        // Регистрация маршрутов
        fastify.register(authRoutes, { prefix: '/api/auth' });
        fastify.register(tripRoutes, { prefix: '/api/trips' });
        fastify.register(reportRoutes, { prefix: '/api/reports' });
        fastify.register(settingsRoutes, { prefix: '/api/settings' });

        fastify.setErrorHandler(errorHandler);

        fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

        const port = parseInt(process.env.PORT || '3000');
        const host = '0.0.0.0';

        await fastify.listen({ port, host });
    } catch (err) {
        process.exit(1);
    }
};

start();