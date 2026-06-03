import { FastifyRequest, FastifyReply } from 'fastify';
import { get, run } from '../config/database';
import { sendVerificationCode } from '../services/emailService';

const generateCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendCode = async (request: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply) => {
    const { email } = request.body;

    if (!email) {
        return reply.code(400).send({ success: false, message: 'Email is required' });
    }

    try {
        const code = generateCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 минут

        // Сохраняем код в БД
        await run(
            'INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)',
            [email, code, expiresAt.toISOString()]
        );

        // Отправляем код на email
        const previewUrl = await sendVerificationCode(email, code);

        return reply.send({
            success: true,
            message: 'Verification code sent',
            previewUrl, // Только для теста на ethereal.email
        });
    } catch (error) {
        console.error('Send code error:', error);
        reply.code(500).send({ success: false, message: 'Failed to send verification code' });
    }
};

// Проверка кода верификации
export const verifyCode = async (request: FastifyRequest<{ Body: { email: string; code: string } }>, reply: FastifyReply) => {
    const { email, code } = request.body;

    if (!email || !code) {
        return reply.code(400).send({ success: false, message: 'Email and code are required' });
    }

    try {
        const result = await get(
            'SELECT * FROM verification_codes WHERE email = ? AND code = ? AND used = 0 AND expires_at > datetime("now")',
            [email, code]
        );

        if (!result) {
            return reply.code(400).send({ success: false, message: 'Invalid or expired code' });
        }

        // Помечаем код как использованный
        await run('UPDATE verification_codes SET used = 1 WHERE id = ?', [result.id]);

        return reply.send({ success: true, message: 'Code verified successfully' });
    } catch (error) {
        console.error('Verify code error:', error);
        reply.code(500).send({ success: false, message: 'Failed to verify code' });
    }
};