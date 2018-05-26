/*  eslint no-unused-expressions: off */
/*  eslint no-undef: off */

import supertest from 'supertest';
import { expect } from 'chai';
import app from '../../app';
import seeder from '../../database/seeders/seeder';

const request = supertest(app);
const validObj = {
  title: 'Hellooo World',
  description: 'Yoaaaaa',
  location: 'llocation is valid',
  image: 'iamge is cool',
};
const invalidRequest = {
  title: 'e',
  description: 'Y',
  location: 'l',
  image: 'i',
};


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

  describe('Request Routes', () => {
    describe('PUT routes', () => {
      const id = 2;
      const updateRequestValidRoute = `/api/v1/users/requests/${id}`;
      const invalidUpdateRoute = '/api/v1/users/requests/invalidId';
      describe('/api/v1/users/requests/<requestId>', () => {
        describe('if the request is valid', () => {
          describe('response status code', () => {
            it('should return status 201', (done) => {
              request.put(updateRequestValidRoute)
                .send(validObj)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .expect(201, done);
            });
          });
          describe('response body', () => {
            it('should have a success property that is true', (done) => {
              request.put(updateRequestValidRoute)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(validObj)
                .end((error, resp) => {
                  expect(resp.body).property('success').to.be.true;
                  done();
                });
            });
            it(`should have a data property that is an object with properties 
                     title, description, location, image, clientId and id`, (done) => {
              request
                .put(updateRequestValidRoute)
                .send(validObj)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((error, resp) => {
                  expect(resp.body).property('data').property('title');
                  expect(resp.body).property('data').property('description');
                  expect(resp.body).property('data').property('location');
                  expect(resp.body).property('data').property('image');
                  expect(resp.body).property('data').property('clientId');
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
                .put(updateRequestValidRoute)
                .send({})
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .expect(400, done);
            });
          });
          describe('response body', () => {
            it('should have a success property that is false and a missingData property that is a array', (done) => {
              request
                .put(updateRequestValidRoute)
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

        describe('if the request some fields are missing in the request', () => {
          describe('response status code', () => {
            it('should return status 400', (done) => {
              request
                .put(updateRequestValidRoute)
                .send(invalidRequest)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .expect(400, done);
            });
          });
          describe('response body', () => {
            it('should have a success property that is false and a invalidData property that is a array', (done) => {
              request
                .put(updateRequestValidRoute)
                .set('Accept', 'application/json')
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

        describe('if the id of the request is invalid', () => {
          describe('response status code', () => {
            it('should return status 404', (done) => {
              request
                .put(invalidUpdateRoute)
                .send(validObj)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .expect(404, done);
            });
          });

          describe('response body', () => {
            it('should have a success property that is false ', (done) => {
              request
                .put(updateRequestValidRoute)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(invalidRequest)
                .end((error, resp) => {
                  expect(resp.body).property('success').to.be.false;
                  done();
                });
            });
          });
        });
      });
    });


    describe('POST routes', () => {
      const CREATE_ROUTE = '/api/v1/users/requests';
      describe(CREATE_ROUTE, () => {
        describe('if the request is valid', () => {
          describe('response status code', () => {
            it('should return status 201', (done) => {
              request
                .post(CREATE_ROUTE)
                .send(validObj)
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
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .send(validObj)
                .end((error, resp) => {
                  expect(resp.body).property('success').to.be.true;
                  done();
                });
            });
            it(`should have a data property that is an object with properties 
                     title, description, location, image, clientId and id`, (done) => {
              request
                .post(CREATE_ROUTE)
                .send(validObj)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((error, resp) => {
                  expect(resp.body).property('data').property('title');
                  expect(resp.body).property('data').property('description');
                  expect(resp.body).property('data').property('location');
                  expect(resp.body).property('data').property('image');
                  expect(resp.body).property('data').property('clientId');
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
              .expect('Content-Type', /json/)
              .expect(200, done);
          });
          it('should  a body that has an array property named "data"', (done) => {
            request.get('/api/v1/users/requests')
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
      describe('if the id is valid then ', () => {
        describe('the response should have a status code that', (done) => {
          it('should be  200', () => {
            request.get(`/api/v1/users/requests/${id}`)
              .expect('Content-Type', /json/)
              .expect(200, done);
          });
        });

        describe('the response body should should ', () => {
          describe('should have a success property ', () => {
            it('that is true', (done) => {
              request.get(`/api/v1/users/requests/${id}`)
                .expect('Content-Type', /json/)
                .end((err, resp) => {
                  expect(resp.body).property('success').to.be.true;
                  done();
                });
            });
          });

          describe('should have a data property ', () => {
            it('that has property id', () => {
              request.get(`/api/v1/users/requests/${id}`)
                .end((err, resp) => {
                  expect(resp.body).property('data').to.haveOwnProperty('id');
                });
            });

            it('that has property image', () => {
              request.get(`/api/v1/users/requests/${id}`)
                .end((err, resp) => {
                  expect(resp.body).property('data').to.haveOwnProperty('image');
                });
            });

            it('that has property description', () => {
              request.get(`/api/v1/users/requests/${id}`)
                .end((err, resp) => {
                  expect(resp.body).property('data').to.haveOwnProperty('description');
                });
            });

            it('that has property clientId', () => {
              request.get(`/api/v1/users/requests/${id}`)
                .end((err, resp) => {
                  expect(resp.body).property('data').to.haveOwnProperty('clientId');
                });
            });

            it('that has property title', () => {
              request.get(`/api/v1/users/requests/${id}`)
                .end((err, resp) => {
                  expect(resp.body).property('data').to.haveOwnProperty('title');
                });
            });
          });
        });
      });

      describe('if the id is invalid', () => {
        const badRequestRoute = '/api/v1/users/requests/fakeRequestID';
        describe('the response ', () => {
          describe('status should be 404', () => {
            it('expects 404 status', (done) => {
              request.get(badRequestRoute)
                .expect(404, done);
            });
          });
          describe('response body ', () => {
            it('should have a success property that is false', (done) => {
              request.get(badRequestRoute)
                .expect(404)
                .end((err, resp) => {
                  expect(resp.body).property('success').to.be.false;
                  done();
                });
            });

            it('should have a message property', (done) => {
              request.get(badRequestRoute)
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

