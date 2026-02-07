import { cartModel } from '../models/cart.model.js';

export default class CartsDAO {
    // 1. Obtener carrito con POPULATE
    // IMPORTANTE: si no populamos, el Repository no verá el stock ni el precio.
    async getById(id) {
        try {
            return await cartModel.findById(id).populate('products.product');
        } catch (error) {
            throw new Error(`Error en DAO al obtener carrito: ${error.message}`);
        }
    }

    // 2. Actualizar carrito
    // Recibe el ID y el objeto con los cambios (ej: { products: [...] })
    async update(id, data) {
        try {
            return await cartModel.findByIdAndUpdate(
                id, 
                { $set: data }, 
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error en DAO al actualizar carrito: ${error.message}`);
        }
    }

    // 3. Crear carrito (por si no lo tenías)
    async create() {
        try {
            return await cartModel.create({ products: [] });
        } catch (error) {
            throw new Error(`Error en DAO al crear carrito: ${error.message}`);
        }
    }
}