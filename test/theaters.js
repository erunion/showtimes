var Showtimes = require('../src/index.js')
var test = require('tap').test
var api = null

test('get theaters from zipcode', function (assert) {
  api = new Showtimes(90504)
  api.getTheaters(function (err, theaters) {
    assert.equal(err, null)
    assert.ok(theaters.length > 1, 'more than one theater')
    assert.end()
  })
})

test('get theaters attributes', function (assert) {
  api = new Showtimes(90504)
  api.getTheaters(function (err, theaters) {
    assert.equal(err, null)
    assert.ok(theaters[0].id, 'id attribute parsed from theater')
    assert.ok(theaters[0].name, 'name attribute parsed from theater')
    assert.ok(theaters[0].address, 'address attribute parsed from theater')
    assert.ok(theaters[0].phoneNumber, 'phoneNumber attribute parsed from theater')
    assert.end()
  })
})

test('get theaters from zipcode and get movie for first movie id', function (assert) {
  api = new Showtimes(90504)
  api.getTheaters(function (err, theaters) {
    assert.equal(err, null)
    api.getMovie((theaters[0].movies[0].id), function (err2, movie) {
      assert.equal(err2, null)
      assert.ok(movie.theaters[0].showtimes.length > 0, 'movie found by id')
      assert.end()
    })
  })
})

test('get theaters from lat/long', function (assert) {
  api = new Showtimes('33.8358,-118.3406')
  api.getTheaters(function (err, theaters) {
    assert.equal(err, null)
    assert.ok(theaters.length > 1, 'more than one theater')
    assert.end()
  })
})

test('get theaters from lat/long', function (assert) {
  api = new Showtimes('45.531531531531535,-122.61220863200342')
  api.getTheaters(function (err, theaters) {
    assert.equal(err, null)
    assert.ok(theaters.length > 1, 'more than one theater')
    assert.end()
  })
})

test('get -Vogue Theatre- theater from id', function (assert) {
  api = new Showtimes('45.531531531531535,-122.61220863200342')
  api.getTheater('1441318e8d47fc1b', function (err, theater) {
    assert.equal(err, null)
    assert.ok(theater.movies[0].showtimes.length > 0)
    assert.end()
  })
})

test('get theaters from lat/long and later get filtered theaters for first theater name', function (assert) {
  api = new Showtimes('45.531531531531535,-122.61220863200342')
  api.getTheaters(function (err, theaters) {
    assert.equal(err, null)
    api.getTheaters(theaters[0].name, function (err2, theaters2) {
      assert.equal(err2, null)
      assert.ok(theaters2.length > 0, 'theaters found using query')
      assert.end()
    })
  })
})

test('no theaters available for query', function (assert) {
  var query = 'Do not exist!'
  api = new Showtimes('45.531531531531535,-122.61220863200342')
  api.getTheaters(query, function (err, theaters) {
    assert.equal(err, 'Your query - ' + query + ' - did not match any movie reviews, showtimes or theaters.')
    assert.end()
  })
})

test(
  'get theaters from lat/long and get filtered movies for first theaters name and see if match, they should not.',
  function (assert) {
    api = new Showtimes('45.531531531531535,-122.61220863200342')
    api.getTheaters(function (err, theaters) {
      assert.equal(err, null)

      var query = theaters[0].name
      api.getMovies(query, function (err2, movies) {
        assert.equal(err2, null)
        assert.ok(movies.length === 0, 'no movies')
        assert.end()
      })
    })
  }
)
