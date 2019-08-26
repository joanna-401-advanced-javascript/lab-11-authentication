'use strict';

const jsonWebToken = require('jsonwebtoken');

/**
 * This function checks if there's a token and verifies it
 */
module.exports = function (request, response, next) {
  const token = request.headers['x-access-token'] || request.headers['authorization'];
  if (!token) return response.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jsonWebToken.verify(token, 'IYXXhwMBwCnDIZa9jlAL');
    request.user = decoded;
    next();
  } catch (ex) {
    response.status(400).send('Invalid token.');
  }
};