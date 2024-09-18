import config from "../conf/index.js";

async function init() {
  //Fetches list of all cities along with their images and description
  let cities = await fetchCities();

  //Updates the DOM with the cities
  if (cities) {
    cities.forEach((key) => {
      addCityToDOM(key.id, key.city, key.description, key.image);
    });
  }
}

//Implementation of fetch call
async function fetchCities() {
  // TODO: MODULE_CITIES
  // 1. Fetch cities using the Backend API and return the data
  try {
    const resp = await fetch(`${config.backendEndpoint}/cities`);
    if(!resp.ok) {
      throw new Error(`HTTP error! Status: ${resp.status}`);
    }
    const data = await resp.json();
    console.log('Fetched cities:', data); // Log the data to see its structure
    return data;

  } catch(error) {
    return null;
  }
  
}

//Implementation of DOM manipulation to add cities
function addCityToDOM(id, city, description, image) {
  // TODO: MODULE_CITIES
  // 1. Populate the City details and insert those details into the DOM
  const container = document.getElementById('data');
  const card = document.createElement('div');
  card.classList.add('col-lg-3','col-12','col-sm-6','mb-4');


  card.innerHTML = `
  <a href="pages/adventures/?city=${id}" id="${id}">
    <div class="tile" >
      <img class="img-fluid" src="${image}" alt="${city}">
      <div class="tile-text text-center">
          <h5>${city}</h5>
          <p>1${description}</p>
        </div>
    </div>
    </a>
  `;
  container.appendChild(card);
}

export { init, fetchCities, addCityToDOM };
