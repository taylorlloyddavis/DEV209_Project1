var express = require('express');
var router = express.Router();

//start by creating data so we don't have to type it in each time
let serverArray = [];

// define a constructor to create movie objects
let MovieObject = function (pArtist, pYear, pGenre, pAlbum, pURL) {
    this.Artist = pArtist;
    this.Year = pYear;
    this.ID = Math.random().toString(16).slice(5);
    this.Genre = pGenre;  // action  comedy  drama  horrow scifi  musical  western
    this.Album = pAlbum;
    this.URL = pURL;
}


serverArray.push(new MovieObject("Nirvana", 1991, "Rock", "Nevermind", "https://www.nirvana.com/#/"));
serverArray.push(new MovieObject("Third Eye Blind", 1997, "Rock", "Self Titled", "https://www.thirdeyeblind.com/"));

console.log(serverArray);

/*Get home page. */
router.get('/', function(req, res, next){
  res.sendFile('index.html');
});

/* GET all Music data */
router.get('/getAllMovies', function(req, res) {
  res.status(200).json(serverArray);
});

module.exports = router;
