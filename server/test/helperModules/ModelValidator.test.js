/*  eslint no-unused-expressions: off */
/*  eslint no-undef: off */
import { expect, assert } from 'chai';
import Validator from '../../helperModules/ModelValidator';
import User from '../../models/User';

const goodUser = new User('Chisom', 'password123', 'email@email.com', 'client');
const goodUserResuult = Validator.validateUser(goodUser);
const badUserResult1 = Validator.validateUser(new User('123', '', 'email.com', 'chizoba'));
const badUserTwo = Validator.validateUser(new User('', '123', 'eamil@', 'chef'));

describe('Testing returned object of validateUser() ', () => {
  describe('If the user is valid then', () => {
    describe('goodUserResult', () => {
      it('should be an object', () => {
        assert(goodUserResuult).isObject();
      });

      it('should have property valid that is expected to be true', () => {
        expect(goodUserResuult).property('valid').to.be.true;
      });
    });

    describe('goodUser object', () => {
      it('should have a username property whose length must be greater than 2', () => {
        expect(goodUser).property('username').to.be.greaterThan(2);
      });

      it('should have a email property whose length must be greater than 2', () => {
        expect(goodUser).property('email').to.be.greaterThan(2);
      });
      it('should have an alphanumeric password property whose length must be greater than 5', () => {
        expect(goodUser).property('password')
          .to.be.greaterThan(5);
      });

      it('should have an userType  propertythat is either engineer or client', () => {
        expect(goodUser).property('userType');
        const validUsername = goodUser.userType;
        expect(validUsername).to.be.true;
      });
    });
  });

  describe('If user is invalid then', () => {
    it('valid property should be false', () => {
      expect(badUserResult1).property('valid')
        .to.be.false;
      expect(badUserTwo).property('valid')
        .to.be.false;
    });
  });
});
