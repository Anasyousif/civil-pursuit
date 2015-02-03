/**
 * The User Model
 * 
 * @module Models
 * @class UserSchema
 * @author francoisrvespa@gmail.com
*/

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');

var config = require('../config.json');

var UserSchema = new Schema({
  "email": {
    "type": String,
    "required": true,
    "index": {
      "unique": true
    }
  },
  
  "password": {
    "type": String,
    "required": true
  },

  "created": {
    "type": Date,
    "default": Date.now
  },

  "image": {
    "type": String
  },

  // preferences

  "preferences": [
    new Schema({
      "name": String,
      "value": Schema.Types.Mixed
    })
  ]
});

UserSchema.pre('save', function (next) {

  if ( ! this.isNew ) {
    return next();
  }

  this.email = this.email.toLowerCase();

  var self = this;

  var domain = require('domain').create();

  domain.on('error', function (error) {
    next(error);
  });

  domain.run(function () {
    bcrypt.genSalt(10, domain.intercept(function (salt) {
      bcrypt.hash(self.password, salt, domain.intercept(function (hash) {
        self.password  = hash;
        next();
      }));
    }));
  });
});

UserSchema.statics.isValidPassword = function (requestPassword, realPassword, cb) {
  bcrypt.compare(requestPassword, realPassword, cb);
};

UserSchema.statics.identify = function (email, password, cb) {

  var self = this;

  this.findOne({ email: email }, function (error, user) {
    if ( error ) {
      return cb(error);
    }

    if ( ! user ) {
      return cb(new Error('User not found ' + email));
    }
    
    self.isValidPassword(password, user.password, function (error, isValid) {
      if ( error ) {
        return cb(error);
      }
      
      if ( ! isValid ) {
        return cb(new Error('Wrong password'));
      }
      
      return cb(null, user);
    });
  });
};

UserSchema.statics.saveImage = function (id, image, cb) {

  var cloudinary = require('cloudinary');
        
  cloudinary.config({ 
    cloud_name      :   config.cloudinary.cloud.name, 
    api_key         :   config.cloudinary.API.key, 
    api_secret      :   config.cloudinary.API.secret 
  });

  var stream = cloudinary.uploader.upload_stream(function (result) {
    User.update({ _id: id }, { image: result.url }, cb);
  });

  var imageStream = require('fs').createReadStream(path.join(config.tmp, image));

  imageStream.pipe(stream);
};

module.exports = mongoose.model('User', UserSchema);
