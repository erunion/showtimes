var Showtimes = require('../src/index.js')
var test = require('tap').test
var moment = require('moment')
var api = null

test('no movies available for a date far in the future', function (assert) {
  api = new Showtimes(90504, {
    date: 200
  })

  api.getTheaters(function (err) {
    var futureDate = moment().add(200, 'days').format('MMM D')
    assert.equal(err, 'No showtimes were found on ' + futureDate + '.Please select a different date.')
    assert.end()
  })
})

test('get theaters from zipcode', function (assert) {
  api = new Showtimes(90504)
  api.getTheaters(function (err, theaters) {
    assert.equal(err, null)
    assert.ok(theaters.length > 1)
    assert.end()
  })
})

test('get theaters from zipcode and get movie for first movie id', function (assert) {
  api = new Showtimes(90504)
  api.getTheaters(function (err, theaters) {
    assert.equal(err, null)
    api.getMovie((theaters[0].movies[0].id), function (err2, movie) {
      assert.equal(err2, null)
      assert.ok(movie.theaters[0].showtimes.length > 0)
    })

    assert.end()
  })
})

test('get theaters from lat/long', function (assert) {
  api = new Showtimes('33.8358,-118.3406')
  api.getTheaters(function (err, theaters) {
    assert.equal(err, null)
    assert.ok(theaters.length > 1)
    assert.end()
  })
})

test('get theaters from lat/long', function (assert) {
  api = new Showtimes('45.531531531531535,-122.61220863200342')
  api.getTheaters(function (err, theaters) {
    assert.equal(err, null)
    assert.ok(theaters.length > 1)
    assert.end()
  })
})
