'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('favorites', (ta) => {
    ta.increments();
    ta.integer('book_id')
      .unsigned()
      .references('id')
      .inTable('books')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    ta.integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    ta.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('favorites');
};
