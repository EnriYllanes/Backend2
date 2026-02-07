import nodemailer from 'nodemailer';
import config from '../config/config.js';

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.mailUser,
        pass: config.mailPass
    }
});

/**
 * ENVÍO DE MAIL DE RECUPERACIÓN
 */
export const sendRecoveryEmail = async (email, token) => {
    const link = `http://localhost:8080/api/sessions/password-reset?token=${token}`;
    
    try {
        await transport.sendMail({
            from: `Coderhouse Ecommerce <${config.mailUser}>`,
            to: email,
            subject: 'Restablece tu contraseña',
            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Restablecer tu contraseña</h2>
                    <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar:</p>
                    <a href="${link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Restablecer Contraseña
                    </a>
                    <p>Este enlace expirará en 1 hora.</p>
                </div>
            `
        });
        console.log(`✅ Mail de recuperación enviado a: ${email}`);
    } catch (error) {
        // Log crítico para debuggear si falla Gmail
        console.error("❌ ERROR SMTP:", error.code, error.response || error.message);
        throw new Error("No se pudo enviar el email de recuperación.");
    }
};