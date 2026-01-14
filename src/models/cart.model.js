import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    // Definimos que el carrito tiene un arreglo de productos
    products: {
        type: [
            {
                // Cada producto es una referencia a la colección 'products'
                product: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'products' 
                },
                quantity: { type: Number, default: 1 }
            }
        ],
        default: []
    }
});

// IMPORTANTE: El nombre después de 'export const' debe coincidir exactamente 
// con lo que se intenta importar en sessions.router.js
export const cartModel = mongoose.model('carts', cartSchema);