export default class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getProduct(id) {
        return await this.dao.getById(id);
    }

    async updateStock(id, newStock) {
        return await this.dao.update(id, { stock: newStock });
    }
}