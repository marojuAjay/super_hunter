const publicKey = "1f0bcb9b187fc93f847f1cafd9f85468";
const privateKey = "10b70287677eba0342d98cc0e6a85fcd5e37846c";
const ts = Date.now();
const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
const apiurl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

const searchString = document.getElementById("searchResult");
const characterImageContainer = document.getElementById("characterImageContainer");
const dialogElement = document.querySelector("#dialog");
const modalImageElement = document.querySelector("#modalImage");
const modalName = document.querySelector("#modalName-span");
const modalComics = document.querySelector("#modalComics-span");
const modalStories = document.querySelector("#modalStories-span");
const modalSeries = document.querySelector("#modalSeries-span");
const modalDescription = document.querySelector("#modalDescription-span");
const modalId = document.querySelector("#charId");

searchString.addEventListener("input", async function () {
  const searchResultValue = searchString.value;
  await hitapi(searchResultValue);
});

async function hitapi(textSearch) {
  try {
    const apiUrl = textSearch ? 
      `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${textSearch}&ts=${ts}&apikey=${publicKey}&hash=${hash}` : 
      apiurl;
    const data = await fetchData(apiUrl);
    
    clearCharacterImages();
    displayCharacters(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.data.results;
  } catch (error) {
    throw error;
  }
}

function clearCharacterImages() {
  characterImageContainer.innerHTML = "";
}

function displayCharacters(characters) {
  characters.forEach(character => {
    const { thumbnail, name, description, comics, series, stories, id } = character;
    if (!thumbnail.path.includes("image_not_available") && !thumbnail.path.includes("4c00358ec7548") && !thumbnail.path.includes("4ce18691cbf04") && !thumbnail.path.includes("535fecbbb9784") ) {
      const imageExtension = thumbnail.extension;
      const fullImagePath = `${thumbnail.path}.${imageExtension}`;
      
      const characterDiv = document.createElement("div");
      characterDiv.classList.add("character-card");

      const imgElement = document.createElement("img");
      imgElement.src = fullImagePath;
      imgElement.classList.add("image-card");
      imgElement.addEventListener("click", () => displayModalView(id, fullImagePath, name, comics.available, stories.available, series.available, description));

      const nameElement = document.createElement("p");
      nameElement.classList.add("imageName");
      nameElement.textContent = name;

      characterDiv.appendChild(imgElement);
      characterDiv.appendChild(nameElement);
      characterImageContainer.appendChild(characterDiv);
    }
  });
}

function isFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.some(fav => fav.id === id);
}


function displayModalView(id, imageSrc, heroname, comics, stories, series, description) {
  modalImageElement.src = imageSrc;
  modalName.textContent = heroname;
  modalComics.textContent = comics;
  modalStories.textContent = stories;
  modalSeries.textContent = series;
  // modalId.textContent = id;
  modalDescription.textContent = description || "No description!";

  // Update favHero and removeHero buttons
  if (isFavorite(id, imageSrc, heroname, comics, stories, series, description)) {
    getfavHero.disabled = true;
    getremoveHero.disabled = false;
  } else {
    getfavHero.disabled = false;
    getremoveHero.disabled = true;
  }
  
  // Add event listeners to favHero and removeHero buttons
  getfavHero.onclick = () => addtofavorites(id, imageSrc, heroname, comics, stories, series, description);
  getremoveHero.onclick = () => removefromfavorites(id, imageSrc, heroname, comics, stories, series, description);

  dialogElement.showModal();
}

function addtofavorites(id, imageSrc, heroname, comics, stories, series, description) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let hero = {id, imageSrc, heroname, comics, stories, series, description};
  let index = favorites.findIndex(fav => fav.id === id);
  if (index === -1) {
    favorites.push(hero);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    getfavHero.disabled = true;
    getremoveHero.disabled = false;
    console.log(`Added character with id ${id} to favorites ${imageSrc} ${heroname} ${comics} ${description}`);
  } else {
    console.log(`Character with id ${id} is already in favorites ${imageSrc} ${heroname} ${comics} ${description}`);
  }
}

function removefromfavorites(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  let index = favorites.findIndex(fav => fav.id === id);
  if (index > -1) {
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    getfavHero.disabled = false;
    getremoveHero.disabled = true;
    console.log(`Removed character with id ${id} from favorites`);
  } else {
    console.log(`Character with id ${id} is not in favorites`);
  }
}

hitapi();
const getfavHero = document.querySelector(".favHero")
const getremoveHero = document.querySelector(".removeHero")

// const nextpage = document.getElementById("Favourites")

// nextpage.addEventListener("click",function(){
//   console.log("clicked")
// })