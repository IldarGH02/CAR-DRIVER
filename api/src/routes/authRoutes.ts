import { FastifyInstance } from 'fastify';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { sendCode, verifyCode } from '../controllers/verificationController';

export default async function authRoutes(fastify: FastifyInstance) {
    console.log('🔐 Registering auth routes...');

    fastify.post('/register', authController.register);
    fastify.post('/login', authController.login);
    fastify.get('/me', { preHandler: authenticate }, authController.getMe);

    fastify.post('/send-code', sendCode);
    fastify.post('/verify-code', verifyCode);
}