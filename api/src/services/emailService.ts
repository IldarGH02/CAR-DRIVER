import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

const initTransporter = () => {
    const host = process.env.EMAIL_HOST;
    const port = parseInt(process.env.EMAIL_PORT || '2525');
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    const secure = process.env.EMAIL_SECURE === 'true';

    if (!host || !user || !pass) {
        console.error('❌ Email configuration missing in .env file');
        console.error('   Required: EMAIL_HOST, EMAIL_USER, EMAIL_PASS');
        return;
    }

    console.log('📧 Configuring email transporter...');
    console.log(`   Host: ${host}:${port}`);
    console.log(`   User: ${user}`);
    console.log(`   Secure: ${secure}`);

    transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: secure,
        auth: {
            user: user,
            pass: pass,
        },
        tls: {
            rejectUnauthorized: false,
        },
        requireTLS: true,
    });

    // Проверяем соединение
    transporter.verify((error, success) => {
        if (error) {
            console.error('❌ Email transporter verification failed:', error);
            console.log('💡 Troubleshooting tips for Timeweb:');
            console.log('   1. Check if email exists: inbox@rugotrack.ru');
            console.log('   2. Try port 25 or 587 instead of 2525');
            console.log('   3. Check if SMTP is enabled in Timeweb panel');
            console.log('   4. Verify password is correct');
        } else {
            console.log('✅ Email transporter configured and verified');
        }
    });
};

export const sendVerificationCode = async (email: string, code: string): Promise<string | undefined> => {
    if (!transporter) {
        console.error('❌ Transporter not initialized, attempting to initialize...');
        initTransporter();

        if (!transporter) {
            throw new Error('Email service not configured');
        }
    }

    const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;

    try {
        console.log(`📧 Sending verification code to ${email}...`);

        const info = await transporter.sendMail({
            from: `"GoTrack" <${fromEmail}>`,
            to: email,
            subject: 'Код подтверждения - GoTrack',
            text: `Ваш код подтверждения: ${code}\n\nКод действителен в течение 10 минут.\n\nЕсли вы не запрашивали этот код, просто проигнорируйте это письмо.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">Код подтверждения</h2>
                    <p>Ваш код подтверждения для сервиса GoTrack:</p>
                    <div style="background: #f4f4f4; padding: 20px; font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px;">
                        ${code}
                    </div>
                    <p>Код действителен в течение <strong>10 минут</strong>.</p>
                    <p>Если вы не запрашивали этот код, просто проигнорируйте это письмо.</p>
                    <hr style="margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">© GoTrack. Все права защищены.</p>
                </div>
            `,
        });

        console.log(`✅ Email sent to ${email}, messageId: ${info.messageId}`);

        return undefined;
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        throw new Error(`Failed to send verification code: ${error.message}`);
    }
};

// Инициализируем
initTransporter();