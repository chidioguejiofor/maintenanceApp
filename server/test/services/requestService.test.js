/*  eslint no-unused-expressions: off */
/*  eslint no-undef: off */

import { expect, assert } from 'chai';
import requestService from '../../services/requestService';
import Request from '../../models/Request';
import userService from '../../services/userService';
import User from '../../models/User';
import RequestValidator from '../../validators/RequestValidator';

const admin = userService.createUser(new User('admin', 'admin', 'admin@email.com', 'engineer'));
const newUser = userService.createUser(new User('username', 'password', 'emil@emal.com', 'client'));
const goodRequest = new Request('Broken Pipe', 'Bath thub pipe got broken', '3rd Floor Andela', newUser.id);
const badUserIDRequest = new Request('Broken Pipe', 'Bath thub pipe got broken', '3rd Floor Andela', 'F');

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
    const getAllResult = requestService.getAllRequest();
    it('it should always return  array', () => {
      assert.isArray(getAllResult);
    });
  });

  describe('acceptRequest()', () => {
    const badAccept = requestService.acceptRequest();
    const goodAccept = requestService.acceptRequest(admin.id);
    describe('good call returned object', () => {
      it('returned object should have property id ', () => {
        expect(goodAccept).to.have.property('id');
      });
      it('should have a status property of value "accepted"', () => {
        expect(goodAccept).to.have.property('accepted');
      });
    });

    describe('bad call should return undefined', () => {
      it('return undefined', () => {
        expect(badAccept).to.be.undefined;
      });
    });
  });

  describe('rejectRequest()', () => {
    const badReject = requestService.rejectRequest();
    const goodReject = requestService.acceptRequest(admin.id);
    describe('good call returned object', () => {
      it('returned object should have property id ', () => {
        expect(badReject).to.have.property('id');
      });
      it('should have a status property of value "accepted"', () => {
        expect(badReject).to.have.property('accepted');
      });
    });

    describe('bad call should return undefined', () => {
      it('return undefined', () => {
        expect(goodReject).to.be.undefined;
      });
    });
  });
});

