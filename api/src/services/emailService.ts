// services/emailService.ts
import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

const initTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ Email credentials not configured. Email sending disabled.');
        return null;
    }

    try {
        const smtpConfig = {
            host: process.env.EMAIL_HOST || 'smtp.mail.ru',
            port: parseInt(process.env.EMAIL_PORT || '465'),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        };

        transporter = nodemailer.createTransport(smtpConfig);

        return transporter;
    } catch (error) {
        console.warn('⚠️ Failed to initialize email transporter:', error);
        return null;
    }
};

export const sendEmail = async (to: string, subject: string, html: string) => {
    if (!transporter && !initTransporter()) {
        console.log('📧 Email not sent - service disabled');
        return { success: false, message: 'Email service not configured' };
    }

    if (!transporter) {
        return { success: false, message: 'Email service not available' };
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to,
            subject,
            html
        });

        console.log('✅ Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Email sending error:', error);
        return { success: false, message: error.message };
    }
};

// ИСПРАВЛЕННАЯ ВЕРСИЯ - возвращает строку (previewUrl) как ожидает контроллер
export const sendVerificationCode = async (email: string, code: string): Promise<string> => {
    const subject = 'Код подтверждения';
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Код подтверждения</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .code { font-size: 32px; font-weight: bold; color: #4F46E5; padding: 10px; background: #F3F4F6; border-radius: 8px; display: inline-block; margin: 20px 0; }
                .footer { font-size: 12px; color: #6B7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Подтверждение email</h1>
                <p>Здравствуйте!</p>
                <p>Ваш код подтверждения:</p>
                <div class="code">${code}</div>
                <p>Код действителен в течение <strong>10 минут</strong>.</p>
                <p>Если вы не запрашивали этот код, просто проигнорируйте это письмо.</p>
                <div class="footer">
                    <p>Это автоматическое сообщение, пожалуйста, не отвечайте на него.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const result = await sendEmail(email, subject, html);

    // Возвращаем строку, как ожидает контроллер
    if (result.success && 'messageId' in result) {
        return result.messageId; // Возвращаем messageId как строку
    }

    // Если email не настроен, возвращаем mock URL для разработки
    console.log(`📧 Mock email would send code ${code} to ${email}`);
    return `https://ethereal.email/mock/${Date.now()}`;
};

// Инициализируем при старте
initTransporter();