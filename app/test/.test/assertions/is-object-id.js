'use strict';

import Mungo            from 'mungo';
import should           from 'should';

function isObjectID(_id, compare = null, serialized = false) {
  return it => {

    if ( serialized ) {
      it('should be a string', (ok, ko) => {
        _id.should.be.a.String();
      });

      it('_id should be convertible to Object ID', (ok, ko) => {
        Mungo.ObjectID(_id);
      });
    }
    else {
      it('_id should be an ObjectID', (ok, ko) => {
        _id.should.be.an.instanceof(Mungo.ObjectID);
      });
    }

    if ( compare ) {
      it('_id should match compare', (ok, ko) => {
        _id.toString().should.be.exactly(compare.toString());
      });
    }

  };
}

export default isObjectID;
