'use strict';

const express = require('express');
const router = express.Router();
// const auth = require('../auth/auth');
const middleware = require('../auth/middleware');

router.get('/books', middleware, handleGetAll);
router.get('/books/:id', middleware, handleGetOne);

// Route Handlers
/**
 * This function gets all the books
 * @param request
 * @param response
 * @param next
 */
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

/**
 * This function gets one book by id
 * @param request
 * @param response
 * @param next
 */
function handleGetOne(request, response, next) {
  let book = {
    title:'Moby Dick',
  };
  response.status(200).json(book);
}

module.exports = router;
