'use strict';

const User = require('./users-model.js');

/**
 * This MW runs before any route gets hit - Id when the request has a username and password - HTTP header called Authorization that has the u/p for the request - in plain text, not encrypted - use HTTPS on top of it to make it secure - if not, it's naked -  can be used to make it happen
 */

module.exports = (request, response, next) => {
  //extract the login information
  try {
    let [type, authString] = authrequest.headers.authorization.split(' ');

    if(type === 'basic') {
      return _authBasic(authString);
      }else {
        return _authError
      }

  // switch(type) {
  //   case 'basic':
  //     return _authBasic(authString);
  //   default:
  //     return _authError;
  // }
  //this above is same as above it basically

  }

  } catch (error) {
    return _authError();
}

  try {

    let [authType, encodedString] = req.headers.authorization.split(/\s+/);

    // BASIC Auth  ... Authorization:Basic ZnJlZDpzYW1wbGU=

    switch(authType.toLowerCase()) {
      case 'basic':
        return _authBasic(encodedString);
      default:
        return _authError();
    }

  } catch(error) {
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
      // middleware function - if i have a user, i verify the password
      // i attach the user into the request
      request.user = user;
      request.token = user.generateToken;// this token will be used in any other request
      next();
    }
    else {
      _authError();
    }
  }

  function _authError() {
    next({status: 401, statusMessage: 'Unauthorized', message: 'Invalid User ID/Password'}); // Could say 'invalid credentials' so no hints that it's a u/p
  }

};

