var Showtimes = require('../')
var test = require('tap').test;
var s = new Showtimes(94118, {
  //date: 0
});

test('get theaters', function (t) {
  s.getTheaters(function (theaters) {
    t.equal(theaters.length, 18);
    t.end();
  });
});
