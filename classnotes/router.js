'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./users-model.js');
const auth = require('./middleware.js');

authRouter.post('/signup', (request, response, next) => {
  // if we are here, everything is working just fine
  // i should eb able to have rquest.user and request.token
  // this is how we make a new user below
  let user = new User(request.body);
  user.save()// this line will trigger the user.pre(in user-model) - save is a mongoose method
  //once the .then below, it has been successfully saved in the database - if user in there already it will go to the catch because we defined the user as having to be unique
    .then( (user) => {
      request.token = user.generateToken();
      request.user = user;
      response.set('token', request.token);
      response.cookie('auth', request.token);
      response.send(request.token);
    }).catch(next);
});

authRouter.get('/signin', auth, (request, response, next) => {
  response.cookie('auth', request.token);
  response.send(request.token);
});

module.exports = authRouter;
