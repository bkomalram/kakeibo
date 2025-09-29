exports.up = function(knex) {
  return knex.schema.createTable('expenses', function(table) {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.string('description').notNullable();
    table.float('amount').notNullable();
    table.string('category').notNullable();
    table.date('date').notNullable();
    table.boolean('active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('expenses');
};
