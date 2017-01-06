'use strict'

var iso8601 = require('iso8601-duration').parse;

class movie {
  /**
   * @constructor
   * @param  {string} id   A unique movie ID.
   * @param  {string} name The parsed movie name.
   * @return {object}      Instance of a movie data representation object.
   */
  constructor (id, name) {
    this.id = id
    this.name = name

    this.description = null
    this.poster = null

    this.runtime = null
    this.rating = null;
    this.genre = [];

    this.director = null
    this.cast = []

    this.imdb = null
    this.trailer = null

    this.showtimes = []
    this.showtime_tickets
  }

  setDescription (description) {
    this.description = description || null
  }

  setPoster (url) {
    this.poster = url || null
  }

  setRuntime (runtime)  {
    this.runtime = null
    if (!runtime) {
      return
    }

    this.runtime = []

    // Parse out an ISO8601 duration into something we can work with.
    runtime = iso8601(runtime)

    // If the movie is longer than a day, don't even bother trying to give an accurate runtime.
    if (runtime.days > 0 || runtime.months > 0 || runtime.years > 0 || runtime.weeks > 0) {
      this.runtime = '1day+';
      return
    }

    if (runtime.hours > 0) {
      this.runtime.push(runtime.hours + 'hr')
    }

    this.runtime.push(runtime.minutes + 'min');
    this.runtime = this.runtime.join(' ')
  }

  setRating (rating) {
    this.rating = rating || null
  }

  setGenres (genres) {
    this.genres = []

    genres = genres.split(',');
    for (var i in genres) {
      this.genres.push(genres[i])
    }
  }
}

module.exports = movie

/*    var movieData = {
      id: movieId,
      name: name,
      runtime: runtime,
      rating: rating,
      genre: genre,
      imdb: this._parseImdb(movie),
      trailer: this._parseTrailer(movie),
      showtimes: showtimes.showtimes
    }

    if (showtimes.showtime_tickets) {
      movieData.showtime_tickets = showtimes.showtime_tickets
    }

    if (alternate && movieId) {
      movieData.director = director
      movieData.cast = cast
      movieData.description = description
    }*/
