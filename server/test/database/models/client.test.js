/*  eslint no-unused-expressions: off */
/*  eslint no-undef: off */
import { expect } from 'chai';
import Client from '../../../database/models/Client';

describe('client', () => {
  const email = 'test@email.com';
  const password = 'passs';
  const username = 'username';
  let user;
  beforeEach(() => {
    user = new Client(username, password, email);
  });

  describe('constructor', () => {
    describe('attributes created in by constructor', () => {
      it('user must be a User', () => {
        expect(user instanceof Client).to.be.true;
      });

      it('returned object must have a email attribute', () => {
        expect(user).to.have.property('email');
      });

      it('returned object must have a password attribute', () => {
        expect(user).to.have.property('password');
      });


      it('returned object must have a username attribute', () => {
        expect(user).to.have.property('username');
      });
    });

    describe('validate attribute values', () => {
      it(`expect email to equal ${email}`, () => {
        expect(user).to.have.property('email').to.equal(email);
      });
      it(`expect password to  equal ${password}`, () => {
        expect(user).to.have.property('password').to.equal(password);
      });


      it(`expect username to equal ${username}`, () => {
        expect(user).to.have.property('username').to.equal(username);
      });
    });
  });
});
