/*  eslint no-unused-expressions: off */
/*  eslint no-undef: off */

import supertest from 'supertest';
import { expect } from 'chai';
import app from '../../app';
import initScript from '../../database/initScript';
import Seeder from '../../database/seeders/Seeder';

const request = supertest(app);

const clientEmail = 'email@email.com';
const clientInitResetObj = {
  email: clientEmail,
  userType: 'client',
};
const validClient = {
  username: 'username',
  password: 'password0',
  email: clientEmail,
  userType: 'client',
};

const newClient = {
  username: 'newClientUsername',
  password: 'newPassword123456',
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
          it('should return status 201', (done) => {
            request
              .post(SIGNUP_ROUTE)
              .send(validClient)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .expect(201, done);
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

          it(`should have a data property that is an object with properties 
          username, email, token`, (done) => {
            request
              .post(SIGNUP_ROUTE)
              .send(validClient)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .end((error, resp) => {
                expect(resp.body).property('data').is.an('object');
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
          it('should return status 201', (done) => {
            request
              .post(LOGIN_ROUTE)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .send(validClient)
              .expect(201, done);
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
          it('should return status 201', (done) => {
            request
              .post(RESET_ROUTE)
              .send(clientInitResetObj)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .expect(201, done);
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

          it('should have a data property that is an object with property token', (done) => {
            request
              .post(RESET_ROUTE)
              .send(clientInitResetObj)
              .set('Accept', 'application/json')
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .end((error, resp) => {
                expect(resp.body).property('data').property('token');
                done();
              });
          });

          it('should have a message property ', (done) => {
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
    describe(RESET_ROUTE, () => {
      let resetToken = '';
      describe(`PUT ${RESET_ROUTE}`, () => {
        before((done) => {
          request
            .post(RESET_ROUTE)
            .send(clientInitResetObj)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .end((err, resp) => {
              resetToken = resp.body.data.token;

              done();
            });
        });


        describe('if the request is valid', () => {
          describe('status code', () => {
            it('should equal 201 Created', (done) => {
              request
                .put(RESET_ROUTE)
                .set('x-access-token', resetToken)
                .send(newClient)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .expect(201, done);
            });
          });

          describe('response body', () => {
            it('should have a success property that is true', (done) => {
              request
                .put(RESET_ROUTE)
                .set('x-access-token', resetToken)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(newClient)
                .end((err, resp) => {
                  expect(resp.body).property('success')
                    .to.be.true;
                  done();
                });
            });

            it('should have a data property with properties email and password', (done) => {
              request
                .put(RESET_ROUTE)
                .set('x-access-token', resetToken)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(newClient)
                .end((err, resp) => {
                  expect(resp.body)
                    .property('data')
                    .property('email');
                  expect(resp.body)
                    .property('data')
                    .property('username');
                  done();
                });
            });

            describe('data property', () => {
              it(`email must equal ${clientInitResetObj.email}`, (done) => {
                request
                  .put(RESET_ROUTE)
                  .set('x-access-token', resetToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .send(newClient)
                  .end((err, resp) => {
                    expect(resp.body)
                      .property('data')
                      .property('email')
                      .to.equal(clientInitResetObj.email);
                    done();
                  });
              });

              it(`username must equal ${newClient.username}`, (done) => {
                request
                  .put(RESET_ROUTE)
                  .set('x-access-token', resetToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .send(newClient)
                  .end((err, resp) => {
                    expect(resp.body)
                      .property('data')
                      .property('username')
                      .to.equal(newClient.username);
                    done();
                  });
              });
            });
          });
        });
        describe('if the request is invalid', () => {
          describe('if the token is invalid', () => {
            describe('status code', (done) => {
              it('should equal 403 Forbidden', () => {
                request
                  .put(RESET_ROUTE)
                  .set('x-access-token', 'dsad')
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .expect(403, done);
              });
            });

            describe('request body', () => {
              it('should have a success property equal to false', (done) => {
                request
                  .put(RESET_ROUTE)
                  .set('x-access-token', 'dsad')
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .end((err, resp) => {
                    expect(resp.body).property('success').to.be.false;
                    done();
                  });
              });
              it('should have a message property ', (done) => {
                request
                  .put(RESET_ROUTE)
                  .set('x-access-token', 'dsad')
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .end((err, resp) => {
                    expect(resp.body).property('message');
                    done();
                  });
              });
            });
          });


          describe('if the object token is valid but some data is missing in request', () => {
            describe('status code', () => {
              it('should be equal to 400 Bad Request', (done) => {
                request
                  .put(RESET_ROUTE)
                  .set('x-access-token', resetToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .send({})
                  .expect(400, done);
              });
            });
            describe('response body', () => {
              it('should have  an missingData proerty ', (done) => {
                request
                  .put(RESET_ROUTE)
                  .set('x-access-token', resetToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .send({})
                  .end((err, resp) => {
                    expect(resp.body).property('missingData')
                      .to.be.an('array');
                    done();
                  });
              });
              it('should have success property equal to false', (done) => {
                request
                  .put(RESET_ROUTE)
                  .set('x-access-token', resetToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .send({})
                  .end((err, resp) => {
                    expect(resp.body).property('success').to.be.false;
                    done();
                  });
              });

              it('should have message property ', (done) => {
                request
                  .put(RESET_ROUTE)
                  .set('x-access-token', resetToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .send({})
                  .end((err, resp) => {
                    expect(resp.body).property('message');
                    done();
                  });
              });
            });
          });

          describe('if the object token is valid but the request body in invalid', () => {
            describe('response body', () => {
              it('should have success property equal to false', (done) => {
                request
                  .put(RESET_ROUTE)
                  .set('x-access-token', resetToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .send(invalidObj)
                  .end((err, resp) => {
                    expect(resp.body).property('success').to.be.false;
                    done();
                  });
              });

              it('should have message property ', (done) => {
                request
                  .put(RESET_ROUTE)
                  .set('x-access-token', resetToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .send(invalidObj)
                  .end((err, resp) => {
                    expect(resp.body).property('message');
                    done();
                  });
              });

              it('should have  an invalidData proerty that is an array of objects', (done) => {
                request
                  .put(RESET_ROUTE)
                  .set('x-access-token', resetToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .send(invalidObj)
                  .end((err, resp) => {
                    expect(resp.body).property('invalidData')
                      .to.be.an('object');
                    const keys = Object.keys(resp.body.invalidData);
                    expect(keys.length > 0).to.be.true;
                    done();
                  });
              });
            });
          });
        });
      });
    });
  });
});

