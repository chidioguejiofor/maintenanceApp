/*  eslint no-unused-expressions: off */
/*  eslint no-undef: off */

import { expect, assert } from 'chai';
import userService from '../../services/userService';
import DummyData from '../../dummys/DummyData';
import User from '../../models/User';

DummyData.addUser(new User('super', 'super', 'super@email.com', 'engineer'));


describe('userService', () => {
  const username = 'super';
  const password = 'super';
  const admin = userService.getByCredentials(username, password);
  describe('value returned by getByCredentials() method', () => {
    it('should be an object', () => {
      assert.isObject(admin);
    });

    it('should have an id attribute', () => {
      expect(admin).to.have.property('id');
    });
    it('should not have a password property', () => {
      expect(admin).not.to.have.property('password');
    });

    it('should be of userType = "engineer"', () => {
      expect(admin).property('userType')
        .equal('engineer');
    });
  });

  describe('createUser method ', () => {
    const badUsername = '';
    const badPassword = 'chi';
    const badCallResult =
        userService.createUser(new User(badUsername, badPassword, 'chmail.com', 'client'));
    const goodCallResult =
        userService.createUser(new User('username', 'password', 'e@emaol.com', 'client'));

    describe('the result of a bad call should', () => {
      it('return undefined', () => {
        expect(badCallResult).to.be.undefined;
      });

      it('not add the specified username and password', () => {
        expect(userService.getByCredentials(badUsername, badPassword))
          .to.be.undefined;
      });
    });

    describe('the result of a good call should', () => {
      it('return an object', () => {
        assert.isObject(goodCallResult);
      });
      it('not add the specified username and password to the system', () => {
        expect(userService.getByCredentials(badUsername, badPassword))
          .to.be.undefined;
      });


      describe('the returned object should', () => {
        it('have an id attribute', () => {
          expect(goodCallResult).to.have.property('id');
        });

        it('should  have a password', () => {
          expect(goodCallResult).to.have.property('password');
        });
      });
    });
  });

  describe('getById()', () => {
    const engineer = userService.getByCredentials(username, password);
    describe('bad call', () => {
      it('should return undefined when an empty string is passed', () => {
        expect(userService.getById('')).to.be.undefined;
      });

      it('should return undefined when an noting is passed', () => {
        expect(userService.getById()).to.be.undefined;
      });

      it('should return undefined when an invalid objects is passed', () => {
        expect(userService.getById({})).to.be.undefined;
      });
    });

    describe('good call should', () => {
      it('should return an object', () => {
        assert.isObject(userService.getById(engineer.id));
      });
    });
  });
});

