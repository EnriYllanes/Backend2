import { v4 as uuidv4 } from 'uuid';
import { productService, ticketService } from './index.js'; // Importante para la persistencia

export default class CartsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getCart(id) {
        return await this.dao.getById(id);
    }

    async processPurchase(cartId, userEmail) {
        // 1. Obtenemos el carrito (debe venir con populate desde el DAO)
        const cart = await this.dao.getById(cartId);
        if (!cart) throw new Error("Cart not found");

        let totalAmount = 0;
        const unprocessedItems = [];

        // 2. Procesamos cada producto
        for (const item of cart.products) {
            const product = item.product;
            const quantity = item.quantity;

            if (product.stock >= quantity) {
                // ✅ Hay stock: restamos y actualizamos vía ProductService
                const newStock = product.stock - quantity;
                await productService.updateProduct(product._id, { stock: newStock });
                
                // Sumamos al total del ticket
                totalAmount += product.price * quantity;
            } else {
                // ❌ No hay stock: guardamos el item completo para que siga en el carrito
                unprocessedItems.push(item);
            }
        }

        let ticket = null;

        // 3. Si hubo al menos una compra exitosa, generamos ticket
        if (totalAmount > 0) {
            const ticketData = {
                code: uuidv4(),
                amount: totalAmount,
                purchaser: userEmail,
                purchase_datetime: new Date()
            };
            
            // Usamos el ticketService (Repository de tickets)
            ticket = await ticketService.createTicket(ticketData);

            // 4. Actualizamos el carrito para que SOLO queden los no procesados
            // Le pasamos al DAO solo los items que no tuvieron stock
            await this.dao.update(cartId, { products: unprocessedItems });
        }

        return { 
            ticket, 
            unprocessedProducts: unprocessedItems.map(item => item.product._id) 
        };
    }

    // Método extra para que el router de agregar producto funcione 100% Repository
    async addProductToCart(cartId, productId) {
        const cart = await this.dao.getById(cartId);
        if (!cart) throw new Error("Cart not found");

        const existProductIndex = cart.products.findIndex(
            p => p.product._id.toString() === productId
        );

        if (existProductIndex !== -1) {
            cart.products[existProductIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        return await this.dao.update(cartId, { products: cart.products });
    }
}