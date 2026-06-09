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

const fastify = Fastify({
    logger: process.env.NODE_ENV === 'development',
    trustProxy: true
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
        await initDatabase();

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
                    cb(new Error('Not allowed by CORS'), false);
                }
            },
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
        });

        await fastify.register(jwt, {
            secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
            sign: { expiresIn: '7d' }
        });

        await fastify.register(authRoutes, { prefix: '/api/auth' });
        await fastify.register(tripRoutes, { prefix: '/api/trips' });
        await fastify.register(reportRoutes, { prefix: '/api/reports' });
        await fastify.register(settingsRoutes, { prefix: '/api/settings' });

        fastify.setErrorHandler(errorHandler);

        fastify.get('/health', async () => ({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        }));

        const port = parseInt(process.env.PORT || '3000');
        const host = process.env.HOST || '0.0.0.0';

        await fastify.listen({ port, host });

    } catch (err) {
        console.error('Fatal error during startup:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', () => {
    fastify.close(() => process.exit(0));
});

process.on('SIGINT', () => {
    fastify.close(() => process.exit(0));
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});

start();