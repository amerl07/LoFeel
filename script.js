//Global Variable for Mood selected
let currentMood = null;

//DROP DOWN MENU SELECTION
document.addEventListener("DOMContentLoaded", () => { //when the page loads
    const moodLinks = document.querySelectorAll(".dropdown-content a")
    //querySelectorAll: ALL elements as an array that matches the given css selector passed in

    moodLinks.forEach(link => {
        link.addEventListener("click", function(event){
            const mood = this.dataset.value //gets the mood value
            console.log("User chose:", mood);

            applyMood(mood);
        });
    });
});

function applyMood(mood) { //changes background, calls to quote and music
    //GRADIENT BACKGROUND based on MENU SELECTION
    if (currentMood) { //initialise and clear previous moods
        document.body.classList.remove(`mood-${currentMood}`);
    }

    document.body.classList.add(`mood-${mood}`);
    currentMood = mood;

    updateQuote(); //call the update function to change quote
    updateMusic(mood); //call the update function to change music
    updateImageStrip(mood); //call the update function to change images
}

//QUOTE UPDATE (random, independent from mood)
function updateQuote() {
    const timestamp = new Date().getTime(); //so api returns new quote everytime

    fetch(`https://api.allorigins.win/raw?url=https://zenquotes.io/api/random&cachebuster=${timestamp}`) //sending a request to the API, gives a response object
        .then(response => response.json()) //convert the response object to JavaScript Object
        .then(data => { //data = the json object.
            // parameter name in .then() is arbitrary

            const quoteBox = document.getElementById("quote") //saves a reference here to the HTML element with id="quote"
            
            const quote = data[0] //first item in the returned array
            quoteBox.innerHTML = `"${quote.q}" — <em>${quote.a}</em>`; //UPDATES the HTML! to contents + author
        })
        .catch(error => {
            console.error("Quote fetch error:", error);
            document.getElementById("quote").textContent = "Quote loading failed";
    });
}

//MUSIC PLAYER UPDATE (based on mood)
const musicVideos = { //video ids
    chill: ["qPAiYaZOGeQ", "BCxTQq0UiFs", "kyqpSycLASY", "UbXYxaf1itQ", "6mN1780N9vg", "2au51-rm6cE"],
    dreamy: ["FlnsZeivkPM", "BnjWrOTdKZo", "Jm8PuBFDabE", "UMhOGEo8O5A", "q22uHBl9qxw", "PpJQZH9B1Y4", "QltODNFwp20", "90QqkQNzMFk", "4dV96eVRrjk"],
    focused: ["amfWIRasxtI", "P4r9LeM7DiQ", "ptHnmgaFvwE", "l-2hOKIrIyI&pp=ygUKc3R1ZHkgbG9madIHCQmECQGHKiGM7w%3D%3D", "hGrIgIfCxP0&pp=ygUKc3R1ZHkgbG9maQ%3D%3D", "FJflWlFyhRE"],
    sad: ["89TTVAW_JHk", "xsDnEj2Hx4Q", "xDih5SwFs_c", "mjB0d2Jbanw", "DFuFDdL9sl4", "sF80I-TQiW0", "2FNz4D67KhE&pp=ygUKY2hpbGwgbG9maQ%3D%3D"],
    bright: ["DJKIIzOD6y8", "UCQM2ounTcs", "I140iNpx1xM&pp=ygUKaGFwcHkgbG9maQ%3D%3D", "gUbNlN_SqpE", "AhJ9-AtFje0", "3gKeFiHK_4&pp=ygUKc3R1ZHkgbG9maQ%3D%3D"]
  };

function updateMusic(mood) {
    //randomly playing video within that mood
    const playlist = musicVideos[mood]; //get the array of that mood
    const index = Math.floor(Math.random() * playlist.length); //Math.random returns random 0 <= x < 1
    const videoId = playlist[index];

    const player = document.getElementById("music-player"); //saves a reference here to the HTML element with id="music-player"
    player.innerHTML = `
        <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/${videoId}?autoplay=1"
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
        </iframe>
    `;
}

const newSongBtn = document.getElementById("new-song-btn"); 
if (newSongBtn) { //just to check if button is here & finished loading
    newSongBtn.addEventListener("click", () => {
        if (currentMood){
            updateMusic(currentMood)
        }
    })
}

//CLOCK UPDATE
function updateClock() {
    //get h, m, s
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    //add leading zeros
    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");

    // Determine whether it's today or tonight
    const timeOfDay = (hours >= 18 || hours < 6) ? "tonight" : "today";
    const timeString = `${hours}:${minutes}:${seconds}`;


    const clock = document.getElementById("clock");
    clock.innerHTML = `
        It is ${timeString}<br><br>
        Here is your vibe for ${timeOfDay}.
    `;
}

document.addEventListener("DOMContentLoaded", () => {
    updateClock(); //show after the page loads
    setInterval(updateClock, 1000); //update every second
  });


//UNSPLASH API

const UNSPLASH_ACCESS_KEY = "03CjIStF__MLHGTYdFRrOsnS9_bTq5akSY5NcLND-nM";

function updateImageStrip(mood) {
    const strip = document.getElementById("image-strip");
    strip.innerHTML = "" //clear it beforehand

    const page = Math.floor(Math.random() * 10) + 1; //get a random page, so we don't get same images everytime

    //same logic as API to quotes
    fetch(`https://api.unsplash.com/search/photos?query=${mood},nature,scenery,landscape&per_page=10&orientation=landscape&page=${page}&client_id=${UNSPLASH_ACCESS_KEY}`)
    .then(res => res.json()) //convert response to js object
    .then(data => {
        console.log("Unsplash image data:", data.results);
        data.results.forEach(photo => { //loop through all photo objects
            const img = document.createElement("img"); //make an image
            img.src = photo.urls.small; //set the image url
            strip.appendChild(img); //add image to the strip
      });

    //clone images for infinite loop
    const images = [...strip.children];
    images.forEach(img => {
        const clone = img.cloneNode();
        strip.appendChild(clone);
        });
    })
    
    .catch(error => {
      console.error("Error fetching Unsplash images:", error);
      strip.textContent = "Unable to load moodboard images.";
    });
}