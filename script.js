  // TODO:
  // - Fetch quote
  // - Update YouTube embed
  // - Change background gradient
  // - Fetch Unsplash image(s)
  // - Start scrolling strip

//DROP DOWN MENU SELECTION
document.addEventListener("DOMContentLoaded", () => {
    const moodLinks = document.querySelectorAll(".dropdown-content a")
    //querySelectorAll: ALL elements as an array that matches the given css selector passed in
    
    let currentMood = null;

    moodLinks.forEach(link => {
        link.addEventListener("click", function(event){
            const mood = this.dataset.value //gets the mood value
            console.log("User chose:", mood);

            //GRADIENT BACKGROUND based on MENU SELECTION
            if (currentMood) { //initialise and clear previous moods
                document.body.classList.remove(`mood-${currentMood}`);
            }

            document.body.classList.add(`mood-${mood}`);
            currentMood = mood;
            
            updateQuote(); //call the update function to change quote
        });
    });

});

//QUOTE UPDATE based on MOOD SELECTION
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
        document.getElementById("quote").textContent = "Couldn't load quote 😢";
    });
}


