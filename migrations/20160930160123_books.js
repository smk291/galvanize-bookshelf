'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', (t) => {
    t.increments();
    t.string('title').notNullable().defaultTo('');
    t.string('author').notNullable().defaultTo('');
    t.string('genre').notNullable().defaultTo('');
    t.text('description').notNullable().defaultTo('');
    t.text('cover_url').notNullable().defaultTo('');
    t.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books');
};
