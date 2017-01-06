'use strict'

var movie = require('./data/movie.js');
//var slugify = require('slugify')
//var request = require('request')
//var cheerio = require('cheerio')
//var qs = require('querystring')
//var url = require('url')
//var _ = require('underscore')
//var sprintf = require('sprintf-js').sprintf;

class engine {
  /**
   * @constructor
   * @param  {string} engine   The name of the current feed parsing engine  (eg. "fandango")
   * @param  {string} location Location that you want to pull movie showtimes for.
   * @param  {object} options  Object containing available options (like: lang, date, or pageLimit).
   * @return {object}
   */
  constructor (engine, location, options) {
    this.engine = engine
    this.userAgent = options.userAgent;

    this.url = null
    this.location = location
    this.options = options
  }

  /**
   * Parse and pull back an object of movie theaters for the currently configured location and date.
   *
   * @param  {string=}  query         Query string which works as a way to filter the theaters.
   * @param  {Function} cb            Callback function to run after generating an object of theaters.
   * @param  {number=}  [page=1]      Paginated page to pull theaters from. Hidden API, and is only used internally.
   * @param  {object=}  [theaters=[]] Currently generated theaters. Hidden API, and is only used internally.
   * @return void
   */
  getTheaters () {
    throw new Error('The `' + this.engine + '` engine has not implemented `getTheaters`.');
  }

  /**
   * Parse and pull back a standardized object for a given movie.
   *
   * @param  {string}   theaterId  Theater ID for the theater you want to query. This can be obtained via getTheaters(),
   *                               or getMovies()
   * @param  {Function} cb         Callback function to run after generating a standardized object for this theater.
   * @return {void}
   */
  getTheater (theaterId, cb) {
    throw new Error('The `' + this.engine + '` engine has not implemented `getTheater`.');
  }

  /**
   * Parse and pull back an object of movies for the currently configured location and date.
   *
   * @param  {Function} cb           Callback function to run after generating an object of movies.
   * @param  {number=}  [page=1]     Paginated page to pull movies from. Only used internally.
   * @param  {object=}  [movies=[]]  Currently generated movies. Only used internally.
   * @return void
   */
  getMovies (cb, page, movies) {
    throw new Error('The `' + this.engine + '` engine has not implemented `getMovies`.');
  }

  /**
   * Parse and pull back a standardized object for a given movie.
   *
   * @param  {string}   movieId  Movie ID for the movie you want to query. This can be obtained via getTheaters(), or
   *                             getMovies()
   * @param  {Function} cb       Callback function to run after generating a standardized object for this movie.
   * @return {void}
   */
  getMovie (movieId, cb) {
    throw new Error('The `' + this.engine + '` engine has not implemented `getMovie`.');
  }

  /**
   * Given a unique movie ID and name, create a movie data representation.
   *
   * @param  {string} id   A unique movie ID.
   * @param  {string} name The parsed movie name.
   * @return {object}      Instance of a movie data representation object.
   */
  _createMovie (id, name) {
    return new movie(id, name)
  }

  /**
   * Take in a mixed object (string or array) and return back a normalized string sans some non-ASCII characters that
   * cause problems (like some Turkish letters).
   *
   * @param  {mixed} thing
   * @return {mixed}
   */
  _removeNonAsciiCharacters (thing) {
    if (typeof thing === 'object') {
      for (let x in thing) {
        thing[x] = thing[x].replace(/[^\x00-\x7F]/g, '')
      }

      return thing
    }

    return thing.replace(/[^\x00-\x7F]/g, '')
  }

  /**
   * Make a request to the engine endpoint.
   *
   * @param  {object}   params  Parameters to send along in the query string.
   * @param  {Function} cb      Callback function to run for the engine after processing a request.
   * @param  {Function} handler Callback function to handle a request and generate an object of data.
   * @return {void}
   */
  _request (params, cb, handler) {
    throw new Error('The `' + this.engine + '` engine has not implemented `_request`.');
  }
}

module.exports = engine
