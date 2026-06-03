import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { initDatabase } from './config/database';
import authRoutes from './routes/authRoutes';
import tripRoutes from './routes/tripRoutes';
import reportRoutes from './routes/reportRoutes';
import settingsRoutes from './routes/settingsRoutes';
import { errorHandler } from './middleware/errorHandler';
import { initEmailService } from './services/emailService';
import adminRoutes from './routes/adminRoutes';

const fastify = Fastify({ logger: true });

const start = async () => {
    try {
        await initDatabase();
        await initEmailService();

        await fastify.register(cors, {
            origin: 'http://localhost:5173',
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        });

        await fastify.register(jwt, {
            secret: process.env.JWT_SECRET || 'your-secret-key-change-this',
            sign: { expiresIn: '7d' }
        });

        // Регистрация всех роутов
        fastify.register(authRoutes, { prefix: '/api/auth' });
        fastify.register(tripRoutes, { prefix: '/api/trips' });
        fastify.register(reportRoutes, { prefix: '/api/reports' });
        fastify.register(settingsRoutes, { prefix: '/api/settings' });
        fastify.register(adminRoutes, { prefix: '/api/admin' });

        fastify.setErrorHandler(errorHandler);

        fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

        await fastify.listen({ port: 3001, host: '0.0.0.0' });
        console.log('🚀 API Server running on http://localhost:3001');
        console.log('✅ Available routes:');
        console.log('  - POST /api/auth/register');
        console.log('  - POST /api/auth/login');
        console.log('  - GET  /api/auth/me');
        console.log('  - GET  /api/trips');
        console.log('  - POST /api/trips');
        console.log('  - DELETE /api/trips/:id');
        console.log('  - GET  /api/settings');
        console.log('  - PUT  /api/settings');
        console.log('  - PUT  /api/settings/profile');
    } catch (err) {
        console.error('❌ Server error:', err);
        process.exit(1);
    }
};

start();