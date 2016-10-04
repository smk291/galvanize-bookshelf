'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

const camelToSnake = function (obj){
  for (camelkey in obj){}
    let temp = camelkey.split();
    temp.map(function(val, idx, arr){
    if (val.charCodeAt() > 64 && val.charCodeAt() < 91){
      val = "_" + String.fromCharCode(val.charCodeAt() + 32);
    }

    obj.temp = temp;
    delete obj.camelkey
  });
  return obj
};

router.get('/books', (_req, res, next) => {
  knex('books')
    .orderBy('id')
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
    knex('books')
    .where('id', req.params.id)
    .first()
    .then((books) => {
      if (!books) {
        return next();
      }

      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  knex('books')
    .insert({
      title: req.body.title,
      author: req.body.author,
      genre: req.body.genre,
      description: req.body.description,
      cover_url: req.body.cover_url
    }, '*')
    .then((books) => {
      res.send(books[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/books/:id', (req, res, next) => {
  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book){
        return next();
      };

      if (req.body.title){
        knex('books')
            .update({ title: req.body.title }, '*')
            .where('id', req.params.id);
      };

      if (req.body.author){
        knex('books')
            .update({ author: req.body.author }, '*')
            .where('id', req.params.id);
      };

      if (req.body.genre){
        knex('books')
            .update({ genre: req.body.genre }, '*')
            .where('id', req.params.id);
      };

      if (req.body.description){
        knex('books')
            .update({ description: req.body.description }, '*')
            .where('id', req.params.id);
      };

      if (req.body.cover_url){
        knex('books')
            .update({ cover_url: req.body.cover_url }, '*')
            .where('id', req.params.id);
      };

    })
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/books/:id', (req, res, next) => {
  let book;

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        return next();
      }

      book = row;

      return knex('book')
        .del()
        .where('id', req.params.id);
    })
    .then(() => {
      delete book.id;
      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
