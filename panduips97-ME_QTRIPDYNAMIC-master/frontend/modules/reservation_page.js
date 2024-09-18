import config from "../conf/index.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {
  // TODO: MODULE_RESERVATIONS
  // 1. Fetch Reservations by invoking the REST API and return them
  try {
    const data = await fetch(`${config.backendEndpoint}/reservations/`);
    if (!data.ok) {
      throw (`HTTP error! Status: ${data.status}`);
    }
    const resp = await data.json();
    console.log('Fetched reservation:', resp);
    return resp;

  } catch (er) {
    console.log('error', er);
    return null;
  }

}

//Function to add reservations to the table. Also; in case of no reservations, display the no-reservation-banner, else hide it.
function addReservationToTable(reservations) {
  // TODO: MODULE_RESERVATIONS
  // 1. Add the Reservations to the HTML DOM so that they show up in the table
  if (reservations.length > 0) {
    document.getElementById('reservation-table-parent').style.display = 'block';
    document.getElementById('no-reservation-banner').style.display = 'none';

    let resTbody = document.getElementById('reservation-table');

    const columnOrder = [
      { header: "Transaction ID", key: "id" },
      { header: "Booking Name", key: "name" },
      { header: "Adventure", key: "adventureName" },
      { header: "Person(s)", key: "person" },
      { header: "Date", key: "date" },
      { header: "Price", key: "price" },
      { header: "Booking Time", key: "time" },
      { header: "Action", key: "action" }  // Handle this separately
    ];

    function formatDate(dateString) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';

      // Extract day, month, and year
      const day = date.getDate();
      const month = date.getMonth() + 1; // Months are 0-based
      const year = date.getFullYear();

      // Format as D/MM/YYYY
      return `${day}/${month}/${year}`;
    }


    // Function to format date and time
    function formatDateTime(dateString) {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';

      // Define options for date formatting
      const dateOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };

      // Define options for time formatting
      const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };

      // Format date
      const formattedDate = date.toLocaleDateString('en-GB', dateOptions); // "4 November 2020"

      // Format time
      let formattedTime = date.toLocaleTimeString('en-US', timeOptions); // "09:32:31 AM"

      // Remove leading zero from the hour part
      formattedTime = formattedTime.replace(/^0/, ''); // Replaces leading zero if present

      return `${formattedDate}, ${formattedTime.toLowerCase()}`;
    }



    reservations.forEach((data) => {
      let trTab = document.createElement('tr');
      // trTab.id = data.id; 
      columnOrder.forEach(column => {
        let td = document.createElement('td');
        if (column.key === 'action') {
          td.id = data.id;
          let actionButton = document.createElement('a');
          actionButton.id = data.id;
          actionButton.textContent = 'Visit Adventure';
          actionButton.href = actionButton.href = `../detail/?adventure=${data.adventure}`; // Set href with adventure ID
          actionButton.classList.add('reservation-visit-button');
          td.appendChild(actionButton);
        } else if (column.key === 'date') {
          td.textContent = formatDate(data[column.key]);
        } else if (column.key === 'time') {
          // Format time as '15 September 2024 02:32:29 PM'
          const formattedTime = formatDateTime(data[column.key]);
          td.textContent = formattedTime || 'Invalid Date';
        } else {
          td.textContent = data[column.key] || '';
        }

        trTab.appendChild(td);
      });
      resTbody.appendChild(trTab);
    });

  } else {
    document.getElementById('reservation-table-parent').style.display = 'none';
    document.getElementById('no-reservation-banner').style.display = 'block';
  }

  //Conditionally render the no-reservation-banner and reservation-table-parent

  /*
    Iterating over reservations, adding it to table (into div with class "reservation-table") and link it correctly to respective adventure
    The last column of the table should have a "Visit Adventure" button with id=<reservation-id>, class=reservation-visit-button and should link to respective adventure page

    Note:
    1. The date of adventure booking should appear in the format D/MM/YYYY (en-IN format) Example:  4/11/2020 denotes 4th November, 2020
    2. The booking time should appear in a format like 4 November 2020, 9:32:31 pm
  */

}

export { fetchReservations, addReservationToTable };
