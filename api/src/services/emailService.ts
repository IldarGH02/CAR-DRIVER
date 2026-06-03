import nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter;

export const initEmailService = async () => {
    // Проверяем наличие переменных окружения
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('❌ EMAIL_USER or EMAIL_PASS not set in .env file');
        return;
    }

    // Настройки для Yandex
    transporter = nodemailer.createTransport({
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    // Проверяем подключение
    try {
        await transporter.verify();
        console.log('📧 Email service initialized (Yandex)');
        console.log(`📧 Using email: ${process.env.EMAIL_USER}`);
    } catch (error) {
        console.error('❌ Email service connection failed:', error);
    }
};

export const sendVerificationCode = async (email: string, code: string): Promise<string | null> => {
    if (!transporter) {
        await initEmailService();
    }

    if (!transporter) {
        console.error('❌ Transporter not initialized');
        return null;
    }

    try {
        const info = await transporter.sendMail({
            from: `"CAR-DRIVER" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Подтверждение регистрации в CAR-DRIVER',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="background-color: #2563eb; width: 50px; height: 50px; border-radius: 25px; display: inline-flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px;">🚗</span>
            </div>
            <h1 style="color: #1e293b; margin-top: 10px;">CAR-DRIVER</h1>
          </div>
          
          <h2 style="color: #1e293b;">Подтверждение регистрации</h2>
          
          <p style="color: #475569; line-height: 1.5;">
            Здравствуйте! Спасибо за регистрацию в сервисе CAR-DRIVER.
          </p>
          
          <p style="color: #475569; line-height: 1.5;">
            Для завершения регистрации введите следующий код подтверждения:
          </p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #2563eb;">${code}</span>
          </div>
          
          <p style="color: #475569; line-height: 1.5;">
            Код действителен в течение <strong>10 минут</strong>.
          </p>
          
          <p style="color: #475569; line-height: 1.5; margin-top: 20px;">
            Если вы не регистрировались в CAR-DRIVER, просто проигнорируйте это письмо.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            © 2024 CAR-DRIVER. Все права защищены.
          </p>
        </div>
      `,
            text: `
        Подтверждение регистрации в CAR-DRIVER
        
        Здравствуйте!
        Спасибо за регистрацию в сервисе CAR-DRIVER.
        
        Для завершения регистрации введите следующий код подтверждения:
        
        ${code}
        
        Код действителен в течение 10 минут.
        
        Если вы не регистрировались в CAR-DRIVER, просто проигнорируйте это письмо.
      `,
        });

        console.log('📧 Email sent:', info.messageId);
        return null;
    } catch (error) {
        console.error('❌ Email sending error:', error);
        return null;
    }
};