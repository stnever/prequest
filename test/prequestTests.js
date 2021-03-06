'use strict';

var assert = require('assert');
var prequest = require('../prequest');
var port = parseInt(process.env.PORT, 10) || 4567;
var url = 'http://localhost:' + port;

describe('Prequest GET tests', function () {
  it('should GET by default with a url string', function (done) {
    prequest(url + '/api')
      .then(function (body) {
        assert.deepEqual(body, 'Success Get');
        done();
      });
  });

  it('should GET by default with an object', function (done) {
    prequest({url: url + '/api'})
      .then(function (body) {
        assert.strictEqual(body, 'Success Get');
        done();
      });
  });

  it('should return response and body with arrayResponse', function (done) {
    prequest({url: url + '/api', arrayResponse: true})
      .spread(function (response, body) {
        assert.equal(response.statusCode, 200);
        assert.equal(response.headers['content-type'],
          'text/html; charset=utf-8');
        assert.strictEqual(body, 'Success Get');
        done();
      });
  });

  it('should fail with unknown route', function (done) {
    prequest(url + '/unknown')
      .catch(function (err) {
        assert(err instanceof Error, 'Err must be an actual error');
        console.log(err.message);
        assert.equal(err.message.trimRight(),
          'HTTP 404: Cannot GET /unknown');
        assert(err.response.headers !== null,
          'Error object must include the bad response');
        assert.equal(err.statusCode, 404, 'Unsuccessful Get');
        assert.strictEqual(err.body.trimRight(), 'Cannot GET /unknown');
        done();
      });
  });


  it('should fail with conn refused', function (done) {
    prequest('http://nosuchserver')
      .catch(function (err) {
        assert(err instanceof Error, 'Err must be an actual error');
        assert.equal(err.code, 'ENOTFOUND', 'No such server');
        done();
      });
  });
});

describe('Prequest POST tests', function () {
  it('should POST with data', function (done) {
    prequest({
      method: 'post',
      url: url + '/api?',
      body: {
        apple: 'red'
      }
    }).then(function (body) {
      assert.deepEqual(body.message, 'Success Post');
      assert.deepEqual(body.data.apple, 'red');
      done();
    });
  });
});