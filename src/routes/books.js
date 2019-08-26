'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../auth/auth');

router.get('/books', auth, handleGetAll);
router.get('/books/:id', auth, handleGetOne);

// Route Handlers
function handleGetAll(request, response, next) {
  let books = {
    count: 3,
    results: [
      { title:'Moby Dick' },
      { title:'Little Women' },
      { title: 'Eloquent Javascript' },
    ],
  };
  response.status(200).json(books);
}

function handleGetOne(request, response, next) {
  let book = {
    title:'Moby Dick',
  };
  response.status(200).json(book);
}

function checkToken(request, response, next) {

}

module.exports = router;
