'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // libarary used for hashing, not encryption
const jasonWebToken = require('jsonwebtoken');// library that creates the token - big random string starting with "ey"


const users = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  role: {type: String, required:true, default:'user', enum:['admin','editor','user'] },
});

// before you save something, I want to do something, before you save it, change its password to hashed version - save is predefined by mongoose
users.pre('save', function(next) {
  const SALT_ROUNDS = 10; // means 2 to the 10 before final hash
  bcrypt.hash(this.password, SALT_ROUNDS)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();// this is not a MW next but a mongoose next - we know it because we are inside a pre hook which is mongoose (not an express next - only with request, response is it express)
    })
    .catch( error => {throw error;} );
});

/**
 * This function will see if a user can login to our system
 * We compare provided password with stored hash
 * @param auth
 */

 //statics below - can't use "this" in the static because it belongs to everyone - used to save memory - mongoose  OOP word
users.statics.authenticateBasic = function(auth) {
  //start by finding a user via its name, then compare passwords
  let query = {username:auth.username};

  return this.findOne(query)
  //mongo says i'll send you to catch if error,need to check for user twice because will return undefined
    .then(user => user && user.comparePassword(auth.password))//demo code, does same as below
    .then(user +> {
      return user ? user.comparePassword(auth.password) : null;
    })// this also does the same as below
    .then(user => {
      if(user) {
        return user.comparePassword(auth.password);
      } else {
        // return false because we couldn't find a user
        return false;
      }
    })
    .catch(console.error);
};

// Compare a plain text password against the hashed one we have saved
users.methods.comparePassword = function(password) {
  // This reps the current user stored - e.g. this.password, this.user - because users is a mongoose schema
  return bcrypt.compare(password, this.password);
    then(isPasswordValid => isPasswordValid ? this : null);// if valid, return this object, if not valid, return null - compare hashed against hashed - hashed valued stored in the mongoose schema - current users schema
};

// Generate a JWT from the user id and a secret
users.methods.generateToken = function() {
  let tokenData = {
    id:this._id,
    capabilities: (this.acl && this.acl.capabilities) || [],
  };
  // below - sign is encrypting - creates a token that is long, random, unique and encrypted
  // SECRET is what makes it so encryption is unique and they key that you will use to decrypt when comes back from user again - go get a long one to test for mongoose and supergoose - need default value to encrypt - use that instead of 'change it' below - production code would not include the || 'change it' part
  return jwt.sign(tokenData, process.env.SECRET || 'changeit' );
};

module.exports = mongoose.model('users', users);
