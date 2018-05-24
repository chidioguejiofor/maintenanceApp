/*  eslint no-unused-expressions: off */
/*  eslint no-undef: off */

import { expect } from 'chai';
import Request from '../../../database/models/Request';

describe('request', () => {
  const description = 'The bath thub pipe got broken';
  const location = 'Top floor of Andela EPIC Tower';
  const image = 'broken-thub.png';
  const title = 'Broken pipe';
  const clientId = 'client';

  let request;
  beforeEach(() => {
    request = new Request(title, description, location, clientId, image);
  });

  describe('constructor', () => {
    describe('attributes created in by constructor', () => {
      it('user must be a User', () => {
        expect(request instanceof Request).to.be.true;
      });

      it('returned object must have a description attribute', () => {
        expect(request).to.have.property('description');
      });

      it('returned object must have a location attribute', () => {
        expect(request).to.have.property('location');
      });

      it('returned object must have a clientId attribute', () => {
        expect(request).to.have.property('clientId');
      });
      it('returned object must have a location attribute', () => {
        expect(request).to.have.property('location');
      });
    });

    describe('validate attribute values', () => {
      it(`expect description to equal ${description}`, () => {
        expect(request).to.have.property('description').to.equal(description);
      });
      it(`expect location to  equal ${location}`, () => {
        expect(request).to.have.property('location').to.equal(location);
      });

      it(`expect clientId to equal ${clientId}`, () => {
        expect(request).to.have.property('clientId').to.equal(clientId);
      });
    });
  });
});

