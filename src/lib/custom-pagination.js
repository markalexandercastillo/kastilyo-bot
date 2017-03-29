/**
 * Not sure what to call this. The propublica congress api only supports retrieving data in chunks
 * (ie. pages) of 20. This module is intended for allowing one to request pages of arbitrary size
 * expressed as an object with the desired page size and page number (starting from 0). 
 * eg. {
 *   // the fourth page of data
 *   pageNum: 3,
 *   // where each page is 4 items long
 *   perPage: 4
 * }
 */

const startIndex = ({pageNum, perPage}) => perPage * pageNum;

const endIndex = ({pageNum, perPage}) => (perPage * (pageNum + 1)) - 1;

const startApiPageNum = (perApiPage, {pageNum, perPage}) =>
  pageNum && perApiPage !== perPage
    ? Math.ceil(startIndex({pageNum, perPage}) / perApiPage) - 1
    : pageNum;

const endApiPageNum = (perApiPage, {pageNum, perPage}) =>
  Math.floor(endIndex({pageNum, perPage}) / perApiPage);

const startApiPageIndex = (perApiPage, customPagination) =>
  startIndex(customPagination) % perApiPage;

const endApiPageIndex = (perApiPage, customPagination) =>
  endIndex(customPagination) < perApiPage
    ? endIndex(customPagination)
    : endIndex(customPagination) % perApiPage;

module.exports = {
  startIndex,
  startApiPageNum,
  startApiPageIndex,
  endIndex,
  endApiPageNum,
  endApiPageIndex
};
