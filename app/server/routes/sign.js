// ---------------------------------------------------------------------------------------------- \\
var should = require('should');
var path = require('path');;
// ---------------------------------------------------------------------------------------------- \\
var cookie = require(path.join(process.env.SYNAPP_PATH, 'app/business/config.json'))
  .cookie;
// ---------------------------------------------------------------------------------------------- \\
function customError (code, message) {
  var error = new Error(message);
  error.status = code;
  return error;
}
// ---------------------------------------------------------------------------------------------- \\
module.exports = function (req, res, next) {
    /******************************************************************************** SMOKE-TEST **/
    // ------------------------------------------------------------------------------------------ \\
    req                               .should.be.an.Object;
    // ------------------------------------------------------------------------------------------ \\
    req.constructor.name              .should.equal('IncomingMessage');
    // ------------------------------------------------------------------------------------------ \\
    req                               .should.have.property('params')
    // ------------------------------------------------------------------------------------------ \\
    req.params                        .should.be.an.Object;
    // ------------------------------------------------------------------------------------------ \\                                  
    req.params                        .should.have.property('dir');
    // ------------------------------------------------------------------------------------------ \\
    req.params.dir                    .should.be.a.String;
    // ------------------------------------------------------------------------------------------ \\
    ['in', 'out', 'up', 'off']        .should.containEql(req.params.dir);
    // ------------------------------------------------------------------------------------------ \\
    res                               .should.be.an.Object;
    // ------------------------------------------------------------------------------------------ \\
    res.constructor.name              .should.equal('ServerResponse');
    // ------------------------------------------------------------------------------------------ \\
    next                              .should.be.a.Function;
    // ------------------------------------------------------------------------------------------ \\
  /********************************************************************************   DOMAIN     **/
  // -------------------------------------------------------------------------------------------- \\
  var domain = require('domain').create();
  // -------------------------------------------------------------------------------------------- \\
  domain.on('error', function (error) {
    return next(error);
  });
  // -------------------------------------------------------------------------------------------- \\
  domain.run(function () {
    // ------------------------------------------------------------------------------------------ \\
    switch ( req.params.dir ) {
      /******************************************************************************** SIGN-UP  **/
      // ---------------------------------------------------------------------------------------- \\
      case 'up':
        // -------------------------------------------------------------------------------------- \\
          req                             .should.have.property('body');
          // ------------------------------------------------------------------------------------ \\
          req.body                        .should.be.an.Object;
          // ------------------------------------------------------------------------------------ \\
          req.body                        .should.have.property('email');
          // ------------------------------------------------------------------------------------ \\
          req.body.email                  .should.be.a.String;
          // ------------------------------------------------------------------------------------ \\
          req.body                        .should.have.property('password');
          // ------------------------------------------------------------------------------------ \\
          req.body.password               .should.be.a.String;
        // -------------------------------------------------------------------------------------- \\
        var User = require('../models/User');
          // ------------------------------------------------------------------------------------ \\
          User                            .should.be.a.Function;
          User                            .should.have.property('create');
          User.create                     .should.be.a.Function;
        // -------------------------------------------------------------------------------------- \\
        /************************************************************************** CREATE USER  **/
        // -------------------------------------------------------------------------------------- \\
        User.create({
          email: req.body.email,
          password: req.body.password
        }, domain.intercept(function (created) {
          
          console.error('User created: %s'    .format(req.body.email));
          
          res.cookie('synuser', { email: req.body.email, id: created._id }, cookie);
          
          res.json(created);

        }));
        // -------------------------------------------------------------------------------------- \\
        break;
      // ---------------------------------------------------------------------------------------- \\
      /******************************************************************************** SIGN-IN  **/
      // ---------------------------------------------------------------------------------------- \\
      case 'in':
        // -------------------------------------------------------------------------------------- \\
          req                             .should.have.property('body');
          // ------------------------------------------------------------------------------------ \\
          req.body                        .should.be.an.Object;
          // ------------------------------------------------------------------------------------ \\
          req.body                        .should.have.property('email');
          // ------------------------------------------------------------------------------------ \\
          req.body.email                  .should.be.a.String;
          // ------------------------------------------------------------------------------------ \\
          req.body                        .should.have.property('password');
          // ------------------------------------------------------------------------------------ \\
          req.body.password               .should.be.a.String;
        // -------------------------------------------------------------------------------------- \\
        console.info(require('util').format('Sign-in attempt: %s',
          req.body.email));
        // -------------------------------------------------------------------------------------- \\
        var User = require('../../business/models/User');
          // ------------------------------------------------------------------------------------ \\
          User                            .should.be.a.Function;
          User                            .should.have.property('findOne');
          User.findOne                    .should.be.a.Function;
        // -------------------------------------------------------------------------------------- \\
        /**************************************************************************** FIND USER  **/
        // -------------------------------------------------------------------------------------- \\
        User.findOne({
            email: req.body.email
          },
          // ------------------------------------------------------------------------------------ \\
          domain.intercept(function (user) {
            // ---------------------------------------------------------------------------------- \\
            if ( ! user ) {
              console.warn(require('util').format('User not found: %s',
                req.body.email));

              throw customError(404, 'No such user');
            }
            // ---------------------------------------------------------------------------------- \\
            // console.info('User found: %s'.format(req.body.email));
            // ---------------------------------------------------------------------------------- \\
            var bcrypt = require('bcrypt');
            // ---------------------------------------------------------------------------------- \\
            bcrypt.compare(req.body.password, user.password, domain.intercept(function (same) {
              if ( ! same ) {
                console.warn('Wrong password: %s'      .format(req.body.email));
                throw customError(401, 'No such user');
              }
              // -------------------------------------------------------------------------------- \\
              // console.info('Email match: %s'         .format(req.body.email));
              // -------------------------------------------------------------------------------- \\
              res.cookie('synuser', { email: req.body.email, id: user._id }, cookie);
              // -------------------------------------------------------------------------------- \\
              // console.error('User signed in: %s'      .format(req.body.email));
              // -------------------------------------------------------------------------------- \\
              res.json({ in: true });
            }));
          }));
        // -------------------------------------------------------------------------------------- \\
        break;
      // ---------------------------------------------------------------------------------------- \\
      case 'out':

        res.clearCookie('synuser');

        res.redirect('/');
        break;
      // ---------------------------------------------------------------------------------------- \\
    }
    // ------------------------------------------------------------------------------------------ \\
  });
  // -------------------------------------------------------------------------------------------- \\
};