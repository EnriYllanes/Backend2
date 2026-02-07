import { userModel } from '../models/user.model.js';

export default class UsersDAO {
    // Busca un usuario por cualquier parámetro (email, id, etc.)
    async get(params) {
        return await userModel.findOne(params);
    }

    // Crea un nuevo usuario
    async create(user) {
        return await userModel.create(user);
    }

    // Actualiza un usuario
    async update(id, user) {
        return await userModel.findByIdAndUpdate(id, user, { new: true });
    }
}