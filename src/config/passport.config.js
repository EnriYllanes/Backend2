import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import { userModel } from '../models/user.model.js';
import { cartModel } from '../models/cart.model.js';
import { createHash, isValidPassword } from '../utils.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) token = req.cookies['coderCookieToken'];
    return token;
};

const initializePassport = () => {

    // ESTRATEGIA DE REGISTRO
    passport.use('register', new LocalStrategy({
        passReqToCallback: true, // Permite acceder al objeto req para leer otros campos
        usernameField: 'email'
    }, async (req, email, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
            let user = await userModel.findOne({ email });
            if (user) return done(null, false, { message: "User already exists" });

            // 1. CREACIÓN PREVENTIVA DEL CARRITO
            const newCart = await cartModel.create({ products: [] });

            // 2. CREACIÓN DEL USUARIO
            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cart: newCart._id // Referencia al ID del carrito
            };

            let result = await userModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done("Error al obtener el usuario: " + error);
        }
    }));

    // ESTRATEGIA DE LOGIN (Local)
    // se encarga de verificar credenciales y devolver el usuario
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email });
            if (!user) return done(null, false, { message: "User not found" });

            if (!isValidPassword(user, password)) return done(null, false, { message: "Wrong password" });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // ESTRATEGIA JWT (Middleware de Autenticación)
    // Se usa para proteger rutas leyendo el token de la cookie
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "CoderSecretKeyJWT"
    }, async (jwt_payload, done) => {
        try {
            // jwt_payload ya contiene la información del usuario firmada
            return done(null, jwt_payload.user);
        } catch (error) {
            return done(error);
        }
    }));

    // Serialización y deserialización (necesarios para estrategias locales)
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    });
};

export default initializePassport;