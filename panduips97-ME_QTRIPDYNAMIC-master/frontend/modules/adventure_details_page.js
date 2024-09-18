import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Get the Adventure Id from the URL
  const params = new URLSearchParams(search);
  // Get the value of the 'city' parameter
  return params.get('adventure');
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Fetch the details of the adventure by making an API call
  try {
    const resp = await fetch(`${config.backendEndpoint}/adventures/detail?adventure=${adventureId}`);
    if (!resp.ok) {
      throw ('adventures detail api error');
    }
    const data = await resp.json();
    return data;

  } catch (er) {
    return null;
  }
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Add the details of the adventure to the HTML DOM
  let name = document.getElementById("adventure-name");
  name.innerHTML = adventure.name;

  let subtitle = document.getElementById("adventure-subtitle");
  subtitle.innerHTML = adventure.subtitle;


  let contentDom = document.getElementById("adventure-content");
  contentDom.innerHTML= adventure.content;

  let imgDiv = document.getElementById("photo-gallery");
    

   adventure.images.forEach((src)=>{
    let imgElement = document.createElement('img'); // Create an img element
    imgElement.src = src; // Set the src attribute
    imgElement.className = 'activity-card-image'; // Set the class name
    imgDiv.appendChild(imgElement); // Append the img element to the div
   })

}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  // Create the outer carousel div
  let carouselDiv = document.createElement('div');
  carouselDiv.classList.add('carousel', 'slide');
  carouselDiv.id = 'carouselExampleIndicators'; // Assign an id for Bootstrap carousel

  // Create carousel-inner div
  let carouselInnerDiv = document.createElement('div');
  carouselInnerDiv.classList.add('carousel-inner');

  images.forEach((src, index) => {
    // Create a new carousel-item div
    let carouselItemDiv = document.createElement('div');
    carouselItemDiv.classList.add('carousel-item');
    
    // Add 'active' class to the first item to make it visible initially
    if (index === 0) {
      carouselItemDiv.classList.add('active');
    }

    // Create img element
    let imgElement = document.createElement('img');
    imgElement.src = src;
    imgElement.className = 'd-block w-100';

    // Append img to carousel-item
    carouselItemDiv.appendChild(imgElement);
    
    // Append carousel-item to carousel-inner
    carouselInnerDiv.appendChild(carouselItemDiv);
  });

  // Append carousel-inner to the outer carousel div
  carouselDiv.appendChild(carouselInnerDiv);

  // Optionally, add carousel controls if needed
  let prevControl = document.createElement('a');
  prevControl.classList.add('carousel-control-prev');
  prevControl.href = `#${carouselDiv.id}`;
  prevControl.role = 'button';
  prevControl.dataset.bsSlide = 'prev';
  let prevIcon = document.createElement('span');
  prevIcon.classList.add('carousel-control-prev-icon');
  prevIcon.setAttribute('aria-hidden', 'true');
  prevControl.appendChild(prevIcon);
  carouselDiv.appendChild(prevControl);

  let nextControl = document.createElement('a');
  nextControl.classList.add('carousel-control-next');
  nextControl.href = `#${carouselDiv.id}`;
  nextControl.role = 'button';
  nextControl.dataset.bsSlide = 'next';
  let nextIcon = document.createElement('span');
  nextIcon.classList.add('carousel-control-next-icon');
  nextIcon.setAttribute('aria-hidden', 'true');
  nextControl.appendChild(nextIcon);
  carouselDiv.appendChild(nextControl);

  // Get the photo-gallery div and clear existing content
  let imgOverlapDiv = document.getElementById("photo-gallery");
  imgOverlapDiv.innerHTML = ''; // Clear existing content
  imgOverlapDiv.appendChild(carouselDiv); // Append the newly created carousel
}


//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If the adventure is already reserved, display the sold-out message.
  if( adventure.available) {
    document.getElementById('reservation-panel-sold-out').style.display = 'none';
    document.getElementById('reservation-panel-available').style.display = 'block';
    document.getElementById('reservation-person-cost').innerHTML = adventure.costPerHead;
  } else {
    document.getElementById('reservation-panel-sold-out').style.display = 'block';
    document.getElementById('reservation-panel-available').style.display = 'none';
  }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  // TODO: MODULE_RESERVATIONS
  // 1. Calculate the cost based on number of persons and update the reservation-cost field
  let totalAmount = adventure.costPerHead * (+persons);
  document.getElementById('reservation-cost').innerHTML = totalAmount;
}

//Implementation of reservation form submission
async function captureFormSubmit(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. Capture the query details and make a POST API call using fetch() to make the reservation
  // 2. If the reservation is successful, show an alert with "Success!" and refresh the page. If the reservation fails, just show an alert with "Failed!".
  document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());
    formObject.adventure = adventure.id;
    console.log('Form Data:', formObject);

    const postData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
      body: JSON.stringify(formObject)
    }
    // Make the fetch request
    fetch(`${config.backendEndpoint}/reservations/new`, postData)
      .then(response => {
        if (response.ok) {
          return response.json(); // Parse the response JSON
        } else {
          return response.json().then(errorData => {
            // Handle error response
            alert('Failed!');
            console.error('Error Data:', errorData);
            throw new Error('Failed to submit form');
          });
        }
      })
      .then(responseData => {
        // Handle successful response
        alert('Success!');
        console.log('Response Data:', responseData);
       // location.reload(); // Reload the page or handle success as needed
      })
      .catch(error => {
        // Handle fetch errors
        alert('An error occurred!');
        console.error('Fetch Error:', error); // Log fetch errors
      });
  });

}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
  // TODO: MODULE_RESERVATIONS
  // 1. If user has already reserved this adventure, show the reserved-banner, else don't
  if( adventure.reserved) {
    document.getElementById('reserved-banner').style.display = 'block';
  } else {
    document.getElementById('reserved-banner').style.display = 'none';
  }

}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
