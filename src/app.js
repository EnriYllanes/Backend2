import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Importación de configuraciones y rutas
import initializePassport from './config/passport.config.js';
import sessionsRouter from './routes/sessions.router.js';
import cartsRouter from './routes/carts.router.js'; // Importamos el de carritos
// import productsRouter from './routes/products.router.js'; // Descomenta cuando lo tengas listo

// Configuración de variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/ecommerce';

// --- CONEXIÓN A BASE DE DATOS ---
mongoose.connect(MONGO_URL)
    .then(() => console.log("✅ Conectado con éxito a MongoDB"))
    .catch(error => console.error("❌ Error al conectar a la base de datos:", error));

// --- MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- PASSPORT ---
initializePassport();
app.use(passport.initialize());

// --- RUTAS ---
app.use('/api/sessions', sessionsRouter);
app.use('/api/carts', cartsRouter);
// app.use('/api/products', productsRouter);

// --- MANEJO DE ERRORES BÁSICO ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ status: "error", error: "Algo salió mal en el servidor" });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));