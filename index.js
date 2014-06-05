var request = require('request'),
  cheerio = require('cheerio'),
  qs = require('querystring'),
  url = require('url');

/**
 * @param {string} location
 * @param {object=} options
 */
function Showtimes(location, options) {
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

  page = 1;
  if (arguments.length > 1) {
    page = arguments[1];
    theaters = arguments[2];
  } else {
    theaters = [];
  }

  var options = {
    url: self.baseUrl,
    qs: {
      near: self.location,
      date: typeof self.date != 'undefined' ? self.date : 0,
      start: ((page - 1) * 10)
    },
    headers: {
      'User-Agent': self.userAgent
    }
  };

  request(options, function (error, response, body) {
    if (error || response.statusCode != 200) {
      console.log('Error querying theater data from Google Movies.', error);
      return;
    }

    var $ = cheerio.load(body);

    if ($('.theater').length === 0) {
      console.log($('#results').text());
      return;
    }

    $('.theater').each(function (i, theater) {
      theater = $(theater);

      cloaked_url = theater.find('.desc h2.name a').attr('href');
      theater_id = qs.parse(url.parse(cloaked_url).query).tid;

      info = theater.find('.desc .info').text().split(' - ');

      theaterData = {
        id: theater_id,
        name: theater.find('.desc h2.name').text(),
        address: info[0].trim(),
        phone_number: info[1].trim(),
        movies: []
      };

      theater.find('.showtimes .movie').each(function (i, movie) {
        movie = $(movie);

        cloaked_url = movie.find('.name a').attr('href');
        movie_id = qs.parse(url.parse(cloaked_url).query).mid;

        // Movie info format: RUNTIME - RATING - GENRE - TRAILER - IMDB
        // Some movies don't have a rating, trailer, or IMDb pages, so we need
        // to account for that.
        info = movie.find('.info').text().split(' - ');
        if (info[1].match(/Rated/)) {
          rating = info[1].replace(/Rated/, '').trim();
          if (typeof info[2] != 'undefined') {
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

        imdb = trailer = false;
        if (movie.find('.info a:contains("Trailer")')) {
          cloaked_url = 'https://google.com' + movie.find('.info a:contains("Trailer")').attr('href');
          trailer = qs.parse(url.parse(cloaked_url).query).q;
        }

        if (movie.find('.info a:contains("IMDb")')) {
          cloaked_url = 'https://google.com' + movie.find('.info a:contains("IMDb")').attr('href');
          imdb = qs.parse(url.parse(cloaked_url).query).q;
        }

        movieData = {
          id: movie_id,
          name: movie.find('.name').text(),
          runtime: info[0].trim(),
          rating: rating,
          genre: genre,
          imdb: imdb,
          trailer: trailer,
          showtimes: []
        };

        showtimes = movie.find('.times').text().split(' ');
        for (var x in showtimes) {
          movieData.showtimes.push(showtimes[x].trim());
        }

        theaterData.movies.push(movieData);
      });

      theaters.push(theaterData);
    });

    // No pages to paginate, so return the theaters back.
    if ($('#navbar td a:contains("Next")').length === 0) {
      cb(theaters);
      return;
    }

    // Use the hidden API of getTheaters to pass in the next page and current
    // theaters.
    self.getTheaters(cb, ++page, theaters);
  });
};

module.exports = Showtimes;
