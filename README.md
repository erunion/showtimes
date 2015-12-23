# Showtimes · a movie showtimes API
[![NPM](http://img.shields.io/npm/v/showtimes.svg?style=flat)](https://www.npmjs.org/package/showtimes)
[![Travis CI](http://img.shields.io/travis/erunion/showtimes.svg?style=flat)](https://travis-ci.org/erunion/showtimes)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Installation
```
npm install showtimes --save
```

## Usage
```
var Showtimes = require('showtimes');
var api = new Showtimes(10001, {});

api.getTheaters(function (error, theaters) {
  if (error) {
    throw error
  }

  console.log(theaters);
});
```

```
[ { id: '4c9f211a0800ff36',
    name: 'AMC Loews 34th Street 14',
    address: '312 W. 34th St., New York, NY',
    phoneNumber: '(888) 262-4386',
    movies:
     [ { id: 'cfbfd1f634e7638a',
         name: 'Star Wars: The Force Awakens 3D',
         runtime: '2hr 16min',
         rating: 'PG-13',
         genre: ['Scifi', 'Fantasy'],
         imdb: 'http://www.youtube.com/watch?v=tt08BH9COsI',
         trailer: 'http://www.imdb.com/title/tt2488496/',
         showtimes: [ '9:30am', '1:00pm', '4:30pm', '8:00pm' ] },
       { id: '89d9737d67580511',
         name: 'Star Wars: The Force Awakens',
         runtime: '2hr 16min',
         rating: 'PG-13',
         genre: ['Scifi', 'Fantasy'],
         imdb: 'http://www.youtube.com/watch?v=tt08BH9COsI',
         trailer: 'http://www.imdb.com/title/tt2488496/',
         showtimes: [ '10:00am', '1:30pm', '5:00pm', '8:30pm' ] } ] },
  { id: '7a9fd407207f4951',
    name: 'Bow Tie Chelsea Cinemas',
    address: '260 West 23rd Street, New York, NY',
    phoneNumber: '(212) 691-4744',
    movies:
     [ { id: 'cfbfd1f634e7638a',
         name: 'Star Wars: The Force Awakens 3D',
         runtime: '2hr 16min',
         rating: 'PG-13',
         genre: ['Scifi', 'Fantasy'],
         imdb: 'http://www.youtube.com/watch?v=tt08BH9COsI',
         trailer: 'http://www.imdb.com/title/tt2488496/',
         showtimes:
          [ '5:20am',
            '10:00am',
            '10:30am',
            '1:05pm',
            '1:35pm',
            '4:10pm',
            '4:40pm',
            '7:20pm',
            '7:50pm',
            '10:30pm',
            '11:00pm' ] }] }
  ...
]
```

## Documentation
### API
#### `showtimes(location, options)`
* `location` &mdash; The location you want to pull showtimes for. This can be either a zipcode, latitude and Longitude, or a full address.
* `options`
  * `date` &mdash; Number of days in the future you want to pull showtimes for. (ex. on june 9, 2014, pulling showtimes for july 29 you'd pass in "50")
  * `lang` &mdash; Language of the response, this will localize the movie names, times, etc. (ex. "en" (default) or "tr" for Turkish data)
  * `pageLimit` &mdash; Page limit for request. By default, this returns allm (999) pages.

#### `showtimes.getTheaters(callback)`
* `callback` &mdash; Callback function to run after generating a standardized response of theaters.
  * `error` &mdash; Any error messages that were found when doing a query. Null if all is good.
  * `theaters` &mdash; Standardized response of theaters.

#### `showtimes.getTheater(theaterId, callback)`
* `theaterId &mdash; Theater ID for the theater you want to query. You can get this from a `getTheaters()` or `getMovies()` response.
* `callback` &mdash; Callback function to run after generating a standardized theater response.
  * `error` &mdash; Any error messages that were found when doing a query. Null if all is good.
  * `theater` &mdash; Standardized response for the theater.

#### `showtimes.getMovies(callback)`
* `callback` &mdash; Callback function to run after generating a standardized response of movies.
  * `error` &mdash; Any error messages that were found when doing a query. Null if all is good.
  * `movies` &mdash; Standardized response of movies.

#### `showtimes.getMovie(movieId, callback)`
* `movieId` &mdash; Movie ID for the movie you want to query. You can get this from a `getTheaters()` or `getMovies()` response.
* `callback` &mdash; Callback function to run after generating a standardized movie response.
  * `error` &mdash; Any error messages that were found when doing a query. Null if all is good.
  * `movie` &mdash; Standardized response for the movie.

### Standardized Responses
#### Theater
```
{
  id: '4c9f211a0800ff36',
  name: 'AMC Loews 34th Street 14',
  address: '312 W. 34th St., New York, NY',
  phoneNumber: '(888) 262-4386',
  movies: [<movies>],
  showtimes: ['9:30am', '1:00pm', '4:30pm', '8:00pm']
}
```

* `id` is represented as `false` if no theater ID could be obtained (usually only happens on some boutique theaters).
* `phoneNumber` and `movies` are only available on `getTheaters()`.
* `showtimes` is only available through `getMovies()` or `getMovie()`.
* `address` and `phoneNumber` are all optional, and not always present for every theater.

#### Movie
```
{
  id: 'cfbfd1f634e7638a',
  name: 'Star Wars: The Force Awakens 3D',
  runtime: '2hr 16min',
  rating: 'PG-13',
  genre: ['Scifi', 'Fantasy'],
  imdb: 'http://www.youtube.com/watch?v=tt08BH9COsI',
  trailer: 'http://www.imdb.com/title/tt2488496/',
  director: 'J.J. Abrams',
  cast: [<cast>]
  description: 'In this continuation of the "Star Wars" saga, ... the former Rebel Alliance.',
  theaters: [<theaters>],
  showtimes: ['12:20pm', '3:40pm', '6:30pm', '7:00pm', '9:50pm', '10:20pm']
}
```

* `director`, `cast`, `description`, and `theaters` are only available from `getMovies` and `getMovie()`
* `showtimes` is only available from `getTheaters()`.
* `genre`, `rating`, `runtime`, `imdb`, and `trailer` are all optional, and not always present on every movie.

## Upgrading to v2
With v2, I've moved the entire library over to be written in ES6 so components can be easily reused with having the
library internals be a proper class. Unfortunately, this has made v2 incompatibe with v1, but thankfully only a few
minor things have changed with the API.

1. Instead of calling the library as `s = Showtimes(location)`, you must now instantiate the class with `s = new Showtimes(location)`.
2. The `genre` response that comes back from API calls is now represented as an array instead of a compounded string.
