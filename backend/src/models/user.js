const bcrypt = require('bcrypt');

module.exports = (knex) => {
  const table = 'users';

  return {
    async create(user) {
      const hash = await bcrypt.hash(user.password, 10);
      const [id] = await knex(table).insert({
        name: user.name,
        email: user.email,
        password: hash,
        role: user.role || 'user',
        active: user.active !== undefined ? user.active : true
      });
      return { id, ...user, password: undefined };
    },

    async findById(id) {
      return knex(table).where({ id }).first();
    },

    async findAll() {
      return knex(table).select('id', 'name', 'email', 'role', 'active', 'created_at', 'updated_at');
    },

    async update(id, data) {
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      await knex(table).where({ id }).update(data);
      return this.findById(id);
    },

    async remove(id) {
      return knex(table).where({ id }).del();
    }
  };
};
