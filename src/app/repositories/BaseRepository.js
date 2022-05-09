module.exports = class BaseRepository {
    constructor(Model) {
        this.model = Model;
    }

    async findAll() {
        return this.model.findAll();
    }

    async findByPk(id) {
        return this.model.findByPk(id);
    }

    // Other methods
}