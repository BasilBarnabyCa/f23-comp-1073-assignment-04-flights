/** Variables */
const apiKey = "38c7d77d40ecff4ba100b9a4fd0a182d";
const baseUrl = "http://api.aviationstack.com/v1/flights";
const departureInput = document.querySelector("#departure");
const arrivalInput = document.querySelector("#arrival");
const airlineInput = document.querySelector("#airline");
const searchBtn = document.querySelector("#search-btn");
const flightTableContainer = document.querySelector("#flight-table-container");
const tableBody = document.querySelector("#table-body");

function getFlights() {
  flightTableContainer.classList.add("hidden");
  let departure = departureInput.value;
  let arrival = arrivalInput.value;
  let airline = airlineInput.value;

  //   let departure = "YYZ";
  //   let arrival = "LAX";
  //   let airline = "Air Canada";

  if (departure === "") {
    alert("Please enter a departure airport code");
  } else {
    let url = `${baseUrl}?access_key=${apiKey}&dep_iata=${departure}&arr_iata=${arrival}&airline_name=${airline}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => populateFlightsData(data))
      .catch((err) => {
        console.log(err);
      });
  }
}

function populateFlightsData(data) {
  console.log(data.data);
  tableBody.innerHTML = "";

  if (data.pagination.total === 0) {
    alert("No flights found");
  } else {
    let flightsArray = data.data;

    for (let i = 0; i < flightsArray.length; i++) {
      let tableTr = document.createElement("tr");
      let airlineTh = document.createElement("th");
      let flightNumberTd = document.createElement("td");
      let departureTd = document.createElement("td");
      let arrivalTd = document.createElement("td");
      let dateTd = document.createElement("td");
      let statusTd = document.createElement("td");
      let actionTd = document.createElement("td");
	  let viewButton = document.createElement("button");

      let formattedDate = formatDate(flightsArray[i].departure.scheduled);

      // Added style classes to the table elements
      tableTr.classList.add("odd:bg-white", "even:bg-gray-50", "border-b");
      airlineTh.classList.add(
        "px-6",
        "py-4",
        "font-medium",
        "text-gray-900",
        "whitespace-nowrap"
      );

      flightNumberTd.classList.add("px-6", "py-4");
      departureTd.classList.add("px-6", "py-4");
      arrivalTd.classList.add("px-6", "py-4");
      dateTd.classList.add("px-6", "py-4");
      statusTd.classList.add("px-6", "py-4");
      actionTd.classList.add("px-6", "py-4");
	  viewButton.classList.add("px-4", "py-2", "font-semibold", "text-white", "bg-blue-500", "rounded", "hover:bg-blue-700");

      airlineTh.textContent = flightsArray[i].airline.name;
      flightNumberTd.textContent = flightsArray[i].flight.iata;
      departureTd.textContent = flightsArray[i].departure.airport;
      arrivalTd.textContent = flightsArray[i].arrival.airport;
      dateTd.textContent = formattedDate;
      statusTd.textContent = flightsArray[i].flight_status;
	  viewButton.textContent = "View";
	  viewButton.addEventListener('click', getFlight);
	  actionTd.appendChild(viewButton);

      tableTr.appendChild(airlineTh);
      tableTr.appendChild(flightNumberTd);
      tableTr.appendChild(departureTd);
      tableTr.appendChild(arrivalTd);
      tableTr.appendChild(dateTd);
      tableTr.appendChild(statusTd);
      tableTr.appendChild(actionTd);

      tableBody.appendChild(tableTr);
    }

    flightTableContainer.classList.remove("hidden");
  }
}

function getFlight(e) {
  const row = e.target.closest("tr");
  const airline = row.querySelector("th").textContent;
  const flightNumber = row.querySelector("td:nth-child(2)").textContent;
  const departure = row.querySelector("td:nth-child(3)").textContent;
  const arrival = row.querySelector("td:nth-child(4)").textContent;
  const flightStatus = row.querySelector("td:nth-child(6)").textContent;

//   const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=${departure}&arr_iata=${arrival}&airline_iata=${airline}&flight_number=${flightNumber}&flight_status=${flightStatus}`;

//   fetch(url)
//     .then((response) => response.json())
//     .then((data) => populateFlightData(data))
//     .catch((err) => {
//       console.log(err);
//     });
	console.log(url);
}

function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

searchBtn.addEventListener("click", getFlights);
