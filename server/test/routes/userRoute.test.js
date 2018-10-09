/*  eslint no-unused-expressions: off */
/*  eslint no-undef: off */

import supertest from 'supertest';
import { expect } from 'chai';
import app from '../../app';
import initScript from '../../database/initScript';
import Seeder from '../../database/seeders/Seeder';

const request = supertest(app);

const clientEmail = 'professorchidi@yahoo.com';
const clientInitResetObj = {
  email: clientEmail,
  userType: 'client',
  password: 'password123456',
};
const validClient = {
  username: 'username',
  password: 'password0',
  email: clientEmail,
  userType: 'client',
};


const invalidObj = {
  username: 'rr',
  password: 'a',
  email: 'com',
  userType: 'lient',
};

describe('User Routes', () => {
  describe('POST routes', () => {
    const SIGNUP_ROUTE = '/api/v1/auth/signup';
    describe(SIGNUP_ROUTE, () => {
      beforeEach((done) => {
        initScript();
        done();
      });

      describe('if request is valid', () => {
        describe('response status code', () => {
          it('should return status 200', (done) => {
            request
              .post(SIGNUP_ROUTE)
              .send(validClient)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .expect(200, done);
          });
        });
        describe('response body', () => {
          it('should have a success property that is true', (done) => {
            request
              .post(SIGNUP_ROUTE)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .send(validClient)
              .end((error, resp) => {
                expect(resp.body).property('success').to.be.true;
                done();
              });
          });

          it('should have a message property', (done) => {
            request
              .post(SIGNUP_ROUTE)
              .send(validClient)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .end((error, resp) => {
                expect(resp.body).property('message');
                done();
              });
          });
        });
      });

      describe('if some fields are missing in the requests', () => {
        describe('response status code', () => {
          it('should return status 400', (done) => {
            request
              .post(SIGNUP_ROUTE)
              .send({})
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .expect(400, done);
          });
        });

        describe('response body', () => {
          it('should have a success property that is false and a missingData property that is a array', (done) => {
            request
              .post(SIGNUP_ROUTE)
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
            request
              .post(SIGNUP_ROUTE)
              .send(invalidObj)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .expect(400, done);
          });
        });

        describe('response body', () => {
          it('should have a success property that is false and a invalidData property that is a object', (done) => {
            request
              .post(SIGNUP_ROUTE)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .send(invalidObj)
              .end((error, resp) => {
                expect(resp.body).property('success').to.be.false;
                expect(resp.body).property('invalidData').to.be.a('object');
                const keys = Object.keys(resp.body.invalidData);
                expect(keys.length > 0).to.be.true;
                done();
              });
          });
        });
      });
    });

    const LOGIN_ROUTE = '/api/v1/auth/login';
    describe(LOGIN_ROUTE, () => {
      before((done) => {
        initScript();
        Seeder.addClient(validClient);
        done();
      });
      describe('if request is valid', () => {
        describe('response status code', () => {
          it('should return status 200', (done) => {
            request
              .post(LOGIN_ROUTE)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .send(validClient)
              .expect(200, done);
          });
        });
        describe('response body', () => {
          it('should have a success property that is true', (done) => {
            request
              .post(LOGIN_ROUTE)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .send(validClient)
              .end((error, resp) => {
                expect(resp.body).property('success').to.be.true;
                done();
              });
          });

          it(`should have a data property that is an object with properties 
          username, email, token`, (done) => {
            request
              .post(LOGIN_ROUTE)
              .send(validClient)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .end((error, resp) => {
                expect(resp.body).property('data').property('username');
                expect(resp.body).property('data').property('email');
                expect(resp.body).property('data').property('token');
                done();
              });
          });
        });
      });

      describe('if some fields are missing in the requests', () => {
        describe('response status code', () => {
          it('should return status 400', (done) => {
            request
              .post(LOGIN_ROUTE)
              .send({})
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .expect(400, done);
          });
        });

        describe('response body', () => {
          it('should have a success property that is false and a missingData property that is a array', (done) => {
            request
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
            request
              .post(LOGIN_ROUTE)
              .send(invalidObj)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .expect(400, done);
          });
        });

        describe('response body', () => {
          it('should have a success property that is false and a invalidData property that is a object', (done) => {
            request
              .post(LOGIN_ROUTE)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .send({
                username: 'u',
                password: 'p',
                userType: 'client',
              })
              .end((error, resp) => {
                expect(resp.body).property('success').to.be.false;
                expect(resp.body).property('invalidData').to.be.a('object');
                const keys = Object.keys(resp.body.invalidData);
                expect(keys.length > 0).to.be.true;
                done();
              });
          });
        });
      });
    });

    const RESET_ROUTE = '/api/v1/auth/reset';

    describe(`POST ${RESET_ROUTE}`, () => {
      describe('if request is valid', () => {
        describe('response status code', () => {
          it('should return status 200', (done) => {
            request
              .post(RESET_ROUTE)
              .send(clientInitResetObj)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .expect(200, done);
          });
        });
        describe('response body', () => {
          it('should have a success property that is true', (done) => {
            request
              .post(RESET_ROUTE)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .send(clientInitResetObj)
              .end((error, resp) => {
                expect(resp.body).property('success').to.be.true;
                done();
              });
          });

          it('should have a message property', (done) => {
            request
              .post(RESET_ROUTE)
              .send(clientInitResetObj)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .end((error, resp) => {
                expect(resp.body).property('message');
                done();
              });
          });
        });
      });

      describe('if some fields are missing in the requests', () => {
        describe('response status code', () => {
          it('should return status 400', (done) => {
            request
              .post(RESET_ROUTE)
              .send({})
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .expect(400, done);
          });
        });

        describe('response body', () => {
          it('should have a success property that is false and a missingData property that is a array', (done) => {
            request
              .post(RESET_ROUTE)
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

      describe('if the email in the request is invalid ', () => {
        const invalidResetObj = {
          email: 'chi.com',
        };
        describe('response status code', () => {
          it('should return status 400', (done) => {
            request
              .post(RESET_ROUTE)
              .send(invalidResetObj)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .expect(400, done);
          });
        });

        describe('response body', () => {
          it('should have a success property that is false ', (done) => {
            request
              .post(RESET_ROUTE)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .send(invalidResetObj)
              .end((error, resp) => {
                expect(resp.body).property('success').to.be.false;
                done();
              });
          });
        });
      });
    });
  });
});

