'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('users', (ta) => {
    ta.increments();
    ta.string('first_name').notNullable().defaultTo('');
    ta.string('last_name').notNullable().defaultTo('');
    ta.string('email').unique().notNullable();
    ta.specificType('hashed_password', 'char(60)')
      .notNullable();
    ta.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
