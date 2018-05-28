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
const CREATE_ROUTE = '/api/v1/users/requests';

initScript();


let clientToken = 'emptyToken';
let engineerToken = '';
before((done) => {
  request.post('/api/v1/auth/signup')
    .send(client)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .end((err, res) => {
      clientToken = res.body.data.token;
    });
  request.post('/api/v1/auth/login')
    .send({
      username: 'superEngineer',
      password: 'super123456',
      userType: 'engineer',

    })
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .end((err, res) => {
      engineerToken = res.body.data.token;
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


          describe('if the token is invalid', () => {
            it('should expect status 403', (done) => {
              request.get(CREATE_ROUTE)
                .set('x-access-token', engineerToken)
                .expect(403, done);
            });
            it('body should have a success property that is false', (done) => {
              request.get(CREATE_ROUTE)
                .set('x-access-token', engineerToken)
                .end((err, resp) => {
                  expect(resp.body).property('success').to.be.false;
                  done();
                });
            });
            it('body should have a message property', (done) => {
              request.get(CREATE_ROUTE)
                .set('x-access-token', engineerToken)
                .end((err, resp) => {
                  expect(resp.body).property('message');
                  done();
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
      describe('PUT routes', () => {
        let approveRoute = '';
        let resolveRoute = '';
        let disapproveRoute = '';
        let invalidStatusRoute = '';
        before((done) => {
          request.get('/api/v1/users/requests/')
            .set('x-access-token', clientToken)
            .end((err, resp) => {
              const { data } = resp.body;
              approveRoute = `/api/v1/requests/${data[0].id}/approve`;
              resolveRoute = `/api/v1/requests/${data[0].id}/resolve`;
              disapproveRoute = `/api/v1/requests/${data[0].id}/disapprove`;
              invalidStatusRoute = `/api/v1/requests/${data[0].id}/sing`;
              done();
            });
        });

        describe('/users/requests/<requestId>', () => {
          let updateRoute = '';
          let approveNew = '';

          before((done) => {
            request
              .post(CREATE_ROUTE)
              .send(validObj)
              .set('x-access-token', clientToken)
              .set('Content-Type', 'application/x-www-form-urlencoded')
              .end((err, resp) => {
                const { data: { id: newId } } = resp.body;
                updateRoute = `/api/v1/users/requests/${newId}`;
                approveNew = `/api/v1/requests/${newId}/approve`;
                done();
              });
          });
          describe('if the request has not yet been approved', () => {
            describe('request body data property', () => {
              it('should have a data property that is an object', (done) => {
                request.put(updateRoute)
                  .send(validObj)
                  .set('x-access-token', clientToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .end((err, resp) => {
                    console.log(resp.body, 'invalidBody');
                    expect(resp.body).property('data').to.be.an('object');
                    done();
                  });
              });
              it('should have id', (done) => {
                request.put(updateRoute)
                  .send(validObj)
                  .set('x-access-token', clientToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .end((err, resp) => {
                    expect(resp.body).property('data')
                      .property('id');
                    done();
                  });
              });

              it('should have message', (done) => {
                request.put(updateRoute)
                  .send(validObj)
                  .set('x-access-token', clientToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .end((err, resp) => {
                    expect(resp.body).property('data')
                      .property('message');
                    done();
                  });
              });

              it('should have status property that equals "created"', (done) => {
                request.put(updateRoute)
                  .send(validObj)
                  .set('x-access-token', clientToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .end((err, resp) => {
                    expect(resp.body).property('data')
                      .property('status')
                      .equals('created');
                    done();
                  });
              });
            });
          });

          describe('if the request has  been approved', () => {
            before((done) => {
              request.put(approveNew)
                .set('x-access-token', engineerToken)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, resp) => {
                  console.log(resp.body, 'beforeBody');
                  done();
                });
            });

            describe('status code', () => {
              it('should be 409 "Conflict"', (done) => {
                request.put(updateRoute)
                  .send(validObj)
                  .set('x-access-token', clientToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .expect(409, done);
              });
            });

            describe('request body', () => {
              it('should have a successs property that is false', (done) => {
                request.put(updateRoute)
                  .send(validObj)
                  .set('x-access-token', clientToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .end((err, resp) => {
                    expect(resp.body).property('success').to.be.false;
                    done();
                  });
              });

              it('should have a message property', (done) => {
                request.put(updateRoute)
                  .send(validObj)
                  .set('x-access-token', clientToken)
                  .set('Accept', 'application/json')
                  .set('Content-Type', 'application/x-www-form-urlencoded')
                  .end((err, resp) => {
                    expect(resp.body).property('message');
                    done();
                  });
              });
            });
          });
        });

        describe('/api/v1/requests/<status>', () => {
          describe('/api/v1/requests/<invalidStatus>', () => {
            it('should return a status of 404', (done) => {
              request.put(invalidStatusRoute)
                .set('x-access-token', engineerToken)
                .expect(404, done);
            });
            describe('request body', () => {
              it('should have a success property that is false', (done) => {
                request.put(invalidStatusRoute)
                  .set('x-access-token', engineerToken)
                  .end((err, resp) => {
                    expect(resp.body).property('success').to.be.false;
                    done();
                  });
              });

              it('should have a message property that is false', (done) => {
                request.put(invalidStatusRoute)
                  .set('x-access-token', engineerToken)
                  .end((err, resp) => {
                    expect(resp.body).property('message');
                    done();
                  });
              });
            });
          });
          describe('if the token is invalid', () => {
            describe('if it is a clientToken', () => {
              it('body should have a success property that is false', (done) => {
                request.get(resolveRoute)
                  .set('x-access-token', clientToken)
                  .end((err, resp) => {
                    expect(resp.body).property('success').to.be.false;
                    done();
                  });
              });
              it('body should have a message property', (done) => {
                request.get(resolveRoute)
                  .set('x-access-token', clientToken)
                  .end((err, resp) => {
                    expect(resp.body).property('message');
                    done();
                  });
              });
              it('should expect status 403', (done) => {
                request.get(resolveRoute)
                  .set('x-access-token', clientToken)
                  .expect(403, done);
              });
            });
            describe('PUT /api/v1/requests/disapprove', () => {
              describe('if it is not a token', () => {
                it('body should have a success property that is false', (done) => {
                  request.get(resolveRoute)
                    .set('x-access-token', 'eafaketoken')
                    .end((err, resp) => {
                      expect(resp.body).property('success').to.be.false;
                      done();
                    });
                });
                it('body should have a message property', (done) => {
                  request.get(resolveRoute)
                    .set('x-access-token', 'eafaketoken')
                    .end((err, resp) => {
                      expect(resp.body).property('message');
                      done();
                    });
                });
                it('should expect status 401', (done) => {
                  request.get(resolveRoute)
                    .set('x-access-token', 'eafaketoken')
                    .expect(401, done);
                });
              });
            });
            describe('if the id exists ', () => {
              describe('status code', () => {
                it('status should be 201', (done) => {
                  request.put(disapproveRoute)
                    .set('x-access-token', engineerToken)
                    .expect(201, done);
                });
              });

              describe('response body', () => {
                it('should have a success property that is true', (done) => {
                  request.put(disapproveRoute)
                    .set('x-access-token', engineerToken)
                    .end((err, resp) => {
                      expect(resp.body).property('success').to.be.true;
                      done();
                    });
                });

                it('should have a data property that is an object', (done) => {
                  request.put(disapproveRoute)
                    .set('x-access-token', engineerToken)
                    .end((err, resp) => {
                      expect(resp.body).property('data').to.be.an('object');
                      done();
                    });
                });

                describe('request body data property', () => {
                  it('should have an id', (done) => {
                    request.put(disapproveRoute)
                      .set('x-access-token', engineerToken)
                      .end((err, resp) => {
                        expect(resp.body)
                          .property('data')
                          .property('id');
                        done();
                      });
                  });

                  it('should have an message', (done) => {
                    request.put(disapproveRoute)
                      .set('x-access-token', engineerToken)
                      .end((err, resp) => {
                        expect(resp.body)
                          .property('data')
                          .property('message');
                        done();
                      });
                  });

                  it('should have a status property that is equal to "disapproved"', (done) => {
                    request.put(disapproveRoute)
                      .set('x-access-token', engineerToken)
                      .end((err, resp) => {
                        expect(resp.body)
                          .property('data')
                          .property('status')
                          .to.equal('disapproved');
                        done();
                      });
                  });
                });
              });
            });
          });

          describe('PUT /api/v1/requests/resolve', () => {
            describe('if the id exists ', () => {
              describe('status code', () => {
                it('status should be 201', (done) => {
                  request.put(resolveRoute)
                    .set('x-access-token', engineerToken)
                    .expect(201, done);
                });
              });

              describe('response body', () => {
                it('should have a success property that is true', (done) => {
                  request.put(resolveRoute)
                    .set('x-access-token', engineerToken)
                    .end((err, resp) => {
                      expect(resp.body).property('success').to.be.true;
                      done();
                    });
                });

                it('should have a data property that is an object', (done) => {
                  request.put(resolveRoute)
                    .set('x-access-token', engineerToken)
                    .end((err, resp) => {
                      expect(resp.body).property('data').to.be.an('object');
                      done();
                    });
                });

                describe('request body data property', () => {
                  it('should have an id', (done) => {
                    request.put(resolveRoute)
                      .set('x-access-token', engineerToken)
                      .end((err, resp) => {
                        expect(resp.body)
                          .property('data')
                          .property('id');
                        done();
                      });
                  });

                  it('should have an message', (done) => {
                    request.put(resolveRoute)
                      .set('x-access-token', engineerToken)
                      .end((err, resp) => {
                        expect(resp.body)
                          .property('data')
                          .property('message');
                        done();
                      });
                  });

                  it('should have a status property that is equal to "resolved"', (done) => {
                    request.put(resolveRoute)
                      .set('x-access-token', engineerToken)
                      .end((err, resp) => {
                        expect(resp.body)
                          .property('data')
                          .property('status')
                          .to.equal('resolved');
                        done();
                      });
                  });
                });
              });
            });
          });

          describe(`PUT ${approveRoute}`, () => {
            describe('if the id exists ', () => {
              describe('status code', () => {
                it('status should be 201', (done) => {
                  request.put(approveRoute)
                    .set('x-access-token', engineerToken)
                    .expect(201, done);
                });
              });

              describe('response body', () => {
                it('should have a success property that is true', (done) => {
                  request.put(approveRoute)
                    .set('x-access-token', engineerToken)
                    .end((err, resp) => {
                      expect(resp.body).property('success').to.be.true;
                      done();
                    });
                });

                it('should have a data property that is an object', (done) => {
                  request.put(approveRoute)
                    .set('x-access-token', engineerToken)
                    .end((err, resp) => {
                      expect(resp.body).property('data').to.be.an('object');
                      done();
                    });
                });

                describe('request body data property', () => {
                  it('should have an id', (done) => {
                    request.put(approveRoute)
                      .set('x-access-token', engineerToken)
                      .end((err, resp) => {
                        expect(resp.body)
                          .property('data')
                          .property('id');
                        done();
                      });
                  });

                  it('should have an message', (done) => {
                    request.put(approveRoute)
                      .set('x-access-token', engineerToken)
                      .end((err, resp) => {
                        expect(resp.body)
                          .property('data')
                          .property('message');
                        done();
                      });
                  });

                  it('should have a status property that is equal to "approved"', (done) => {
                    request.put(approveRoute)
                      .set('x-access-token', engineerToken)
                      .end((err, resp) => {
                        expect(resp.body)
                          .property('data')
                          .property('status')
                          .to.equal('approved');
                        done();
                      });
                  });
                });
              });
            });
          });
        });
      });


      describe('GET routes', () => {
        describe('GET /api/v1/requests', () => {
          const route = '/api/v1/requests';
          describe('if requests have been made', () => {
            describe('status code', () => {
              it('should return status of 200', (done) => {
                request.get(route)
                  .set('x-access-token', engineerToken)
                  .expect(200, done);
              });
            });

            describe('request body data property', () => {
              it('should be an array', (done) => {
                request.get(route)
                  .set('x-access-token', engineerToken)
                  .end((err, resp) => {
                    expect(resp.body).property('data').to.be.an('array');
                    done();
                  });
              });

              describe('the array contained in the data property', () => {
                it('all the elements of the array should be an array', (done) => {
                  request.get(route)
                    .set('x-access-token', engineerToken)
                    .end((err, resp) => {
                      const array = resp.body.data;
                      const allObj = array.every(item => typeof item === 'object');
                      expect(allObj).to.be.true;
                      done();
                    });
                });

                it('the elements of the array must have an id ', (done) => {
                  request.get(route)
                    .set('x-access-token', engineerToken)
                    .end((err, resp) => {
                      const array = resp.body.data;
                      const allObj = array.every(item => typeof item === 'object');
                      expect(allObj).to.be.true;
                      done();
                    });
                });

                it('the elements of the array must have a description ', (done) => {
                  request.get(route)
                    .set('x-access-token', engineerToken)
                    .end((err, resp) => {
                      const array = resp.body.data;
                      const allObj = array.every(item => item.description);
                      expect(allObj).to.be.true;
                      done();
                    });
                });

                it('the element of the array must have an status property ', (done) => {
                  request.get(route)
                    .set('x-access-token', engineerToken)
                    .end((err, resp) => {
                      const array = resp.body.data;
                      const allObj = array.every(item => item.status);
                      expect(allObj).to.be.true;
                      done();
                    });
                });
                it('the element of the array must have a location property ', (done) => {
                  request.get(route)
                    .set('x-access-token', engineerToken)
                    .end((err, resp) => {
                      const array = resp.body.data;
                      const allObj = array.every(item => item.location);
                      expect(allObj).to.be.true;
                      done();
                    });
                });

                it('the element of the array must have a date property ', (done) => {
                  request.get(route)
                    .set('x-access-token', engineerToken)
                    .end((err, resp) => {
                      const array = resp.body.data;
                      const allObj = array.every(item => item.date);

                      done(); expect(allObj).to.be.true;
                    });
                });

                it('the element of the array must have a image property ', (done) => {
                  request.get(route)
                    .set('x-access-token', engineerToken)
                    .end((err, resp) => {
                      const array = resp.body.data;
                      const allObj = array.every(item => item.image);
                      expect(allObj).to.be.true;
                      done();
                    });
                });
              });
            });
          });
        });


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

          describe('if the token is invalid', () => {
            it('should expect status 403', (done) => {
              request.get(requestRoute)
                .set('x-access-token', engineerToken)
                .expect(403, done);
            });
            it('body should have a success property that is false', (done) => {
              request.get(requestRoute)
                .set('x-access-token', engineerToken)
                .end((err, resp) => {
                  expect(resp.body).property('success').to.be.false;
                  done();
                });
            });
            it('body should have a message property', (done) => {
              request.get(requestRoute)
                .set('x-access-token', engineerToken)
                .end((err, resp) => {
                  expect(resp.body).property('message');
                  done();
                });
            });
          });
          describe('if the id is invalid', () => {
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
});
