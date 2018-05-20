/*  eslint no-unused-expressions: off */
/*  eslint no-undef: off */

import request from 'supertest';
import { expect } from 'chai';
import app from '../../app';
import User from '../../models/User';

describe('User Routes', () => {
  describe('POST routes', () => {
    const LOGIN_ROUTE = '/api/v1/auth/signup';
    describe(LOGIN_ROUTE, () => {
      const validObj = new User('username', 'password0', 'email@email.com', 'client');
      const invalidObj = new User('rr', 'aa', 'com', 'lient');
      describe('if request is valid', () => {
        describe('response status code', () => {
          it('should return status 201', (done) => {
            request(app)
              .post(LOGIN_ROUTE)
              .send(validObj)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .expect(201, done);
          });
        });
        describe('response body', () => {
          it('should have a success property that is true', (done) => {
            request(app)
              .post(LOGIN_ROUTE)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .send(validObj)
              .end((error, resp) => {
                expect(resp.body).property('success').to.be.true;
                done();
              });
          });

          it(`should have a data property that is an object with properties 
          username, email, userType`, (done) => {
            request(app)
              .post(LOGIN_ROUTE)
              .send(validObj)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .end((error, resp) => {
                expect(resp.body).property('data').property('username');
                expect(resp.body).property('data').property('email');
                expect(resp.body).property('data').property('userType');
                done();
              });
          });
        });
      });

      describe('if some fields are missing in the requests', () => {
        describe('response status code', () => {
          it('should return status 400', (done) => {
            request(app)
              .post(LOGIN_ROUTE)
              .send({})
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .expect(400, done);
          });
        });

        describe('response body', () => {
          it('should have a success property that is false and a missingData property that is a array', (done) => {
            request(app)
              .post(LOGIN_ROUTE)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .send({})
              .end((error, resp) => {
                expect(resp.body).property('success').to.be.false;
                expect(resp.body).property('missingData').to.be.a('array');
                done();
              });
          });
        });
      });

      describe('if some fields in the request is/are invalid ', () => {
        describe('response status code', () => {
          it('should return status 400', (done) => {
            request(app)
              .post(LOGIN_ROUTE)
              .send(invalidObj)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .expect(400, done);
          });
        });

        describe('response body', () => {
          it('should have a success property that is false and a invalidData property that is a array', (done) => {
            request(app)
              .post(LOGIN_ROUTE)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .send({})
              .end((error, resp) => {
                expect(resp.body).property('success').to.be.false;
                expect(resp.body).property('invalidData').to.be.a('array');
                done();
              });
          });
        });
      });
    });
  });
});

