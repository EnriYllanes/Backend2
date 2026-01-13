import { Router } from 'express';
import { userModel } from '../models/user.model.js';
// Importa aquí tu modelo de carritos existente
// import { cartModel } from '../models/cart.model.js'; 
import { createHash, isValidPassword, generateToken } from '../utils.js';
import passport from 'passport';

const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) return res.status(400).send({ status: "error", error: "User already exists" });

        // 1. Creamos un carrito vacío para el nuevo usuario
        // const newCart = await cartModel.create({ products: [] });

        // 2. Creamos el usuario vinculando el ID del carrito creado
        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            // cart: newCart._id, // Descomentar cuando tengas el modelo de cart
            role: 'user'
        };

        const result = await userModel.create(newUser);
        res.status(201).send({ status: "success", message: "User registered", payload: result._id });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal error" });
    }
});