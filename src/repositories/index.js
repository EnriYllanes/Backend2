import UserDAO from '../dao/user.dao.js';
import UserRepository from './user.repository.js';
import CartsDAO from '../dao/carts.dao.js';
import CartsRepository from './carts.repository.js';
import ProductDAO from '../dao/product.dao.js'; // ¡No olvides este!
import ProductRepository from './product.repository.js';
import TicketDAO from '../dao/ticket.dao.js';
import TicketRepository from './ticket.repository.js';

// 1. Instanciamos los DAOs
const usersDao = new UserDAO();
const cartsDao = new CartsDAO();
const productsDao = new ProductDAO();
const ticketDao = new TicketDAO();

// 2. Exportamos los servicios (Repositorios)
export const userService = new UserRepository(usersDao);
export const cartService = new CartsRepository(cartsDao);
export const productService = new ProductRepository(productsDao);
export const ticketService = new TicketRepository(ticketDao);