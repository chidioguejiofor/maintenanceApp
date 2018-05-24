/*  eslint no-unused-expressions: off */
/*  eslint no-undef: off */

import { expect } from 'chai';
import requestService from '../../services/requestService';
import Request from '../../models/Request';
import userService from '../../services/userService';


const newUser = userService.createUser(new User('username', 'password', 'emil@emal.com', 'client'));
const goodRequest = new Request('Broken Pipe', 'Bath thub pipe got broken', '3rd Floor Andela', newUser.id);

describe('Testing methods of the requestService module', () => {
  describe('makeReqeust() ', () => {
    const goodResult = requestService.makeRequest(goodRequest);
    describe('if the is request is valid then ', () => {
      describe('the returned object', () => {
        describe('should have a statusCode property', () => {
          it('that should be 201', () => {
            expect(goodResult)
              .to.have.property('statusCode')
              .equal(201);
          });
        });
        describe('should have a respObj property', () => {
          const { respObj } = goodResult;

          describe('that has a success property', () => {
            it('that is true', () => {
              expect(respObj).property('success').to.be.true;
            });
          });

          describe('that has a data property', () => {
            it('that is an array', () => {
              expect(respObj).property('data').to.be.a('object');
            });
          });
        });
      });
    });
  });

  describe('getAllRequest() ', () => {
    const result = requestService.getAll();
    describe('should contain a respObj', () => {
      describe('should have a data property', () => {
        it('that contains an array', () => {
          expect(result.respObj).property('data')
            .to.be.a('array');
        });
      });

      describe('should have a success property', () => {
        it('that contains an array', () => {
          expect(result.respObj).property('success')
            .to.be.true;
        });
      });
    });
  });
});

