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
    // You can now access the payload via req.token.userId
    next();
  });
};

router.get('/favorites', authorize, (req, res, next) => {
  const { userId } = req.token;

  knex('favorites')
    .innerJoin('books', 'books.id', 'favorites.book_id')
    .where('favorites.user_id', userId)
    .then((rows) => {
      const favorites = camelizeKeys(rows);

      res.send(favorites);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/favorites/check', authorize, (req, res, next) => {
  const { userId } = req.token;


  const bookId = req.query.bookId;

  // const { id } = req.params;
  // console.log("ID IS "  + id);
  // console.log(req.params.id);
  // if no token, throw error '401 unauthorized'

  // if token and request for nonexistent entry
    // return false

  // if token and request for extant entry
    // return true

    // with token
    //   ✓ GET /favorites
    //   1) GET /favorites/check?bookId=1
    //   2) GET /favorites/check?bookId=2
    //   3) POST /favorites
    //   4) DELETE /favorites
    // without token
    //   ✓ GET /favorites
    //   5) GET /favorites/check?bookId=1
    //   6) GET /favorites/check?bookId=2
    //   7) POST /favorites
    //   8) DELETE /favorites

    // part4 routes favorites bonus
    //   1) GET /favorites/check?bookId=one
    //   2) POST /favorites with non-integer bookId
    //   3) POST /favorites with unknown bookId
    //   4) DELETE /favorites with non-integer bookId
    //   5) DELETE /favorites with unknown favorite


  if (!userId || userId.length === 0){
    throw boom.create(401, 'Unauthorized')
  }

  knex('favorites')
    .where('id', bookId)
    .first()
    .then((row) => {
      // console.log(row);
      if(!row){
        res.status(200);
        res.send('false');
      } else {
        res.status(200);
        res.send('true');
      }
    });
});

module.exports = router;


// with token
//   ✓ GET /favorites
//   1) GET /favorites/check?bookId=1
//   2) GET /favorites/check?bookId=2
//   3) POST /favorites
//   4) DELETE /favorites
// without token
//   ✓ GET /favorites
//   5) GET /favorites/check?bookId=1
//   6) GET /favorites/check?bookId=2
//   7) POST /favorites
//   8) DELETE /favorites

// part4 routes favorites bonus
//   1) GET /favorites/check?bookId=one
//   2) POST /favorites with non-integer bookId
//   3) POST /favorites with unknown bookId
//   4) DELETE /favorites with non-integer bookId
//   5) DELETE /favorites with unknown favorite
