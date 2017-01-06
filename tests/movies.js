var Showtimes = require('../src/index.js')
var test = require('tap').test
var api = null

test('no movies available for a date far in the future', function (assert) {
  api = new Showtimes(90504, {
    date: 200
  })

  api.getMovies(function (err) {
    assert.match(err, /No showtimes were found on ([a-z]{3}) (\d{1,}).Please select a different date./i)
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

test('get movies from lat/long', function (assert) {
  api = new Showtimes('33.8358,-118.3406')
  api.getMovies(function (err, movies) {
    assert.equal(err, null)
    assert.ok(movies.length > 1, 'more than one movie')
    assert.end()
  })
})

test('get movies from lat/long', function (assert) {
  api = new Showtimes('45.531531531531535,-122.61220863200342')
  api.getMovies(function (err, movies) {
    assert.equal(err, null)
    assert.ok(movies.length > 1, 'more than one movie')
    assert.end()
  })
})

test('get movies from lat/long and get filtered movies for first movie name', function (assert) {
  api = new Showtimes('45.531531531531535,-122.61220863200342')
  api.getMovies(function (err, movies) {
    assert.equal(err, null)
    api.getMovies(movies[0].name, function (err2, movies2) {
      assert.equal(err, null)
      assert.ok(movies2.length > 0, 'movies found using query')
      assert.end()
    })
  })
})

test('no movies available for query', function (assert) {
  var query = 'Do not exist!'
  api = new Showtimes('45.531531531531535,-122.61220863200342')
  api.getMovies(query, function (err, movies) {
    assert.equal(err, 'Your query - ' + query + ' - did not match any movie reviews, showtimes or theaters.')
    assert.end()
  })
})

test(
  'get movies from lat/long and get filtered theaters for first movie name and see if match, they should not.',
  function (assert) {
    api = new Showtimes('45.531531531531535,-122.61220863200342')
    api.getMovies(function (err, movies) {
      assert.equal(err, null)
      var query = movies[0].name
      api.getTheaters(query, function (err2, theaters) {
        assert.equal(err2, null)
        assert.ok(theaters.length === 0, 'no theaters')
        assert.end()
      })
    })
  }
)
