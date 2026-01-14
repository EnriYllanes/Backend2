import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import mongoose from 'mongoose'; // 1. Importar mongoose
import initializePassport from './config/passport.config.js';
import sessionsRouter from './routes/sessions.router.js';

const app = express();


mongoose.connect('mongodb://localhost:27017/ecommerce')
    .then(() => console.log("Conectado con éxito a MongoDB"))
    .catch(error => console.error("Error al conectar a la base de datos:", error));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Recomendado para leer datos de formularios
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use('/api/sessions', sessionsRouter);

app.listen(8080, () => console.log("Server running on port 8080"));