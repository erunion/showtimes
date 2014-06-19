'use strict';

var request = require('request');
var cheerio = require('cheerio');
var qs = require('querystring');
var url = require('url');

/**
 * @param {string} location
 * @param {object=} options
 */
function Showtimes(location, options) {
  if (!(this instanceof Showtimes)) {
    return new Showtimes(location, options);
  }

  this.userAgent = 'showtimes (http://github.com/jonursenbach/showtimes)';
  this.baseUrl = 'http://google.com/movies';
  this.location = location;

  var reserved = Object.keys(Showtimes.prototype);
  for (var i in options) {
    if (reserved.indexOf(i) === -1) {
      this[i] = options[i];
    }
  }
}

/**
 * @param {function} cb - Callback to handle the resulting theaters.
 * @param {number=} [page=1] - Page to pull theaters from. Hidden API and used during pagination.
 * @param {object=} [theaters=[]] - Current theaters object. Hidden API and used during pagination.
 * @returns {object}
 */
Showtimes.prototype.getTheaters = function (cb) {
  var self = this;
  var page = 1;
  var theaters = [];

  if (arguments.length > 1) {
    page = arguments[1];
    theaters = arguments[2];
  }

  var options = {
    url: self.baseUrl,
    qs: {
      near: self.location,
      date: (typeof self.date !== 'undefined') ? self.date : 0,
      start: ((page - 1) * 10)
    },
    headers: {
      'User-Agent': self.userAgent
    }
  };

  request(options, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      if (error === null) {
        cb('Unknown error occured while querying theater data from Google Movies.');
      } else {
        cb(error);
      }

      return;
    }

    var $ = cheerio.load(body);

    var cloakedUrl;
    var genre;
    var imdb;
    var info;
    var match;
    var meridiem;
    var movieId;
    var rating;
    var runtime;
    var showtime;
    var showtimes;
    var theaterId;
    var theaterData;
    var trailer;

    if ($('.theater').length === 0) {
      cb($('#results').text());
      return;
    }

    $('.theater').each(function (i, theater) {
      theater = $(theater);

      cloakedUrl = theater.find('.desc h2.name a').attr('href');
      theaterId = qs.parse(url.parse(cloakedUrl).query).tid;

      info = theater.find('.desc .info').text().split(' - ');

      theaterData = {
        id: theaterId,
        name: theater.find('.desc h2.name').text(),
        address: info[0].trim(),
        phoneNumber: info[1].trim(),
        movies: []
      };

      theater.find('.showtimes .movie').each(function (i, movie) {
        movie = $(movie);

        cloakedUrl = movie.find('.name a').attr('href');
        movieId = qs.parse(url.parse(cloakedUrl).query).mid;

        // Movie info format: RUNTIME - RATING - GENRE - TRAILER - IMDB
        // Some movies don't have a rating, trailer, or IMDb pages, so we need
        // to account for that.
        info = movie.find('.info').text().split(' - ');

        if (info[0].match(/(hr |min)/)) {
          runtime = info[0].trim();
          if (info[1].match(/Rated/)) {
            rating = info[1].replace(/Rated/, '').trim();
            if (typeof info[2] !== 'undefined') {
              if (info[2].match(/(IMDB|Trailer)/i)) {
                genre = false;
              } else {
                genre = info[2].trim();
              }
            } else {
              genre = false;
            }
          } else {
            rating = false;

            if (info[1].match(/(IMDB|Trailer)/i)) {
              genre = false;
            } else {
              genre = info[1].trim();
            }
          }
        } else {
          rating = false;
          genre = info[0].trim();
        }

        if (movie.find('.info a:contains("Trailer")').length) {
          cloakedUrl = 'https://google.com' + movie.find('.info a:contains("Trailer")').attr('href');
          trailer = qs.parse(url.parse(cloakedUrl).query).q;
        } else {
          trailer = false;
        }

        if (movie.find('.info a:contains("IMDb")').length) {
          cloakedUrl = 'https://google.com' + movie.find('.info a:contains("IMDb")').attr('href');
          imdb = qs.parse(url.parse(cloakedUrl).query).q;
        } else {
          imdb = false;
        }

        var movieData = {
          id: movieId,
          name: movie.find('.name').text(),
          runtime: info[0].trim(),
          rating: rating,
          genre: genre,
          imdb: imdb,
          trailer: trailer,
          showtimes: []
        };

        // Remove non-ASCII characters.
        if (movieData.runtime) {
          movieData.runtime = movieData.runtime.replace(/[^\x00-\x7F]/g, '').trim();
        }

        if (movieData.rating) {
          movieData.rating = movieData.rating.replace(/[^\x00-\x7F]/g, '').trim();
        }

        if (movieData.genre) {
          movieData.genre = movieData.genre.replace(/[^\x00-\x7F]/g, '').trim();
        }

        // Google displays showtimes like "10:00  11:20am  1:00  2:20  4:00  5:10  6:50  8:10  9:40  10:55pm". Since
        // they don't always apply am/pm to times, we need to run through the showtimes in reverse and then apply the
        // previous (later) meridiem to the next (earlier) movie showtime so we end up with something like
        // ["10:00am", "11:20am", "1:00pm", ...].
        showtimes = movie.find('.times').text().split(' ');
        meridiem = false;

        showtimes = showtimes.reverse();
        for (var x in showtimes) {
          // Remove non-ASCII characters.
          showtime = showtimes[x].replace(/[^\x00-\x7F]/g, '').trim();
          match = showtime.match(/(am|pm)/);
          if (match) {
            meridiem = match[0];
          } else {
            showtime += meridiem;
          }

          showtimes[x] = showtime;
        }

        showtimes = showtimes.reverse();
        for (x in showtimes) {
          movieData.showtimes.push(showtimes[x].trim());
        }

        theaterData.movies.push(movieData);
      });

      theaters.push(theaterData);
    });

    // No pages to paginate, so return the theaters back.
    if ($('#navbar td a:contains("Next")').length === 0) {
      cb(null, theaters);
      return;
    }

    // Use the hidden API of getTheaters to pass in the next page and current
    // theaters.
    self.getTheaters(cb, ++page, theaters);
  });
};

module.exports = Showtimes;
