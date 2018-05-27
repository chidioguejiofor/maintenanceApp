/*  eslint no-unused-expressions: off */
/*  eslint no-undef: off */

import supertest from 'supertest';
import { expect } from 'chai';
import app from '../../app';
import initScript from '../../database/initScript';

const request = supertest(app);

const client = {
  username: 'client',
  password: 'password',
  email: 'email@email.com',
  userType: 'client',
};
const validObj = {
  title: 'Broken Shaft in Bathroom',
  description: 'The pipe in the bathroom is broken',
  location: 'Location is valid',
  image: 'http://image.png',
};
const invalidRequest = {
  title: 'e',
  description: 'Y',
  location: 'l',
  image: 'i',
};

initScript();


let clientToken = 'emptyToken';
before((done) => {
  console.log('Entered');
  request.post('/api/v1/auth/signup')
    .send(client)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .end((err, res) => {
      clientToken = res.body.data.token;
      console.log(clientToken, 'clientToken');
      done();
    });
});
describe('Request Routes', () => {
  describe('/users/requests Route', () => {
    describe('GET on an unknown route', () => {
      it('/abc', (done) => {
        request.get('/ds')
          .expect(404, done);
      });

      it('/api/v1/1234unknown', (done) => {
        request.get('/ds')
          .expect(404, done);
      });
    });

    describe('Existing Request Routes', () => {
      describe('POST routes', () => {
        const CREATE_ROUTE = '/api/v1/users/requests';
        describe(CREATE_ROUTE, () => {
          describe('if the request is valid', () => {
            describe('response status code', () => {
              it('should return status 201', (done) => {
                request
                  .post(CREATE_ROUTE)
                  .send(validObj)
                  .set('x-access-token', clientToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .expect(201, done);
              });
            });
            describe('response body', () => {
              it('should have a success property that is true', (done) => {
                request
                  .post(CREATE_ROUTE)
                  .set('Accept', 'application/json')
                  .set('x-access-token', clientToken)
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .send(validObj)
                  .end((error, resp) => {
                    expect(resp.body).property('success').to.be.true;
                    done();
                  });
              });
              it(`should have a data property that is an object with properties 
                       title, description, location, image, status and id`, (done) => {
                request
                  .post(CREATE_ROUTE)
                  .send(validObj)
                  .set('x-access-token', clientToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .end((error, resp) => {
                    expect(resp.body).property('data').property('title');
                    expect(resp.body).property('data').property('description');
                    expect(resp.body).property('data').property('location');
                    expect(resp.body).property('data').property('image');
                    expect(resp.body).property('data').property('status');
                    expect(resp.body).property('data').property('id');
                    done();
                  });
              });
            });
          });

          describe('if the request some fields are missing in the request', () => {
            describe('response status code', () => {
              it('should return status 400', (done) => {
                request
                  .post(CREATE_ROUTE)
                  .send({})
                  .set('x-access-token', clientToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .expect(400, done);
              });
            });
            describe('response body', () => {
              it('should have a success property that is false and a missingData property that is a array', (done) => {
                request
                  .post(CREATE_ROUTE)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .set('x-access-token', clientToken)
                  .send({})
                  .end((error, resp) => {
                    expect(resp.body).property('success').to.be.false;
                    expect(resp.body).property('missingData').to.be.a('array');
                    done();
                  });
              });
            });
          });

          describe('if the request some fields are missing in the request', () => {
            describe('response status code', () => {
              it('should return status 400', (done) => {
                request
                  .post(CREATE_ROUTE)
                  .send(invalidRequest)
                  .set('x-access-token', clientToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .expect(400, done);
              });
            });
            describe('response body', () => {
              it('should have a success property that is false and a invalidData property that is a array', (done) => {
                request
                  .post(CREATE_ROUTE)
                  .set('Accept', 'application/json')
                  .set('x-access-token', clientToken)
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .send(invalidRequest)
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

      describe('GET routes', () => {
        describe('GET /api/v1/users/requests', () => {
          describe('if items exists', () => {
            it('should return a 200 http code ', (done) => {
              request.get('/api/v1/users/requests')
                .set('x-access-token', clientToken)
                .expect('Content-Type', /json/)
                .expect(200, done);
            });
            it('should  a body that has an array property named "data"', (done) => {
              request.get('/api/v1/users/requests')
                .set('x-access-token', clientToken)
                .expect('Content-Type', /json/)
                .end((error, resp) => {
                  expect(resp.body).property('success').to.be.true;
                  done();
                });
            });
          });
        });
      });


      describe('GET /users/requests/<requestId>', () => {
        let requestRoute;
        before((done) => {
          request.get('/api/v1/users/requests/')
            .set('x-access-token', clientToken)
            .end((err, resp) => {
              const { data } = resp.body;
              requestRoute = `/api/v1/users/requests/${data[0].id}`;
              done();
            });
        });

        describe('if the id is valid then ', () => {
          describe('the response should have a status code that', () => {
            it('should be  200', (done) => {
              request.get(requestRoute)
                .set('x-access-token', clientToken)
                .expect('Content-Type', /json/)
                .expect(200, done);
            });
          });

          describe('the response body  should', () => {
            describe('have a success property ', () => {
              it('that is true', (done) => {
                request.get(requestRoute)
                  .set('x-access-token', clientToken)
                  .expect('Content-Type', /json/)
                  .end((err, resp) => {
                    expect(resp.body).property('success').to.be.true;
                    done();
                  });
              });
            });

            describe('have a data property ', () => {
              it('that has property id', (done) => {
                request.get(requestRoute)
                  .set('x-access-token', clientToken)
                  .end((err, resp) => {
                    expect(resp.body).property('data').to.haveOwnProperty('id');
                    done();
                  });
              });
              it('that has property id', (done) => {
                request.get(requestRoute)
                  .set('x-access-token', clientToken)
                  .end((err, resp) => {
                    expect(resp.body).property('data').to.haveOwnProperty('id');
                    done();
                  });
              });

              it('that has property image', (done) => {
                request.get(requestRoute)
                  .set('x-access-token', clientToken)
                  .end((err, resp) => {
                    expect(resp.body).property('data').to.haveOwnProperty('image');
                    done();
                  });
              });

              it('that has property description', (done) => {
                request.get(requestRoute)
                  .set('x-access-token', clientToken)
                  .end((err, resp) => {
                    expect(resp.body).property('data').to.haveOwnProperty('description');
                    done();
                  });
              });

              it('that has property status', (done) => {
                request.get(requestRoute)
                  .set('x-access-token', clientToken)
                  .end((err, resp) => {
                    expect(resp.body).property('data').to.haveOwnProperty('status');
                    done();
                  });
              });

              it('that has property title', (done) => {
                request.get(requestRoute)
                  .set('x-access-token', clientToken)
                  .end((err, resp) => {
                    expect(resp.body).property('data').to.haveOwnProperty('title');
                    done();
                  });
              });
            });
          });
        });

        describe('if the id is invalid', () => {
          const badRequestRoute = '/api/v1/users/requests/10000';
          describe('the response ', () => {
            describe('status should be 404', () => {
              it('expects 404 status', (done) => {
                request.get(badRequestRoute)
                  .set('x-access-token', clientToken)
                  .expect(404, done);
              });
            });
            describe('response body ', () => {
              it('should have a success property that is false', (done) => {
                request.get(badRequestRoute)
                  .set('x-access-token', clientToken)
                  .expect(404)
                  .end((err, resp) => {
                    expect(resp.body).property('success').to.be.false;
                    done();
                  });
              });

              it('should have a message property', (done) => {
                request.get(badRequestRoute)
                  .set('x-access-token', clientToken)
                  .end((err, resp) => {
                    expect(resp.body).to.have.property('message');
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
