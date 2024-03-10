// start by creating data so we don't have to type it in each time
let movieArray = [];

// define a constructor to create movie objects
let MovieObject = function (pArtist, pYear, pGenre, pAlbum, pURL) {
    this.Artist = pArtist;
    this.Year = pYear;
    this.ID = Math.random().toString(16).slice(5);
    this.Genre = pGenre;  // action  comedy  drama  horrow scifi  musical  western
    this.Album = pAlbum;
    this.URL = pURL;
}


movieArray.push(new MovieObject("Nirvana", 1991, "Rock", "Nevermind", "https://www.nirvana.com/#/"));
movieArray.push(new MovieObject("Third Eye Blind", 1997, "Rock", "Self Titled", "https://www.thirdeyeblind.com/"));


let selectedGenre = "not selected";

document.addEventListener("DOMContentLoaded", function () {

    createList();

// add button events ************************************************************************
    
    document.getElementById("buttonAdd").addEventListener("click", function () {
        let newMusic = new MovieObject(document.getElementById("artist").value, 
        document.getElementById("year").value,
        selectedGenre,
        document.getElementById("album").value,
        document.getElementById("URL").value);
        //document.location.href = "index.html#ListAll";
        // also add the URL value


    //push new object to server//
    $.ajax({
        url: "/AddMusic",
        type: "POST",
        data: JSON.stringify(newMusic),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            console.log(result);
            document.location.href = "index.html#ListAll";
        },
    error: function (xhr, textStatus, errorThrown) {
        alert("Server could not add Music: " + newMusic.Artist);
        alert(textStatus + " " + errorThrown);
        }
    });

    });
    
    document.getElementById("buttonClear").addEventListener("click", function () {
        document.getElementById("artist").value = "";
        document.getElementById("year").value = "";
        document.getElementById("album").value = "";
        document.getElementById("URL").value = "";
    });

    document.addEventListener("change", function(event) {
        if (event.target.id === "select-genre") {
            selectedGenre = event.target.value;
        }
    });



    document.getElementById("buttonSortTitle").addEventListener("click", function () {
        movieArray.sort(dynamicSort("Artist"));
        createList();
        document.location.href = "index.html#ListAll";
    });

    document.getElementById("buttonSortGenre").addEventListener("click", function () {
        movieArray.sort(dynamicSort("Genre"));
        createList();
        document.location.href = "index.html#ListAll";
    });

      // button on details page to view the youtube video
      document.getElementById("trailer").addEventListener("click", function () {
        window.open(document.getElementById("oneURL").innerHTML);
    });
    
  
// end of add button events ************************************************************************

  
  
// page before show code *************************************************************************
    // page before show code *************************************************************************
    $(document).on("pagebeforeshow", "#ListAll", function (event) {   // have to use jQuery 
        createList();
    });


    // need one for our details page to fill in the info based on the passed in ID
    $(document).on("pagebeforeshow", "#details", function (event) {   
    let localID = localStorage.getItem('parm');  // get the unique key back from the dictionairy
    movieArray = JSON.parse(localStorage.getItem('movieArray')); 
    let pointer = GetObjectPointer(localID);
    console.log(pointer);
  
     

    
   
    document.getElementById("oneArtist").innerHTML = "The Artist is: " + movieArray[pointer].Artist;
    document.getElementById("oneYear").innerHTML = "Year released: " + movieArray[pointer].Year;
    document.getElementById("oneGenre").innerHTML = "Genre: " + movieArray[pointer].Genre;
    document.getElementById("oneAlbum").innerHTML = "The Album name is: " + movieArray[pointer].Album;
    document.getElementById("oneURL").innerHTML = movieArray[pointer].URL;
    });
 
// end of page before show code *************************************************************************
function GetObjectPointer(whichID){
    for(i=0; i< movieArray.length; i++){
        if(movieArray[i].ID === whichID){
            return i;
        }
    }
}
});  
// end of wait until document has loaded event  *************************************************************************



function createList() {
    // clear prior data
   let myUL =document.getElementById("MovieListul");
   myUL.innerHTML = "";
   
    $.get("/getAllMovies", function(data, status){ // AJAX get
    movieArray = data; // copy returned server json data into local array
    // now INSIDE this “call back” anonymous function,
    // update the web page with this new data
    

   movieArray.forEach(function (oneMovie,) {   // use handy array forEach method
    var myLi = document.createElement('li');
    // adding a class name to each one as a way of creating a collection
    myLi.classList.add('oneMovie'); 
    // use the html5 "data-parm" to encode the ID of this particular data object
    // that we are building an li from
    myLi.setAttribute("data-parm", oneMovie.ID);
    myLi.innerHTML = oneMovie.ID + ":  " + oneMovie.Artist + ", " + oneMovie.Genre;
    myUL.appendChild(myLi);
   
    });
   

     // now we have the HTML done to display out list, 
    // next we make them active buttons
    // set up an event for each new li item, 
    var liList = document.getElementsByClassName("oneMovie");
    let newMoviewArray = Array.from(liList);

    newMoviewArray.forEach(function (element) {
        element.addEventListener('click', function () {
        // get that data-parm we added for THIS particular li as we loop thru them
        var parm = this.getAttribute("data-parm");  // passing in the record.Id
        // get our hidden <p> and save THIS ID value in the localStorage "dictionairy"
        localStorage.setItem('parm', parm);
       
        // but also, to get around a "bug" in jQuery Mobile, take a snapshot of the
        // current movie array and save it to localStorage as well.
        let stringMovieArray = JSON.stringify(movieArray); // convert array to "string"
        localStorage.setItem('movieArray', stringMovieArray);
        
        // now jump to our page that will use that one item
        document.location.href = "index.html#details";
        });
    });
});
};
  

/**
 *  https://ourcodeworld.com/articles/read/764/how-to-sort-alphabetically-an-array-of-objects-by-key-in-javascript
* Function to sort alphabetically an array of objects by some specific key.
* 
* @param {String} property Key of the object to sort.
*/
function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a, b) {
        if (sortOrder == -1) {
            return b[property].localeCompare(a[property]);
        } else {
            return a[property].localeCompare(b[property]);
        }
    }
}
