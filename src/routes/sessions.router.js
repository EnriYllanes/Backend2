import { Router } from 'express';
import { userModel } from '../models/user.model.js';
// Importamos el modelo de carritos para poder crear uno al registrar el usuario
import { cartModel } from '../models/cart.model.js'; 
import { createHash, isValidPassword, generateToken } from '../utils.js';
import passport from 'passport';

const router = Router();

// --- RUTA DE REGISTRO ---
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        // Verificamos si el email ya está en uso
        const exists = await userModel.findOne({ email });
        if (exists) return res.status(400).send({ status: "error", error: "User already exists" });

        // 1. CREACIÓN DEL CARRITO: Generamos un carrito vacío en la DB para este usuario
        const newCart = await cartModel.create({ products: [] });

        // 2. CREACIÓN DEL USUARIO: Vinculamos el ID del carrito recién creado
        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password), // Encriptación solicitada
            cart: newCart._id,              // Referencia al ID del carrito
            role: 'user'
        };

        const result = await userModel.create(newUser);
        res.status(201).send({ status: "success", message: "User registered", payload: result._id });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error al registrar usuario" });
    }
});

// --- RUTA DE LOGIN ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Buscamos al usuario por email
        const user = await userModel.findOne({ email });
        if (!user) return res.status(401).send({ status: "error", error: "Invalid credentials" });

        // Validamos la contraseña usando el método compare de bcrypt
        if (!isValidPassword(user, password)) return res.status(401).send({ status: "error", error: "Invalid credentials" });

        // Generamos el Token JWT (usando la función de utils.js)
        const token = generateToken(user);

        // Enviamos el token al navegador mediante una Cookie segura (httpOnly)
        res.cookie('coderCookieToken', token, { 
            maxAge: 60 * 60 * 1000, // 1 hora de duración
            httpOnly: true          // Protege contra ataques XSS
        }).send({ status: "success", message: "Logged in" });

    } catch (error) {
        res.status(500).send({ status: "error", error: "Error en el proceso de login" });
    }
});

// --- RUTA CURRENT (CONSIGNA) ---
// passport.authenticate('jwt') valida automáticamente el token de la cookie
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Si el token es válido, Passport coloca los datos del usuario en req.user
    res.send({ status: "success", payload: req.user });
});

export default router;