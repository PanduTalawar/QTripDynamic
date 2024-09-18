
import config from "../conf/index.js";

//Implementation to extract city from query params
function getCityFromURL(search) {
  // TODO: MODULE_ADVENTURES
  // 1. Extract the city id from the URL's Query Param and return it
  const params = new URLSearchParams(search);
  // Get the value of the 'city' parameter
  return params.get('city');

}

//Implementation of fetch call with a paramterized input based on city
async function fetchAdventures(city) {
  // TODO: MODULE_ADVENTURES
  // 1. Fetch adventures using the Backend API and return the data
  try {
    const data = await fetch(`${config.backendEndpoint}/adventures?city=${city}`);
    if (!data.ok) {
      throw new Error('get city api error');
    }
    const resp = await data.json();
    return resp;

  } catch (err) {
    return null;
  }
}

//Implementation of DOM manipulation to add adventures for the given city from list of adventures
function addAdventureToDOM(adventures) {
  // TODO: MODULE_ADVENTURES
  // 1. Populate the Adventure Cards and insert those details into the DOM
  adventures.forEach(element => {
    console.log('ID = ' + element.id + '  category  = ' + element.category + '  name = ' + element.name + '  costPerHead  = ' + element.costPerHead);
    const container = document.getElementById('data');
    const card = document.createElement('div');
    card.classList.add('col-lg-3', 'col-12', 'col-sm-6', 'mb-3');

    card.innerHTML = `
   <a href="detail/?adventure=${element.id}" id="${element.id}">
      <div class=" card activity-card">
        <h5 class="category-banner">${element.category}</h5>
        <img  src="${element.image}" alt="${element.image}">
      <div class="card-body card-body-wi">
       <div class="d-md-flex justify-content-around"">
           <p>${element.name}</p>
           <p>${element.costPerHead}</p>
        </div>
        <div class="d-md-flex justify-content-around"">
           <p>Duration</p>
          <p>${element.duration}</p>
       </div>
     </div>
    </div>
    </a>
  `;
    container.appendChild(card);
  });

}

function makePostRequest() {
  let data =  {
    "city": 'goa' };
    fetch(`${config.backendEndpoint}/adventures/new}`,{
      method:'POST',
      headers: {
        'Content-Type': 'application/json' // Indicate the content type
         },
       body: JSON.stringify(data) // Convert data to JSON string
    });
  
}

//Implementation of filtering by duration which takes in a list of adventures, the lower bound and upper bound of duration and returns a filtered list of adventures.
function filterByDuration(list, low, high) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on Duration and return filtered list
  let filterData = list.filter((item) => item.duration >= low && item.duration <= high);
  return filterData;

}

//Implementation of filtering by category which takes in a list of adventures, list of categories to be filtered upon and returns a filtered list of adventures.
function filterByCategory(list, categoryList) {
  // TODO: MODULE_FILTERS
  // 1. Filter adventures based on their Category and return filtered list
  if (categoryList.length === 0) {
    return list; // No filtering needed if no categories are specified
  }
  // Filter adventures based on whether their category is in the categoryList
  return list.filter(item => categoryList.includes(item.category));
}

// filters object looks like this filters = { duration: "", category: [] };

//Implementation of combined filter function that covers the following cases :
// 1. Filter by duration only
// 2. Filter by category only
// 3. Filter by duration and category together

function filterFunction(list, filters) {
  // TODO: MODULE_FILTERS
  // 1. Handle the 3 cases detailed in the comments above and return the filtered list of adventures
  // 2. Depending on which filters are needed, invoke the filterByDuration() and/or filterByCategory() methods
  // Place holder for functionality to work in the Stubs
  list = applyFilters(list, filters);
  return list;
}

const applyFilters = (list, filters) => {
  // Start with the original list
  let filteredList = list;

  // Apply category filter if category filter is present
  if (filters.category.length > 0) {
    filteredList = filterByCategory(filteredList, filters.category);
  }

  // Apply duration filter if duration filter is present
  if (filters.duration.length > 0) {
    const parts = filters.duration.split('-');
    let low = Number(parts[0]);
    let high = Number(parts[1]);
    filteredList = filterByDuration(filteredList, low, high);
  }

  // Return the filtered list (or original list if no filters applied)
  return filteredList;
};

//Implementation of localStorage API to save filters to local storage. This should get called everytime an onChange() happens in either of filter dropdowns
function saveFiltersToLocalStorage(filters) {
  // TODO: MODULE_FILTERS
  // 1. Store the filters as a String to localStorage
  localStorage.setItem('filters',JSON.stringify(filters));
  return true;
}

//Implementation of localStorage API to get filters from local storage. This should get called whenever the DOM is loaded.
function getFiltersFromLocalStorage() {
  // TODO: MODULE_FILTERS
  // 1. Get the filters from localStorage and return String read as an object
  let localFilterdata = localStorage.getItem('filters'); 

  // Place holder for functionality to work in the Stubs
  return localFilterdata ? JSON.parse(localFilterdata) : null;
}

//Implementation of DOM manipulation to add the following filters to DOM :
// 1. Update duration filter with correct value
// 2. Update the category pills on the DOM

function generateFilterPillsAndUpdateDOM(filters) {
  // TODO: MODULE_FILTERS
  // 1. Use the filters given as input, update the Duration Filter value and Generate Category Pills
  let spillMainDiv = document.getElementById('category-list');
  if(filters.category.length > 0){
    filters.category.forEach((item) =>{
      const catElement = document.createElement('div');
      catElement.innerHTML = `<label class="category-filter">${item}</label>`;
      spillMainDiv.appendChild(catElement);
    });
  }  
  
}
export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
  makePostRequest
};
