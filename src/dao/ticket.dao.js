import { ticketModel } from '../models/ticket.model.js';

export default class TicketDAO {
    // Crear un nuevo ticket
    create = async (ticketData) => {
        try {
            return await ticketModel.create(ticketData);
        } catch (error) {
            throw new Error(`Error al crear ticket en DAO: ${error.message}`);
        }
    }

    // Obtener un ticket por ID (por si lo necesitas después)
    getById = async (id) => {
        try {
            return await ticketModel.findById(id);
        } catch (error) {
            throw new Error(`Error al obtener ticket en DAO: ${error.message}`);
        }
    }
}