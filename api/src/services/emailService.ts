// services/emailService.ts
import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

const initTransporter = () => {
    // Проверяем наличие необходимых переменных
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('⚠️ Email credentials not configured. Email sending disabled.');
        return null;
    }

    try {
        const smtpConfig = {
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        };

        transporter = nodemailer.createTransport(smtpConfig);

        // Проверяем конфигурацию только если есть credentials
        if (process.env.NODE_ENV !== 'production') {
            transporter.verify((error, success) => {
                if (error) {
                    console.warn('⚠️ Email service verification failed:', error.message);
                } else {
                    console.log('✅ Email service ready');
                }
            });
        }

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

// Инициализируем при старте
initTransporter();