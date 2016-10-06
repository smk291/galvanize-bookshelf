'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('favorites', (t) => {
    t.increments();
    t.integer('book_id')
      .unsigned()
      .references('id')
      .inTable('books')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    t.integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE')
      .index();
    t.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('favorites');
};
