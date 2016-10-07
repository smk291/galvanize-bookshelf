/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable brace-style */
/* eslint-disable no-unused-vars */
/* eslint-disable new-cap */
/* eslint-disable no-negated-condition */

'use strict';

const boom = require('boom');
const express = require('express');
const router = express.Router();
const knex = require('../knex');

const { camelizeKeys, decamelizeKeys } = require('humps');

router.get('/books', (_req, res, next) => {
  knex('books').orderBy('title').then((books) => {
    res.send(camelizeKeys(books));
  }).catch((err) => {
    next(err);
  });
});

router.get('/books/:id', (req, res, next) => {
  if (!(Number(req.params.id))) {
    return next();
  }

  knex('books')
    .where('id', req.params.id)
    .first().then((book) => {
      if (!book || !(Number(req.params.id))) {
        // return next(); <== no
        // When throw in a then block, err is sent to catch
        throw boom.create(404, 'Not Found');
      }

      res.send(camelizeKeys(book));
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/books', (req, res, next) => {
  if (!(req.body.title) || !(req.body.title.trim())) {
    throw boom.create(400, 'Title must not be blank');
  }

  if (!(req.body.author) || !(req.body.author.trim())) {
    throw boom.create(400, 'Author must not be blank');
  }

  if (!(req.body.genre) || !(req.body.genre.trim())) {
    throw boom.create(400, 'Genre must not be blank');
  }

  if (!(req.body.description) || !(req.body.description.trim())) {
    throw boom.create(400, 'Description must not be blank');
  }

  if (!(req.body.coverUrl) || !(req.body.coverUrl.trim())) {
    throw boom.create(400, 'Cover URL must not be blank');
  }

  knex('books').insert({

    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
    description: req.body.description,
    cover_url: req.body.coverUrl
  }, '*').then((books) => {
    res.send(camelizeKeys(books[0]));
  }).catch((err) => {
    next(err);
  });
});

router.patch('/books/:id', (req, res, next) => {
  if (!(Number(req.params.id))) {
    return next();
  }

  knex('books')
    .where('id', req.params.id)
    .first()
    .then((book) => {
      if (!book) {
        throw boom.create(404, 'Not Found');
      }

      const { title, author, genre, description, coverUrl, created_at } = req.body;
      const updateBook = {};

      if (title) {
        updateBook.title = title;
      }

      if (author) {
        updateBook.author = author;
      }

      if (genre) {
        updateBook.genre = genre;
      }

      if (description) {
        updateBook.description = description;
      }

      if (coverUrl) {
        updateBook.coverUrl = coverUrl;
      }

      return knex('books')
        .update(decamelizeKeys(updateBook), '*')
        .where('id', req.params.id);
    })
    .then((rows) => {
      const book = camelizeKeys(rows[0]);

      res.send(book);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/books/:id', (req, res, next) => {
  if (!(Number(req.params.id))) {
    throw boom.create(404, 'Not Found');
  }

  let book;

  knex('books').where('id', req.params.id).first().then((row) => {
    if (!row) {
      throw boom.create(404, 'Not Found');
    }

    book = row;

    return knex('books')
      .del()
      .where('id', req.params.id);
  }).then(() => {
    delete book.id;
    res.send(camelizeKeys(book));
  }).catch((err) => {
    next(err);
  });
});

module.exports = router;
