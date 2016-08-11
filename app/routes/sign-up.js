'use strict';

import User            from '../models/user';
import Discussion      from '../models/discussion';

function signUp (req, res, next) {

  try {

    let { email, password, facebook } = req.body;

    console.log("sign-up", { email, password, facebook });
    console.info("sign-up detail", req, res);

    if ( facebook ) {
      password = facebook + 'synapp';
    }

    if ( ! email ) {
      res.statusCode = 400;
      res.json({ error: 'Missing email' });
    }

    else if ( ! password ) {
      res.statusCode = 400;
      res.json({ error: 'Missing password' });
    }

    else {
      User
        .create({ email, password, facebook })
        .then(
          user => {
            try {
              req.user = user;

              Discussion
                .findCurrent()
                .then(
                  discussion => {
                    try {
                      if ( ! discussion ) {
                        return next();
                      }

                      discussion
                        .push('registered', user)
                        .save()
                        .then(() => next(), next);
                    }
                    catch ( error ) {
                      next(error);
                    }
                  },
                  next
                );

            }
            catch ( error ) {
              next(error);
            }
          },
          error => {
            if ( /duplicate key/.test(error.message) ) {
              res.statusCode = 401;
              res.json({ error: `Email ${email} already in use`, message : error.message });
            }
            else {
              next(error);
            }
          }
        );
    }
  }

  catch ( error ) {
    next(error);
  }

}

export default signUp;
