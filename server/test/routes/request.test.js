/*  eslint no-unused-expressions: off */
/*  eslint no-undef: off */

import supertest from 'supertest';
import chai from 'chai';
import app from '../../app';
import dummyData from '../../dummys/DummyData';


dummyData.addDummyRequests();

describe('GET /users/requests', () => {
  it('abc', (done) => {
    supertest(app).get('/ds')
      .expect(404, done);
  });
});

