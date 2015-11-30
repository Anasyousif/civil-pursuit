'use strict';

import should           from 'should';
import Mungo            from 'mungo';
import Item             from '../../models/item';
import Type             from '../../models/type';
import User             from '../../models/user';

should.Assertion.add('item', function (candidate = {}, serialized = false) {
  this.params = { operator: 'to be an Item', expected: Item };

  this.obj.should.be.an.Object();

  if ( serialized ) {
    this.obj.should.be.an.Object();
  }
  else {
    this.obj.should.be.an.instanceof(Item);
  }

  this.obj.should.have.property('_id')
    .which.is.an.instanceof(Mungo.ObjectID);

  this.obj.should.have.property('type');

  try {
    this.obj.type.should.be.an.instanceof(Mungo.ObjectID);
  }
  catch ( error ) {
    this.obj.type.should.be.an.instanceof(Type);
  }

  if ( 'type' in candidate ) {
    if ( candidate.type instanceof Type ) {
      try {
        candidate.type._id.equals(this.obj.type).should.be.true;
      }
      catch ( error ) {
        candidate.type._id.equals(this.obj.type._id).should.be.true;
      }
    }
    else if ( candidate.type instanceof Mungo.ObjectID ) {
      this.obj.type.equals(candidate.type).should.be.true;
    }
    else {
      throw new Error('Type mismatch');
    }
  }

  this.obj.should.have.property('id')
    .which.is.a.String();

  if ( 'id' in candidate ) {
    this.obj.id.should.be.exactly(candidate.id);
  }

  this.obj.should.have.property('subject')
    .which.is.a.String();

  if ( 'subject' in candidate ) {
    this.obj.subject.should.be.exactly(candidate.subject);
  }

  this.obj.should.have.property('description')
    .which.is.a.String();

  if ( 'description' in candidate ) {
    this.obj.description.should.be.exactly(candidate.description);
  }

  this.obj.should.have.property('user');

  try {
    this.obj.user.should.be.an.instanceof(Mungo.ObjectID);
  }
  catch ( error ) {
    this.obj.user.should.be.an.instanceof(User);
  }

  if ( 'user' in candidate ) {
    if ( candidate.user instanceof User ) {
      if ( this.obj.user instanceof User) {
        this.obj.user._id.equals(candidate.user._id).should.be.true();
      }
      else if ( this.obj.user instanceof Mungo.ObjectID ) {
        this.obj.user.equals(candidate.user._id).should.be.true();
      }
    }
    else if ( candidate.user instanceof Mungo.ObjectID ) {
      if ( this.obj.user instanceof User) {
        this.obj.user._id.equals(candidate.user).should.be.true();
      }
      else if ( this.obj.user instanceof Mungo.ObjectID ) {
        this.obj.user.equals(candidate.user).should.be.true();
      }
    }
    else if ( typeof candidate.user === 'string' ) {
      if ( this.obj.user instanceof User) {
        this.obj.user._id.toString().should.be.exactly(candidate.user);
      }
      else if ( this.obj.user instanceof Mungo.ObjectID ) {
        this.obj.user.toString().should.be.exactly(candidate.user);
      }
    }
    else {
      throw new Error("Item's candidate user is different from item document's user");
    }
  }

  this.obj.should.have.property('promotions')
    .which.is.a.Number();

  if ( 'promotions' in candidate ) {
    this.obj.promotions.should.be.exactly(candidate.promotions);
  }

  this.obj.should.have.property('views')
    .which.is.a.Number();

  if ( 'views' in candidate ) {
    this.obj.views.should.be.exactly(candidate.views);
  }

  if ( 'image' in this.obj ) {
    this.obj.image.should.be.a.String();
  }

  if ( 'image' in candidate ) {
    this.obj.image.should.be.exactly(candidate.image);
  }

  this.obj.references.should.be.an.Array();

  this.obj.references.forEach(reference => {
    reference.should.be.an.Object();

    reference.should.have.property('url')
      .which.is.a.String();

    if ( 'title' in reference ) {
      reference.title.should.be.a.String();
    }
  });

  if ( 'references' in candidate ) {
    this.obj.references[0].url.should.be.exactly(candidate.references[0].url);
  }

  if ( ('parent' in this.obj) ) {
    this.obj.parent.should.be.an.instanceof(Mungo.ObjectID);
  }

  if ( 'parent' in candidate ) {
    this.obj.parent.should.be.exactly(candidate.parent);
  }

  if ( 'from' in this.obj ) {
    this.obj.from.should.be.an.instanceof(Mungo.ObjectID);
  }

  if ( 'from' in candidate ) {
    this.obj.from.should.be.exactly(candidate.from);
  }
});
