const querystring = require('querystring');
const error = new TypeError('Invalid query');

const equals = (string) => {
  let criteria = {};
  if (string.indexOf('=') === -1) {
    return criteria;
  }
  if (string.indexOf('\'') === -1) {
    throw error;
  }
  string = string.replace(/'/g, '');
  string = string.split('=');
  criteria[string[0]] = new RegExp(`^${string[1]}$`, 'gi');
  return criteria;
}

const contains = (string) => {
  let criteria = {};

  if (string.indexOf('~') === -1) {
    return criteria
  }
  if (string.indexOf('\'') === -1) {
    throw error;
  }
  string = string.replace(/'/g, '');
  string = string.split('~');
  criteria[string[0]] = new RegExp(`.*${string[1]}.*`, 'gi');
  return criteria;
}

const determineQuery = (string) => {
  const query = string.indexOf('=') > -1 ? equals(string)
    : string.indexOf('~') > -1 ? contains(string)
    : error;

    return query;
}

const filter = (filterString) => {
  filterString = querystring.unescape(filterString);
  let query = {}
  const delimiter = /%20AND%20|%20OR%20| AND | OR /gi;
  const filters = filterString.split(delimiter);
  if (filters.length > 2) {
    throw error;
  }
  else if(filters.length === 1) {
    query = determineQuery(filters[0])
  }
  else if (filterString.indexOf(' AND ') > -1) {
    query['$and'] = [determineQuery(filters[0]), determineQuery(filters[1])];
  }
  else if (filterString.indexOf(' OR ') > -1) {
    query['$or'] = [determineQuery(filters[0]), determineQuery(filters[1])];
  }

  return query;
  /*
  'foo=bar%20AND%20bar~foo%'
  'bar~foo%20OR%20fuzz=buzz'
  change the and /or to their proper
  The $or operator performs a logical OR operation on an array of two or more <expressions>
  and selects the documents that satisfy at least one of the <expressions>.
  { $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }

  { $and: [ { <expression1> }, { <expression2> } , ... , { <expressionN> } ] }
  */



}

// filter('foo=bar%20OR%20bar~foo')
// filter('foo=%27bar%27%20AND%20bar~%27foo%27')
// filter('foo=\'bar\'')
// filter('bar~\'foo\'')
// filter('foo=bar%20AND%20bar~foo%20OR%20fuzz=buzz')

module.exports = filter;