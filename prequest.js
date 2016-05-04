'use strict';

var Promise = require('bluebird');
var request = require('request');
var util = require('util');
var objectAssign = require('object-assign');

function atMost(obj, max) {
  var s = JSON.stringify(obj || 'null');
  if ( s.length <= max ) {
    return s;
  }
  return s.substring(0, max) + '...';
}

// HTTP specific error class
function HttpError(statusCode, body, response) {
  Error.captureStackTrace(this, this.constructor);
  Object.defineProperty(this, 'statusCode',
    {value: statusCode, enumerable: false});
  Object.defineProperty(this, 'body',
    {value: body, enumerable: false});
  Object.defineProperty(this, 'response',
    {value: response, enumerable: false});
  this.message = 'HTTP ' + statusCode + ': ' + JSON.stringify(body);
}

util.inherits(HttpError, Error);

function prequest(url, options) {
  options = objectAssign({}, options);

  if (typeof url === 'string') {
    options.url = url;
  } else {
    options = url;
  }

  options = objectAssign({json: true}, options);

  return new Promise(function (resolve, reject) {
    request(options, function (error, response, body) {
      if (error) {
        reject(error);
      } else if (response.statusCode >= 400) {
        reject(new HttpError(response.statusCode, response.body, response));
      } else if (options.arrayResponse) {
        resolve([response, body]);
      } else {
        resolve(body);
      }
    });
  });
}

module.exports = prequest;
