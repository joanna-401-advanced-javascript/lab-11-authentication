// 'use strict';
//
// const jsonWebToken = require('jsonwebtoken');
// const middleware = require('./middleware');
//
// /**
//  * This function gets all the books
//  * @param request
//  * @param response
//  * @param next
//  */
// module.exports = function (request, response, next) {
//   const token = request.headers['x-access-token'] || request.headers['authorization'];
//   if (!token) {
//     return response.status(401).send('Access denied. No token provided.');
//   } else if (token){
//     try {
//       const decoded = jsonWebToken.verify(process.env.SECRET || 'IYXXhwMBwCnDIZa9jlAL');
//       request.user = decoded;
//       next();
//     } catch (ex) {
//       response.status(400).send('Invalid token.');
//     }
//   // } else {
//   //   try {
//   //     const decoded = middleware(request, response, next);
//   //     request.user = decoded;
//   //     next();
//   //   } catch (ex) {
//   //     response.status(400).send('Invalid u/pw.')
//   //   }
//   }
// };