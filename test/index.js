var Showtimes = require('../');
var test = require('tap').test;
var s = null;

test('no movies available for a date far in the future', function (t) {
  s = new Showtimes(94118, {
    date: 100
  });

  s.getTheaters(function (err, theaters) {
    t.type(err, 'string');
    t.end();
  });
});

test('get theaters from zipcode', function (t) {
  s = new Showtimes(94118, {
    //date: 0
  });

  s.getTheaters(function (err, theaters) {
    t.equal(err, null);
    t.equal(theaters.length, 18);
    t.end();
  });
});

test('get theaters from lat/long', function (t) {
  s = new Showtimes('37.7822890,-122.4637080', {
    //date: 0
  });

  s.getTheaters(function (err, theaters) {
    t.equal(err, null);
    t.equal(theaters.length, 18);
    t.end();
  });
});
