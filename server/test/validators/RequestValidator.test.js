/*  eslint no-unused-expressions: off */
/*  eslint no-undef: off */
import { expect, assert } from 'chai';
import RequestValidator from '../../validators/RequestValidator';
import Request from '../../models/Request';

const goodRequest =
    new Request(
      'Broken Pipe',
      'Water pipe got broken',
      'Third Floor of Epic tower',
      '221133-323', 'link.jpg',
    );
const badRequestOne = new Request('t', 'abc', '12', 'as', 'p');
const badRequestTwo = new Request();

const validator = new RequestValidator(goodRequest);
const goodRequestResult = validator.validate();
const invalidDataRequestResult = new RequestValidator(badRequestOne).validate();
const missingDataRequestResult = new RequestValidator(badRequestTwo).validate();


describe('Testing returned object of requestValidator.validateUser() ', () => {
  describe('If the request is valid then', () => {
    describe('value return from validate method', () => {
      it('should be an object', () => {
        assert.isObject(goodRequestResult);
      });

      it('should have property "valid" that is expected to be true', () => {
        expect(goodRequestResult).property('valid').to.be.true;
      });

      it('should not  a  contain invalidData  property', () => {
        expect(goodRequestResult).not.property('invalidData');
      });
    });

    describe('goodRequest object', () => {
      it('should have a clientId property whose length must be greater than 2', () => {
        expect(goodRequest.clientId.length).to.be.greaterThan(2);
      });

      it('should have a description property whose length must be greater than 2', () => {
        expect(goodRequest.description.length).to.be.greaterThan(2);
      });
      it('should have a location property whose length must be greater than 5', () => {
        expect(goodRequest.location.length)
          .to.be.greaterThan(5);
      });
      it('should have a title property whose length must be greater than 5', () => {
        expect(goodRequest.title.length)
          .to.be.greaterThan(2);
      });
    });
  });

  describe('If request is invalid then validate() method', () => {
    describe('the returned object should ', () => {
      describe('have a valid property', () => {
        it('that is false', () => {
          expect(invalidDataRequestResult).property('valid').to.be.false;
        });
      });
      describe('if it failed because of invalid data formats then', () => {
        describe('have a "invalidData" property', () => {
          it('that is an array', () => {
            expect(invalidDataRequestResult)
              .to.have.property('invalidData')
              .with.length.greaterThan(0);
          });
          it('each element of the array should contain objects', () => {
            const arr = invalidDataRequestResult.invalidData;
            const allContainObject = arr.every(item => typeof item === 'object');
            expect(allContainObject).to.be.true;
          });
        });
      });

      describe('if it failed because some data was missing then', () => {
        describe('have a "missingData" property', () => {
          it('that is an array', () => {
            expect(missingDataRequestResult)
              .to.have.property('missingData')
              .with.length.greaterThan(0);
          });
          it('each element of the "missingData" array should contain objects', () => {
            const arr = missingDataRequestResult.missingData;
            const allContainObject = arr.every(item => typeof item === 'string');
            expect(allContainObject).to.be.true;
          });
        });
      });
    });
  });
});
