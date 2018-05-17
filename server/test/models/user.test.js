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
        expect(user).to.have.property('description');
      });

      it('returned object must have a location attribute', () => {
        expect(user).to.have.property('location');
      });

      it('returned object must have a userType attribute', () => {
        expect(user).to.have.property('userType');
      });
      it('returned object must have a location attribute', () => {
        expect(user).to.have.property('location');
      });
    });

    describe('validate attribute values', () => {
      it(`expect description to equal ${description}`, () => {
        expect(user).to.have.property('description').to.equal(description);
      });
      it(`expect location to  equal ${location}`, () => {
        expect(user).to.have.property('location').to.equal(location);
      });

      it(`expect userType to equal ${userType}`, () => {
        expect(user).to.have.property('userType').to.equal(userType);
      });
    });
  });
});
