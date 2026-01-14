import mongoose from 'mongoose'; //librería mongoose

/*
 * Defino esquema (estructura) para la colección de usuarios.
 * El esquema actúa como un filtro que valida los datos antes de guardarlos.
 */
const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
    role: { type: String, default: 'user' }
});

export const userModel = mongoose.model('users', userSchema);