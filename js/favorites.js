
const characterImageContainer = document.getElementById("characterImageContainer");
const dialogElement = document.querySelector("#dialog");
const modalImageElement = document.querySelector("#modalImage");
const modalName = document.querySelector("#modalName-span");
const modalComics = document.querySelector("#modalComics-span");
const modalStories = document.querySelector("#modalStories-span");
const modalSeries = document.querySelector("#modalSeries-span");
const modalDescription = document.querySelector("#modalDescription-span");

// Retrieve the data from localStorage
function displayFavorites() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  favorites.forEach((hero) => {

    const characterDiv = document.createElement("div");
    characterDiv.classList.add("character-card");

    const nameElement = document.createElement("p");
    nameElement.classList.add("imageName");
    nameElement.textContent = hero.heroname;

    const imgElement = document.createElement("img");
    imgElement.src= hero.imageSrc
    imgElement.classList.add("image-card")
    let id =hero.id;
    let img =hero.imageSrc;
    let name = hero.heroname;
    let comics = hero.comics;
    let stories = hero.stories;
    let series=hero.series;
    let description =hero.description;
    imgElement.addEventListener("click", () => displayModalView(id, img, name, comics, stories, series, description));
    // console.log(imgElement.src)

    characterDiv.appendChild(imgElement);
    characterDiv.appendChild(nameElement);
    characterImageContainer.appendChild(characterDiv);

  });
}

function isFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites.some(fav => fav.id === id);
}

function displayModalView(id, imageSrc, heroname, comics, stories, series, description){
  modalImageElement.src = imageSrc;
  modalName.textContent = heroname;
  modalComics.textContent = comics;
  modalStories.textContent = stories;
  modalSeries.textContent = series;
  modalDescription.textContent = description || "No description!";


  if (isFavorite(id, imageSrc, heroname, comics, stories, series, description)) {
    getfavHero.disabled = true;
    getremoveHero.disabled = false;
  } else {
    getfavHero.disabled = false;
    getremoveHero.disabled = true;
  }

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
    // Update the page
    characterImageContainer.innerHTML = "";
    displayFavorites();
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
    // Update the page
    characterImageContainer.innerHTML = "";
    displayFavorites();
  } else {
    console.log(`Character with id ${id} is not in favorites`);
  }
}


const getfavHero = document.querySelector(".favHero")
const getremoveHero = document.querySelector(".removeHero")
window.onload = () => {
  displayFavorites();
};
