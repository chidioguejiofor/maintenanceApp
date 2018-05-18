/*  eslint no-unused-expressions: off */
/*  eslint no-undef: off */

import { expect, assert } from 'chai';
import requestService from '../../services/requestService';
import Request from '../../models/Request';
import userService from '../../services/userService';
import User from '../../models/User';
import RequestValidator from '../../validators/RequestValidator';

const newUser = userService.createUser(new User('username', 'password', 'emil@emal.com', 'client'));
const goodRequest = new Request('Broken Pipe', 'Bath thub pipe got broken', '3rd Floor Andela', newUser.id);

describe('Testing methods of the requestService module', () => {
  describe('makeReqeust() ', () => {
    const goodResult = requestService.makeRequest(goodRequest);
    describe('if the is valid then the ', () => {
      describe('the returned object', () => {
        it('should have an id property', () => {
          expect(goodResult).to.have.property('id');
        });
        it('should contain a "pending" status  property', () => {
          expect(goodRequest).property('status')
            .equal('sent');
        });
      });

      describe('the object passed as its argument ', () => {
        const validationResult = new RequestValidator(goodRequest).validate();
        it('should pass validation', () => {
          expect(validationResult).property('valid').to.be.true;
        });
      });
    });
  });

  describe('getAllRequest() ', () => {
    const allRequests = requestService.getAll();
    it('it should always return  array', () => {
      assert.isArray(allRequests);
    });
  });
});

