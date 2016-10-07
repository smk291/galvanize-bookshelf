/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable brace-style */
/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable no-negated-condition */

'use strict';

const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

const authorize = function(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.verify = false;

      return next(boom.create(401, 'Unauthorized'));
    }

    res.verify = true;
    req.token = decoded;

    next();
  });
};

router.delete('/favorites', authorize, (req, res, next) => {
  let favorite;
  const { userId } = req.token;
  const { bookId } = req.body;

  if (typeof bookId !== 'number') {
    return next(boom.create(400, 'Book ID must be an integer'));
  }

  knex('favorites')
    .where({ book_id: bookId, user_id: userId })
    .first()
    .then((row) => {
      if (!row) {
        throw next(boom.create(404, 'Favorite not found'));
      }
      favorite = camelizeKeys(row);

      return knex('favorites')
        .where({ book_id: bookId, user_id: userId })
        .del();
    })
    .then(() => {
      delete favorite.id;
      res.send(favorite);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/favorites', authorize, (req, res, next) => {
  const { userId } = req.token;

  knex('favorites')
    .innerJoin('books', 'books.id', 'favorites.book_id')
    .where('favorites.user_id', userId)
    .then((row) => {
      const favorite = camelizeKeys(row);

      res.send(favorite);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/favorites/check', authorize, (req, res, next) => {
  const { userId } = req.token;
  const bookId = Number(req.query.bookId);

  if (isNaN(bookId)) {
    return next(boom.create(400, 'Book ID must be an integer'));
  }

  knex('favorites')
    .where('id', bookId)
    .first()
    .then((row) => {
      if (!row) {
        res.status(200);
        res.send('false');
      } else {
        res.status(200);
        res.send('true');
      }
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/favorites', authorize, (req, res, next) => {
  const { userId } = req.token;
  const { bookId } = req.body;

  if (typeof req.body.bookId !== 'number') {
    return next(boom.create(400, 'Book ID must be an integer'));
  }

  knex('books')
    .where('id', bookId)
    .first()
    .then((row) => {
      if (!row) {
        return next(boom.create(404, 'Book not found'));
      }

      return knex('favorites')
        .insert({
          user_id: userId,
          book_id: bookId
        }, '*');
    })
    .then((rows) => {
      const favorite = camelizeKeys(rows[0]);

      res.send(favorite);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
