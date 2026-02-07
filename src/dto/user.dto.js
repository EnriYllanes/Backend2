export default class UserDTO {
    constructor(user) {
        // Solo enviamos lo necesario para el frontend
        this.id = user._id || user.id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.age = user.age;
        this.role = user.role;
        this.cart = user.cart;
        // La contraseña (password) NO se incluye aquí.
    }
}