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


var fs = require("fs");

let fileManager  = {
  read: function() {
    var rawdata = fs.readFileSync('objectdata.json');
    let goodData = JSON.parse(rawdata);
    serverArray = goodData;
  },

  write: function() {
    let data = JSON.stringify(serverArray);
    fs.writeFileSync('objectdata.json', data);
  },

  validData: function() {
    var rawdata = fs.readFileSync('objectdata.json');
    console.log(rawdata.length);
    if(rawdata.length < 1) {
      return false;
    }
    else {
      return true;
    }
  }
};


if(!fileManager.validData()) {
serverArray.push(new MovieObject("Nirvana", 1991, "Rock", "Nevermind", "https://www.nirvana.com/#/"));
serverArray.push(new MovieObject("Third Eye Blind", 1997, "Rock", "Self Titled", "https://www.thirdeyeblind.com/"));
fileManager.write();
}
else {
  fileManager.read(); // do have prior movies so load up the array
}
console.log(serverArray);

/*Get home page. */
router.get('/', function(req, res, next){
  res.sendFile('index.html');
});

/* GET all Music data */
router.get('/getAllMovies', function(req, res) {
  fileManager.read();
  res.status(200).json(serverArray);
});

/*Add one new Artist*/
router.post('/AddMusic', function(req, res){
  const newMusic = req.body;
  serverArray.push(newMusic);
  fileManager.write();
  res.status(200).json(newMusic);
});

module.exports = router;
