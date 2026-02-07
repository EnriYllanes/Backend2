import UserDTO from '../dto/user.dto.js';

export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    // Retorna el usuario completo (para procesos internos como validación de password)
    async getUser(params) {
        return await this.dao.get(params);
    }

    // Retorna el usuario filtrado por el DTO (para enviar al frontend)
    async getUserWithDTO(params) {
        const user = await this.dao.get(params);
        return user ? new UserDTO(user) : null;
    }

    // Crea el usuario a través del DAO
    async createUser(user) {
        return await this.dao.create(user);
    }

    // Lógica específica para actualizar la contraseña
    async updatePassword(email, newPasswordHash) {
        const user = await this.dao.get({ email });
        if (!user) throw new Error("User not found");
        
        user.password = newPasswordHash;
        return await this.dao.update(user._id, user);
    }
}