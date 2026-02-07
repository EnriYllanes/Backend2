Backend II de E-commerce - Entrega Final
Este proyecto es una aplicación de servidor para un e-commerce, desarrollada en Node.js y Express. Se enfoca en una arquitectura de capas, seguridad avanzada y manejo de procesos de negocio complejos.

Arquitectura y Patrones

- Patron Repository
- DAO (Data Access Object)
- DTO (Data Transfer Object)
- Mailing

Funcionalidades Principales

- Verifica el stock de cada producto.
- Si hay stock, lo resta y lo suma al total del ticket.
- Si no hay stock, el producto permanece en el carrito para después.
- Genera un Ticket con un código único (UUID) y el monto total de la compra.

Seguridad y Roles

- Middleware de Autorización: Restringe el acceso según el rol.
- Solo admin puede gestionar productos.
- Solo user puede agregar productos a su carrito.
- Recuperación de Contraseña: Envía mail con un link que expira en 1 hora. No permite usar la contraseña que ya tenía el usuario.

Endpoints Principales
Sesiones:
- POST /api/sessions/login: Inicia sesión y genera cookie JWT.
- GET /api/sessions/current: Devuelve el perfil del usuario (protegido por DTO).
- POST /api/sessions/password-reset-request: Solicita el mail de recuperación.
- POST /api/sessions/password-reset: Restablece la contraseña validando el token.

Carritos:
- POST /api/carts/:cid/product/:pid: Agrega producto (Solo rol user).
- POST /api/carts/:cid/purchase: Finaliza la compra y crea el ticket.

Instalacion
- npm install
- Configurar el archivo .env
- npm start