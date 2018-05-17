/*  eslint no-undef: off */
import { expect, assert } from 'chai';
import User from '../../models/User';

describe('user', () => {
  const description = 'The bath thub pipe got broken';
  const location = 'Top floor of Andela EPIC Tower';
  const image = 'broken-thub.png';
  const title = 'Broken pipe';
  const userType = 'customer';

  let user;
  beforeEach(() => {
    user = new User(title, description, location, userType, image);
  });

  describe('constructor', () => {

    describe('attributes created in by constructor', () => {
      it('user must be a User', () => {
        expect(user instanceof User).to.be.true;
      });

      it('returned object must have a description attribute', () => {
        expect(user.description).to.be.defined;
      });

      it('returned object must have a location attribute', () => {
        expect(user.location).to.be.defined;
      });

      it('returned object must have a userType attribute', () => {
        expect(user.userType).to.be.defined;
      });
      it('returned object must have a location attribute', () => {
        expect(user.location).to.be.defined;
      });
    });

    describe('validate attribute values', () => {
      it(`expect description to equal ${description}`, () => {
        assert.equal(user.description, description);
      });
      it(`expect location to  equal ${location}`, () => {
        assert.equal(user.location, location);
      });

      it(`expect userType to equal ${userType}`, () => {
        assert.equal(user.userType, userType);
      });
    });
  });
});
