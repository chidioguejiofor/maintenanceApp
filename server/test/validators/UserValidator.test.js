/*  eslint no-unused-expressions: off */
/*  eslint no-undef: off */
import { expect, assert } from 'chai';
import UserValidator from '../../validators/UserValidator';
import User from '../../models/User';

const goodUser = new User('Chisom', 'password123', 'email@email.com', 'client');
const badUserOne = new User('123', '', 'email.com', 'chizoba');
const badUserTwo = new User('', '123', 'eamil@', 'chef');

const validator = new UserValidator(goodUser);
const goodUserResult = validator.validate();

describe('Testing returned object of validateUser() ', () => {
  describe('If the user is valid then', () => {
    describe('value return from validate method', () => {
      it('should be an object', () => {
        assert.isObject(goodUserResult);
      });

      it('should have property valid that is expected to be true', () => {
        expect(goodUserResult).property('valid').to.be.true;
      });

      it('should not contain property email', () => {
        expect(goodUserResult).not.property('email');
      });
    });

    describe('goodUser object', () => {
      it('should have a username property whose length must be greater than 2', () => {
        expect(goodUser.username.length).to.be.greaterThan(2);
      });

      it('should have a email property whose length must be greater than 2', () => {
        expect(goodUser.email.length).to.be.greaterThan(2);
      });
      it('should have an alphanumeric password property whose length must be greater than 5', () => {
        expect(goodUser.password.length)
          .to.be.greaterThan(5);
      });

      it('should have an userType  property that is either engineer or client', () => {
        expect(goodUser).property('userType');
        const validUsername = goodUser.userType;
        expect(validUsername).to.be.true;
      });
    });
  });

  describe('If user is invalid then', () => {
    it('valid property should be false', () => {
      expect(badUserOne).property('valid')
        .to.be.false;
      expect(badUserTwo).property('valid')
        .to.be.false;
    });
  });
});
