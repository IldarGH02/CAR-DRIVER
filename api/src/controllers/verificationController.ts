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
        // Помечаем старые неиспользованные коды как использованные
        await run(
            'UPDATE verification_codes SET used = 1 WHERE email = ? AND used = 0',
            [email]
        );

        const code = generateCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        console.log(`📝 Saving verification code for ${email}: ${code}`);

        await run(
            'INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)',
            [email, code, expiresAt.toISOString()]
        );

        const previewUrl = await sendVerificationCode(email, code);

        return reply.send({
            success: true,
            message: 'Verification code sent',
            previewUrl,
        });
    } catch (error) {
        console.error('Send code error:', error);
        return reply.code(500).send({ success: false, message: 'Failed to send verification code' });
    }
};

export const verifyCode = async (request: FastifyRequest<{ Body: { email: string; code: string } }>, reply: FastifyReply) => {
    const { email, code } = request.body;

    console.log(`🔍 Verifying code for ${email}: ${code}`);

    if (!email || !code) {
        return reply.code(400).send({ success: false, message: 'Email and code are required' });
    }

    try {
        // Ищем код в БД
        const result = await get(
            `SELECT * FROM verification_codes 
             WHERE email = ? 
             AND code = ? 
             AND used = 0 
             AND expires_at > datetime('now')`,
            [email, code]
        );

        console.log(`🔍 Query result:`, result);

        if (!result) {
            return reply.code(400).send({ success: false, message: 'Invalid or expired code' });
        }

        // Помечаем код как использованный
        await run('UPDATE verification_codes SET used = 1 WHERE id = ?', [result.id]);

        // 👇 НАХОДИМ ПОЛЬЗОВАТЕЛЯ И ГЕНЕРИРУЕМ ТОКЕН
        const user = await get('SELECT id, email, name, role FROM users WHERE email = ?', [email]);

        if (!user) {
            return reply.code(404).send({ success: false, message: 'User not found' });
        }

        // Генерируем JWT токен
        const token = await reply.jwtSign({ id: user.id, email: user.email });

        console.log(`✅ User ${email} verified and logged in`);

        return reply.send({
            success: true,
            message: 'Code verified successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Verify code error:', error);
        return reply.code(500).send({ success: false, message: 'Failed to verify code' });
    }
};