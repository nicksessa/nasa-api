const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

// NASA API
const count = 10;
//const apiKey = "DEMO_KEY";
const apiKey = "aZ55cxe2UYeURfRFjJlSSODjkQvHU9WZDuxgDcVd";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function createDOMNodes(page) {
  // Use Object.values(favorites) to get the values in the favorites object and converts it to an array
  const currentArray =
    page === "results" ? resultsArray : Object.values(favorites);
  console.log("current Array", page, currentArray);

  currentArray.forEach((result) => {
    // Car Container
    const card = document.createElement("div");
    card.classList.add("card");
    // Link
    const link = document.createElement("a");
    link.href = result.hdurl;
    link.title = "View Full Image";
    link.target = "_blank";
    // Image
    const image = document.createElement("img");
    image.src = result.url;
    image.alt = "NASA Picture of the Day";
    image.loading = "lazy";
    image.classList.add("card-img-top");
    // Card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    // Card title
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title;
    // save text
    const saveText = document.createElement("p");
    saveText.classList.add("clickable");
    saveText.textContent = "Add to Favorites";
    saveText.setAttribute("onclick", `saveFavorite('${result.url}')`);
    // Card text
    const cardText = document.createElement("p");
    cardText.textContent = result.explanation;
    // Footer Container
    const footer = document.createElement("small");
    footer.classList.add("text-muted");
    // date
    const date = document.createElement("strong");
    date.textContent = result.date;
    // Copyright
    const copyrightResult =
      result.copyright === undefined ? "" : result.copyright;
    const copyright = document.createElement("span");
    copyright.textContent = ` ${copyrightResult}`;
    // append
    footer.append(date, copyright);
    cardBody.append(cardTitle, saveText, cardText, footer);
    link.appendChild(image);
    card.append(link, cardBody);
    //console.log(card);
    imagesContainer.appendChild(card);
  });
}

function updateDOM(page) {
  // get favorites from local storage
  if (localStorage.getItem("nasaFavorites")) {
    favorites = JSON.parse(localStorage.getItem("nasaFavorites"));
    console.log("favorites from local storage: ", favorites);
  }
  createDOMNodes(page);
}

// Get Images from NASA API
async function getNasaPictures() {
  try {
    const response = await fetch(apiUrl);
    resultsArray = await response.json();
    //console.log(resultsArray);
    updateDOM("favorites");
  } catch (error) {
    // Catch error here
  }
}

// add result to favorites
function saveFavorite(itemUrl) {
  //console.log(itemUrl);
  // Loop through results array to select favorite
  resultsArray.forEach((item) => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      //console.log(JSON.stringify(favorites));
      // show save confirmation for 2 seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // set favorites in localStorage
      localStorage.setItem("nasaFavorites", JSON.stringify(favorites));
    }
  });
}

// on load
getNasaPictures();
