const chai = require('chai')
  , cp = require('./../../src/lib/custom-pagination');

chai.should();

describe('custom-pagination', () => {
  // testing against the only known use case of api pages of size 20
  context("when the desired page size is less than the API's page size", () => {
    context('the first index of desired items', () => {
      // Page 0
      // [*0*, ..., 12]
      describe('startIndex()', () => it(
        'is the lowest overall index of the target items',
        () => cp.startIndex({pageNum: 0, perPage: 13}).should.equal(0)
      ));

      // Page 0
      // [0, ..., *12*]
      describe('endIndex()', () => it(
        'is the highest overall index of the target items',
        () => cp.endIndex({pageNum: 0, perPage: 13}).should.equal(12)
      ));

      // API Page *0*
      // [0, ..., 19]
      describe('startApiPageNum()', () => it(
        'is the api page number containing the lowest (start) index',
        () => cp.startApiPageNum(20, {pageNum: 0, perPage: 13}).should.equal(0)
      ));

      // API Page *0*
      // [0, ..., 19]
      describe('endApiPageNum()', () => it(
        'is the api page number within which is the highest (end) index of the target items',
        () => cp.endApiPageNum(20, {pageNum: 0, perPage: 13}).should.equal(0)
      ));

      // API Page 0
      // [*0*, ..., 19]
      describe('startApiPageIndex()', () => it(
        "is the lowest overall index's index in the api page containing it",
        () => cp.startApiPageIndex(20, {pageNum: 0, perPage: 13}).should.equal(0)
      ));

      // API Page 0
      // [0 (0), ..., 12 (*12*), ..., 19 (19)]
      describe('endApiPageIndex()', () => it(
        'is the highest index of the target items',
        () => cp.endApiPageIndex(20, {pageNum: 0, perPage: 13}).should.equal(12)
      ));
    });

    context('the third desired page', () => {
      // Page 0             Page 3
      // [0, ..., 12], ..., [*39*, ..., 51]
      describe('startIndex()', () => it(
        'is the lowest overall index of the target items',
        () => cp.startIndex({pageNum: 3, perPage: 13}).should.equal(39)
      ));

      // Page 0             Page 3
      // [0, ..., 12], ..., [39, ..., *51*]
      describe('endIndex()', () => it(
        'is the highest overall index of the target items',
        () => cp.endIndex({pageNum: 3, perPage: 13}).should.equal(51)
      ));


      // API Page 0    API Page *1*   API Page 2
      // [0, ..., 19], [20, ..., 39], [40, ..., 59]
      describe('startApiPageNum()', () => it(
        'is the api page number within which is the lowest (start) index of the target items',
        () => cp.startApiPageNum(20, {pageNum: 3, perPage: 13}).should.equal(1)
      ));

      // API Page 0         API Page *2*
      // [0, ..., 19], ..., [40, ..., 59]
      describe('endApiPageNum()', () => {
        it('is the api page number within which is the highest (end) index of the target items', () => {
          cp.endApiPageNum(20, {pageNum: 3, perPage: 13}).should.equal(2);
        });
      });

      // API Page 0             API Page 1                        API Page 2
      // [0 (0), ..., 19 (19)], [20 (0), ..., 38(18), 39 (*19*)], [40 (0), ..., 59 (19)]
      describe('startApiPageIndex()', () => it(
        'is the index of the lowest overall index item relative to the start of the api page containing it',
        () => cp.startApiPageIndex(20, {pageNum: 3, perPage: 13}).should.equal(19)
      ));

      // API Page 0         API Page 2
      // [0, ..., 19], ..., [40 (0), ..., 51 (*11*) ..., 59 (19)]
      describe('endApiPageIndex()', () => {
        it('is the highest index of the target items', () => {
          cp.endApiPageIndex(20, {pageNum: 3, perPage: 13}).should.equal(11);
        });
      });
    });
  });

  context("when the desired page size is greater than the API's page size", () => {
    context('the first desired page', () => {
      // Page 0
      // [*0*, ..., 26]
      describe('startIndex()', () => it(
        'is the lowest overall index of the target items',
        () => cp.startIndex({pageNum: 0, perPage: 27}).should.equal(0)
      ));

      // Page 0
      // [0, ..., *26*]
      describe('endIndex()', () => it(
        'is the highest overall index of the target items',
        () => cp.endIndex({pageNum: 0, perPage: 27}).should.equal(26)
      ));

      // API Page *0*  API Page 1
      // [0, ..., 19], [20, ..., 39]
      describe('startApiPageNum()', () => it(
        'is the api page number within which is the lowest (start) index of the target items',
        () => cp.startApiPageNum(20, {pageNum: 0, perPage: 27}).should.equal(0)
      ));

      // API Page 0    API Page *1*
      // [0, ..., 19], [20, ..., 39]
      describe('endApiPageNum()', () => it(
        'is the api page number within which is the highest (end) index of the target items',
        () => cp.endApiPageNum(20, {pageNum: 0, perPage: 27}).should.equal(1)
      ));

      // API Page 0               API Page 1
      // [0 (*0*), ..., 19 (19)], [20 (0), ..., 39 (19)]
      describe('startApiPageIndex()', () => it(
        'is the index of the lowest overall index item relative to the start of the api page containing it',
        () => cp.startApiPageIndex(20, {pageNum: 0, perPage: 27}).should.equal(0)
      ));

      // API Page 0             API Page 1
      // [0 (0), ..., 19 (19)], [20 (0), ..., 26 (*6*) ..., 39 (19)]
      describe('endApiPageIndex()', () => it(
        'is the highest index of the target items',
        () => cp.endApiPageIndex(20, {pageNum: 0, perPage: 27}).should.equal(6)
      ));
    });

    context('the third desired page', () => {
      // Page 0             Page 3
      // [0, ..., 26], ..., [*81*, ..., 107]
      describe('startIndex()', () => it(
        'is the lowest overall index of the target items',
        () => cp.startIndex({pageNum: 3, perPage: 27}).should.equal(81)
      ));

      // Page 0             Page 3
      // [0, ..., 26], ..., [81, ..., *107*]
      describe('endIndex()', () => it(
        'is the highest overall index of the target items',
        () => cp.endIndex({pageNum: 3, perPage: 27}).should.equal(107)
      ));

      // API Page 0         API Page *4*   API Page 5
      // [0, ..., 19], ..., [80, ..., 99], [100, ..., 119]
      describe('startApiPageNum()', () => it(
        'is the api page number within which is the lowest (start) index of the target items',
        () => cp.startApiPageNum(20, {pageNum: 3, perPage: 27}).should.equal(4)
      ));

      // API Page 0         API Page *5*
      // [0, ..., 19], ..., [100, ..., 119]
      describe('endApiPageNum()', () => it(
        'is the api page number within which is the highest (end) index of the target items',
        () => cp.endApiPageNum(20, {pageNum: 3, perPage: 27}).should.equal(5)
      ));

      // API Page 0                  API Page  4                       API Page 5
      // [0 (0), ..., 19 (19)], ..., [80 (0), 81 (*1*), ..., 99 (19)], [100 (0), ..., 119 (19)]
      describe('startApiPageIndex()', () => it(
        'is the index of the lowest overall index item relative to the start of the api page containing it',
        () => cp.startApiPageIndex(20, {pageNum: 3, perPage: 27}).should.equal(1)
      ));

      // API Page 0                    API Page 5
      // [0 (0), ..., 19 (19)], ..., [100 (0),..., 107 (*7*), ..., 119 (19)]
      describe('endApiPageIndex()', () => it(
        'is the highest index of the target items',
        () => cp.endApiPageIndex(20, {pageNum: 3, perPage: 27}).should.equal(7)
      ));
    });
  });

  context("when the desired page size is the same as the API's page size", () => {
    context('the first index of desired items', () => {
      // Page 0
      // [*0*, ..., 19]
      describe('startIndex()', () => it(
        'is the lowest overall index of the target items',
        () => cp.startIndex({pageNum: 0, perPage: 20}).should.equal(0)
      ));

      // Page 0
      // [0, ..., *19*]
      describe('endIndex()', () => it(
        'is the highest overall index of the target items',
        () => cp.endIndex({pageNum: 0, perPage: 20}).should.equal(19)
      ));

      // API Page *0*
      // [0, ..., 19]
      describe('startApiPageNum()', () => it(
        'is the api page number containing the lowest (start) index',
        () => cp.startApiPageNum(20, {pageNum: 0, perPage: 20}).should.equal(0)
      ));

      // API Page *0*
      // [0, ..., 19]
      describe('endApiPageNum()', () => it(
        'is the api page number within which is the highest (end) index of the target items',
        () => cp.endApiPageNum(20, {pageNum: 0, perPage: 20}).should.equal(0)
      ));

      // API Page 0
      // [*0*, ..., 19]
      describe('startApiPageIndex()', () => it(
        "is the lowest overall index's index in the api page containing it",
        () => cp.startApiPageIndex(20, {pageNum: 0, perPage: 20}).should.equal(0)
      ));

      // API Page 0
      // [0 (0), ..., 19 (*19*)]
      describe('endApiPageIndex()', () => it(
        'is the highest index of the target items',
        () => cp.endApiPageIndex(20, {pageNum: 0, perPage: 20}).should.equal(19)
      ));
    });

    context('the third desired page', () => {
      // Page 0             Page 3
      // [0, ..., 19], ..., [*60*, ..., 79]
      describe('startIndex()', () => it(
        'is the lowest overall index of the target items',
        () => cp.startIndex({pageNum: 3, perPage: 20}).should.equal(60)
      ));

      // Page 0             Page 3
      // [0, ..., 19], ..., [60, ..., *79*]
      describe('endIndex()', () => it(
        'is the highest overall index of the target items',
        () => cp.endIndex({pageNum: 3, perPage: 20}).should.equal(79)
      ));

      // Page 0             Page *3*
      // [0, ..., 19], ..., [60, ..., 79]
      describe('startApiPageNum()', () => it(
        'is the api page number within which is the lowest (start) index of the target items',
        () => cp.startApiPageNum(20, {pageNum: 3, perPage: 20}).should.equal(3)
      ));

      // Page 0             Page *3*
      // [0, ..., 19], ..., [60, ..., 79]
      describe('endApiPageNum()', () => {
        it('is the api page number within which is the highest (end) index of the target items', () => {
          cp.endApiPageNum(20, {pageNum: 3, perPage: 20}).should.equal(3);
        });
      });

      // API Page 0                  API Page 3
      // [0 (0), ..., 19 (19)], ..., [60 (*0*), ..., 79 (19)]
      describe('startApiPageIndex()', () => it(
        'is the index of the lowest overall index item relative to the start of the api page containing it',
        () => cp.startApiPageIndex(20, {pageNum: 3, perPage: 20}).should.equal(0)
      ));

      // API Page 0                  API Page 3
      // [0 (0), ..., 19 (19)], ..., [60 (0), ..., 79 (*19*)]
      describe('endApiPageIndex()', () => {
        it('is the highest index of the target items', () => {
          cp.endApiPageIndex(20, {pageNum: 3, perPage: 20}).should.equal(19);
        });
      });
    });
  });
});
