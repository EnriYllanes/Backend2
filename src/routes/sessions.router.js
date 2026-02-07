import { Router } from 'express';
import passport from 'passport';
import { userService } from '../repositories/index.js';
import UserDTO from '../dto/user.dto.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { createHash, isValidPassword } from '../utils/hashPassword.js';
import { sendRecoveryEmail } from '../utils/mailer.js';

const router = Router();

/**
 * REGISTRO
 */
router.post('/register', passport.authenticate('register', { session: false }), async (req, res) => {
    res.send({ status: "success", message: "User registered" });
});

/**
 * LOGIN
 */
router.post('/login', passport.authenticate('login', { session: false }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Invalid credentials" });

    const token = jwt.sign({ 
        user: { 
            id: req.user._id, 
            email: req.user.email, 
            role: req.user.role 
        } 
    }, config.jwtSecret, { expiresIn: '24h' });

    res.cookie('coderCookieToken', token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true 
    }).send({ status: "success", payload: new UserDTO(req.user) });
});

/**
 * CURRENT
 */
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    const userDto = new UserDTO(req.user);
    res.send({ status: "success", payload: userDto });
});

/**
 * SOLICITAR RECUPERACIÓN
 */
router.post('/password-reset-request', async (req, res) => {
    const { email } = req.body;
    try {
        // CORRECCIÓN: Usamos getUser({ email }) que es el método real de tu repository
        const user = await userService.getUser({ email }); 
        
        if (!user) {
            return res.status(404).send({ status: "error", error: "Usuario no encontrado" });
        }
        
        const resetToken = jwt.sign({ email }, config.jwtSecret, { expiresIn: '1h' });
        
        await sendRecoveryEmail(email, resetToken);
        res.send({ status: "success", message: "Recovery email sent" });
        
    } catch (error) {
        console.error("❌ Error en reset-request:", error.message);
        res.status(500).send({ status: "error", error: error.message });
    }
});

/**
 * RESTABLECER CONTRASEÑA
 */
router.post('/password-reset', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        const email = decoded.email;

        // CORRECCIÓN: Usamos getUser({ email })
        const user = await userService.getUser({ email });
        if (!user) return res.status(404).send({ status: "error", error: "User not found" });

        // Validar que no sea la misma contraseña
        if (isValidPassword(user, newPassword)) {
            return res.status(400).send({ 
                status: "error", 
                message: "No puedes usar la misma contraseña anterior" 
            });
        }

        const hashedPassword = createHash(newPassword);
        
        // CORRECCIÓN: Usamos el método updatePassword de tu repository si lo prefieres,
        // o el método genérico de actualización. Aquí usamos el updatePassword que ya creaste:
        await userService.updatePassword(email, hashedPassword);

        res.send({ status: "success", message: "Password updated successfully" });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).send({ status: "error", error: "El token ha expirado. Solicita uno nuevo." });
        }
        console.error("❌ Error en password-reset:", error.message);
        res.status(500).send({ status: "error", error: "Token inválido o error interno" });
    }
});

export default router;