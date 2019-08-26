'use strict';

const User = require('./users-model.js');

module.exports = (request, response, next) => {
  try {
    let [type, authString] = authrequest.headers.authorization.split(' ');

    if(type === 'basic') {
      return _authBasic(authString);
      } else {
        return _authError
      }
  } catch (error) {
    return _authError();
  }

  /**
   * This function will parse basic authenticaltion
   * @param authString
   * @private
   */
  function _authBasic() {
    let base64Buffer = Buffer.from(authString,'base64'); // <Buffer 01 02...>
    let bufferString = base64Buffer.toString(); // john:mysecret
    let [username,password] = bufferString.split(':');  // variables username="john" and password="mysecret"
    let auth = [username,password];  // {username:"john", password:"mysecret"}
    // now we have the u/p and should be able to login or create an acct

    return User.authenticateBasic(auth)
      .then( user => _authenticate(user) );
  }

  /**
   * Here I have either user or false/null/falsy
   * @param user 
   * @private
   */
  function _authenticate(user) {
    if ( user ) {
      request.user = user;
      request.token = user.generateToken();// this token will be used in any other request
      next();
    } else {
      return _authError();
    }
  }

  function _authError() {
    next({status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'});
  }

};

