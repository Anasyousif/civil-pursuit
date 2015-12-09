'use strict';

import describe from 'redtea';
import superagent from 'superagent';

function test(props) {
  const locals = {};

  return describe ('Home page', [
    {
      'should get home page' : (ok, ko) => {
        superagent
          .get(`http://localhost:${props.port}/`)
          .end((error, res) => {
            try {
              if ( error ) {
                throw error;
              }
              res.status.should.be.exactly(200);
              ok();
            }
            catch ( error ) {
              ko(error);
            }
          });
      }
    }
  ]);
}

export default test;
