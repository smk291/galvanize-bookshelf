/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable brace-style */
/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable no-negated-condition */

'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

const router = express.Router();

router.post('/users', (req, res, next) => {
  const { email, firstName, lastName, password } = req.body;

  if (!email || !email.trim()) {
    return next(boom.create(400, 'Email must not be blank'));
  }

  if (!password || password.length < 8) {
    return next(boom.create(400, 'Password must be at least 8 characters long'));
  }

  knex('users')
    .where('email', email)
    .first()
    .then((row) => {
      if (row) {
        return next(boom.create(400, 'Email already exists'));
      }

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const insertUser = { email, firstName, lastName, hashedPassword };

      return knex('users').insert(decamelizeKeys(insertUser), '*');
    })
    .then((rows) => {
      const user = camelizeKeys(rows[0]);

      delete user.hashedPassword;

      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
