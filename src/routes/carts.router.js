import { Router } from 'express';
import passport from 'passport';
import { cartService } from '../repositories/index.js';
import { authorization } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * FINALIZAR COMPRA
 * POST /api/carts/:cid/purchase
 */
router.post('/:cid/purchase', 
    passport.authenticate('jwt', { session: false }), 
    async (req, res) => {
        try {
            const { cid } = req.params;
            const userEmail = req.user.email;

            // El Repository se encarga de: validar stock, restar stock, generar ticket y limpiar carrito
            const result = await cartService.processPurchase(cid, userEmail);

            if (result.ticket) {
                return res.send({ 
                    status: "success", 
                    message: "Purchase completed successfully", 
                    payload: result.ticket, 
                    unprocessedProducts: result.unprocessedProducts 
                });
            } else {
                return res.status(400).send({ 
                    status: "error", 
                    message: "Purchase could not be processed. Out of stock.", 
                    unprocessedProducts: result.unprocessedProducts 
                });
            }

        } catch (error) {
            console.error("Purchase Error:", error);
            res.status(500).send({ status: "error", error: error.message });
        }
});

/**
 * AGREGAR PRODUCTO AL CARRITO
 * POST /api/carts/:cid/product/:pid
 * Restringido: Solo usuarios con rol 'user'
 */
router.post('/:cid/product/:pid', 
    passport.authenticate('jwt', { session: false }), 
    authorization(['user']), 
    async (req, res) => {
        try {
            const { cid, pid } = req.params;
            
            // Usamos el service para mantener la lógica fuera del router
            const result = await cartService.addProductToCart(cid, pid);
            
            res.send({ status: "success", message: "Product added to cart", payload: result });
        } catch (error) {
            res.status(500).send({ status: "error", error: error.message });
        }
});

/**
 * OBTENER CARRITO POR ID
 * GET /api/carts/:cid
 */
router.get('/:cid', 
    passport.authenticate('jwt', { session: false }), 
    async (req, res) => {
        try {
            const { cid } = req.params;
            const cart = await cartService.getCart(cid);
            if (!cart) return res.status(404).send({ status: "error", error: "Cart not found" });
            
            res.send({ status: "success", payload: cart });
        } catch (error) {
            res.status(500).send({ status: "error", error: error.message });
        }
});

export default router;