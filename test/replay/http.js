'use strict';

import Server             from '../../app/server';
import superagent         from 'superagent';
import Type               from '../../app/models/type';
import Item               from '../../app/models/item';
import config             from '../../secret.json';

process.env.PORT = 13012;

describe ( 'HTTP server' , function () {

  describe ( 'Start' , function () {

    let server, Intro, intro;

    describe ( 'Get intro' , function () {

      describe ( 'Get intro type' , function () {

        it ( 'should get intro type' , function (done) {

          Type
            .findOne({ name : config['top level item'] })
            .then(
              document => {
                Intro = document;
                done();
              },
              done
            );

        });

      });

      describe ( 'Intro type' , function () {

        it ( 'should be a type', function () {

          Intro.should.be.a.typeDocument({ name : config['top level item'] });

        });

      });

    });

    describe ( 'Get intro item' , function () {

      it ( 'should get intro item' , function (done) {

        Item
          .findOne({ type : Intro })
          .then(
            document => {
              intro = document;
              done();
            },
            done
          );

      });

    });

    describe ( 'Intro item' , function () {

      it ( 'should be an item', function () {

        intro.should.be.an.item({ type : Intro });

      });

    });

    describe ( 'Panelify intro' , function () {

      it ( 'should panelify', function (done) {

        intro
          .toPanelItem()
          .then(
            item => {
              intro = item;
              done();
            },
            done
          );

      });

      it ( 'should be be a panel item', function () {

        intro.should.be.a.panelItem();

      });

    });

    describe ( 'Start HTTP daemon' , function () {

      it ( 'should start a new HTTP server', function (done) {

        server = new Server({ intro });

        server.on('listening', () => done());

        global.syn_httpServer = server;

      });

    });

  });

  // describe ( 'wait 2 minutes' , function () {
  //
  //   it ( 'should wait 2 minutes' , function (done) {
  //
  //     const twoMinutes = 1000 * 60 * 2;
  //
  //     this.timeout(twoMinutes + 5000);
  //
  //     setTimeout(() => {
  //       done();
  //     }, twoMinutes);
  //
  //   });
  //
  // });

  describe ( 'Home page', function () {

    it ( 'should get home page' , function (done) {

      this.timeout(5000);

      superagent
        .get('http://localhost:13012/')
        .end((error, res) => {
          try {
            if ( error ) {
              throw error;
            }
            res.status.should.be.exactly(200);
            done();
          }
          catch ( error ) {
            done(error);
          }
        });

    });

  });

  describe ( 'Sign up', function () {

    it ( 'should post sign up' , function (done) {

      this.timeout(5000);

      superagent
        .post('http://localhost:13012/sign/up')
        .send({ email : 'signup@foo.com' , 'password' : '1234' })
        .end((error, res) => {
          try {
            if ( error ) {
              throw error;
            }
            res.status.should.be.exactly(200);
            done();
          }
          catch ( error ) {
            done(error);
          }
        });

    });

    describe ( 'Sign up as an existing user' , function () {

      it ( 'should throw a 401 error' , function (done) {

        this.timeout(5000);

        superagent
          .post('http://localhost:13012/sign/up')
          .send({ email : 'signup@foo.com' , 'password' : '1234' })
          .end((error, res) => {
            try {
              if ( ! error ) {
                throw new Error('It should have thrown error');
              }
              error.message.should.be.exactly('Unauthorized');
              res.status.should.be.exactly(401);
              done();
            }
            catch ( error ) {
              done(error);
            }
          });

      });

    });

  });

  describe ( 'Sign in' , function () {

    it ( 'should throw an 404 error for email not found', function (done) {

      this.timeout(5000);

      superagent
        .post('http://localhost:13012/sign/in')
        .send({ email : 'idontexist@fake.com' , 'password' : '1234' })
        .end((error, res) => {
          try {
            if ( ! error ) {
              throw new Error('It should have thrown error');
            }
            error.message.should.be.exactly('Not Found');
            res.status.should.be.exactly(404);
            done();
          }
          catch ( error ) {
            done(error);
          }
        });

    });

    it ( 'should throw an 401 error for wrong password', function (done) {

      this.timeout(5000);

      superagent
        .post('http://localhost:13012/sign/in')
        .send({ email : 'signup@foo.com' , 'password' : '12345' })
        .end((error, res) => {
          try {
            if ( ! error ) {
              throw new Error('It should have thrown error');
            }
            error.message.should.be.exactly('Unauthorized');
            res.status.should.be.exactly(401);
            done();
          }
          catch ( error ) {
            done(error);
          }
        });

    });

    it ( 'should login', function (done) {

      this.timeout(5000);

      superagent
        .post('http://localhost:13012/sign/in')
        .send({ email : 'signup@foo.com' , 'password' : '1234' })
        .end((error, res) => {
          try {
            if ( error ) {
              throw error;
            }
            res.status.should.be.exactly(200);
            done();
          }
          catch ( error ) {
            done(error);
          }
        });

    });

  });

});
