import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { sendCode, verifyCode } from '../controllers/verificationController';

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/register', authController.register);
    fastify.post('/login', authController.login);
    fastify.get('/me', { preHandler: authenticate }, authController.getMe);

    // Новые маршруты для верификации
    fastify.post('/send-code', sendCode);
    fastify.post('/verify-code', verifyCode);
}