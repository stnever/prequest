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

class HttpError extends Error {
  constructor(code, body, response) {
    super(`HTTP ${code}: ${atMost(body, 60)}`)
    this.name = this.constructor.name
    this.statusCode = code
    this.body = body
    this.response = response
    Error.captureStackTrace(this, this.constructor)
  }
}


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
