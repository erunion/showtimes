# Showtimes · a movie showtimes API
[![NPM](http://img.shields.io/npm/v/showtimes.svg?style=flat)](https://www.npmjs.org/package/showtimes)
[![Travis CI](http://img.shields.io/travis/jonursenbach/showtimes.svg?style=flat)](https://travis-ci.org/jonursenbach/showtimes)

## Installation
```
npm install showtimes --save
```

## Usage
```javascript
var showtimes = require('showtimes');
var s = showtimes(90504, {});

s.getTheaters(function (err, theaters) {
  console.log(theaters);
});
```

```javascript
[ { id: '1441318e8d47fc1b',
    name: 'Vogue Theatre',
    address: '3290 Sacramento Street, San Francisco, CA',
    phoneNumber: '(415) 346-2228',
    movies:
     [ { id: 'c30e28c6168184d9',
         name: 'Maleficent',
         runtime: '‎1hr 37min‎‎',
         rating: 'PG‎‎',
         genre: 'Action/Adventure‎',
         imdb: 'http://www.imdb.com/title/tt1587310/',
         trailer: 'http://www.youtube.com/watch?v=CelenfcEszk',
         showtimes: [ '‎2:45‎pm', '‎7:15pm‎'] },
       { id: 'd64ac30103cb0ea6',
         name: 'Maleficent 3D',
         runtime: '‎1hr 37min‎‎',
         rating: 'PG‎‎',
         genre: 'Action/Adventure‎',
         imdb: 'http://www.imdb.com/title/tt1587310/',
         trailer: 'http://www.youtube.com/watch?v=CelenfcEszk',
         showtimes: [ '‎5:00pm‎'] }
     ] },
  { id: '87f533be471c287d',
    name: '4-Star Theatre',
    address: '2200 Clement Street, San Francisco, CA',
    phoneNumber: '(415) 666-3488',
    movies:
     [ { id: 'e1e16ce6a6cedf0e',
         name: 'A Million Ways to Die in the West',
         runtime: '‎1hr 56min‎‎',
         rating: 'R‎‎',
         genre: 'Comedy/Western‎',
         imdb: 'http://www.imdb.com/title/tt2557490/',
         trailer: 'http://www.youtube.com/watch?v=__7EUx3J9Tg',
         showtimes: [ '‎1:15‎pm', '‎3:40‎pm', '‎6:10‎pm', '‎8:35pm‎'] },
       { id: 'a844a5649d116a42',
         name: 'Edge of Tomorrow',
         runtime: '‎1hr 53min‎‎',
         rating: 'PG-13‎‎',
         genre: 'Drama‎',
         imdb: 'http://www.imdb.com/title/tt1631867/',
         trailer: 'http://www.youtube.com/watch?v=ER8hMnxSUOg',
         showtimes: [ '‎1:20‎pm', '‎3:45‎pm', '‎6:10‎pm', '‎8:35pm‎'] }
     ] },
  ...
]
```

## API
### `Showtimes(location, options)`
* `location` - location you want to pull showtimes for. can be either a zipcode, latitude and Longitude, or a full address.
* `options`
  * `date` - number of days in the future you want to pull showtimes for (ex. on june 9, 2014, pulling showtimes for july 29 you'd pass in "50").
  * `lang` - language of the response, this will localize the movie names, times, etc. (ex. "en" (default) or "tr" for Turkish data)
  * `pageLimit` - page limit for request. (by default returns all pages)
  
### `Showtimes.getTheaters(callback)`
Callback to handle your theater showtime data. Is passed a single argument of theaters.
