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

console.log('Starting server...');
console.log(`PORT: ${process.env.PORT || '3000'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);

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
        console.log('🔧 Initializing database...');
        await initDatabase();
        console.log('✅ Database initialized');

        console.log('🔧 Registering CORS...');
        await fastify.register(cors, {
            origin: process.env.CLIENT_URL || '*',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        });
        console.log('✅ CORS registered');

        console.log('🔧 Registering JWT...');
        await fastify.register(jwt, {
            secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
            sign: { expiresIn: '7d' }
        });
        console.log('✅ JWT registered');

        console.log('🔧 Registering routes...');

        console.log('  → Auth routes');
        await fastify.register(authRoutes, { prefix: '/api/auth' });

        console.log('  → Trip routes');
        await fastify.register(tripRoutes, { prefix: '/api/trips' });

        console.log('  → Report routes');
        await fastify.register(reportRoutes, { prefix: '/api/reports' });

        console.log('  → Settings routes');
        await fastify.register(settingsRoutes, { prefix: '/api/settings' });

        console.log('✅ Routes registered');

        fastify.setErrorHandler(errorHandler);

        fastify.get('/health', async () => ({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        }));

        const port = parseInt(process.env.PORT || '3000');
        const host = process.env.HOST || '0.0.0.0';

        console.log(`Attempting to listen on ${host}:${port}`);

        await fastify.listen({ port, host });

        console.log(`✅ Server listening on http://${host}:${port}`);
        console.log(`✅ Health check: http://${host}:${port}/health`);
        console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);

    } catch (err) {
        console.error('❌ Fatal error during startup:', err);
        console.error('Error details:', err.message);
        if (err.stack) console.error('Stack:', err.stack);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, closing server...');
    fastify.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received, closing server...');
    fastify.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

// Обработка необработанных ошибок
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

start();