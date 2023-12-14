/** Variable Declaration */
const studentName = document.querySelector("#student-name");
const studentId = document.querySelector("#student-id");
const apiKey = "38c7d77d40ecff4ba100b9a4fd0a182d";
const baseUrl = "http://api.aviationstack.com/v1/flights";
const searchContainer = document.querySelector("#search-container");
const departureInput = document.querySelector("#departure");
const arrivalInput = document.querySelector("#arrival");
const airlineInput = document.querySelector("#airline");
const searchBtn = document.querySelector("#search-btn");
const backBtn = document.querySelector("#back-btn");
const flightTableContainer = document.querySelector("#flight-table-container");
const tableBody = document.querySelector("#table-body");

const detailsContainer = document.querySelector("#details-container");
const flightIata = document.querySelector(".flight-iata");
const airlineName = document.querySelector(".airline-name");
const departureIata = document.querySelector(".departure-iata");
const departureIataSecondary = document.querySelector(
  ".departure-iata-secondary"
);
const departureIcao = document.querySelector(".departure-icao");
const departureAirport = document.querySelector(".departure-airport-name");
const departureAirportSecondary = document.querySelector(
  ".departure-airport-name-secondary"
);
const arrivalIata = document.querySelector(".arrival-iata");
const arrivalIataSecondary = document.querySelector(".arrival-iata-secondary");
const arrivalIcao = document.querySelector(".arrival-icao");
const arrivalAirport = document.querySelector(".arrival-airport-name");
const arrivalAirportSecondary = document.querySelector(
  ".arrival-airport-name-secondary"
);
const flightStatus = document.querySelector(".flight-status");
const departureScheduled = document.querySelector(".departure-scheduled");
const departureEstimated = document.querySelector(".departure-estimated");
const departureActual = document.querySelector(".departure-actual");
const departureRunway = document.querySelector(".departure-runway");
const departureTerminal = document.querySelector(".departure-terminal");
const departureGate = document.querySelector(".departure-gate");
const arrivalScheduled = document.querySelector(".arrival-scheduled");
const arrivalEstimated = document.querySelector(".arrival-estimated");
const arrivalActual = document.querySelector(".arrival-actual");
const arrivalRunway = document.querySelector(".arrival-runway");
const arrivalTerminal = document.querySelector(".arrival-terminal");
const arrivalGate = document.querySelector(".arrival-gate");
const flightStatusContainer = document.querySelector("#flight-status-container");

// Populate student details
studentName.textContent = "Basil Barnaby";
studentId.textContent = "200540109";

// Clear input fields

// Function that gets the flights from the API with the given parameters
function getFlights() {
  searchBtn.disabled = true;
  departureInput.disabled = true;
  arrivalInput.disabled = true;
  airlineInput.disabled = true;
  flightTableContainer.classList.add("hidden");

  // Get the values from the input fields
  let departure = departureInput.value;
  let arrival = arrivalInput.value;
  let airline = airlineInput.value;

  // Check if the mandatory field is empty and alert the user otherwise make the API call
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

// Function that populates the table with the flights data
function populateFlightsData(data) {
  console.log(data.data);
  searchBtn.disabled = false;
  departureInput.disabled = false;
  arrivalInput.disabled = false;
  airlineInput.disabled = false;
  tableBody.innerHTML = "";

  if (data && data.pagination && data.pagination.total === 0) {
    alert("No flights found");
  } else {
    let flightsArray = data.data;

    if (flightsArray && flightsArray.length > 0) {
      for (let i = 0; i < flightsArray.length; i++) {
        // Create the table elements
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
        viewButton.classList.add(
          "px-4",
          "py-2",
          "font-semibold",
          "text-white",
          "bg-blue-500",
          "rounded",
          "hover:bg-blue-700"
        );

        // Populate the table elements with the data
        airlineTh.textContent = flightsArray[i].airline.name;
        flightNumberTd.textContent = flightsArray[i].flight.iata;
        departureTd.textContent = flightsArray[i].departure.airport;
        arrivalTd.textContent = flightsArray[i].arrival.airport;
        dateTd.textContent = formattedDate;
        statusTd.textContent = flightsArray[i].flight_status;
        viewButton.textContent = "View";
        viewButton.addEventListener("click", (e) => {
          getFlight(
            flightsArray[i].departure.iata,
            flightsArray[i].arrival.iata,
            flightsArray[i].airline.iata,
            flightsArray[i].flight.number,
            flightsArray[i].flight_status
          );
        });

        actionTd.appendChild(viewButton);

        // Append the table elements to the table body
        tableTr.appendChild(airlineTh);
        tableTr.appendChild(flightNumberTd);
        tableTr.appendChild(departureTd);
        tableTr.appendChild(arrivalTd);
        tableTr.appendChild(dateTd);
        tableTr.appendChild(statusTd);
        tableTr.appendChild(actionTd);

        // Append the table row to the table body
        tableBody.appendChild(tableTr);
      }
    } else {
      alert("Oops! Something went wrong. Please try again.");
    }

    // Show the table
    flightTableContainer.classList.remove("hidden");
  }
}

// Function that gets the flight details from the API with the given parameters
function getFlight(
  departureIata,
  arrivalIata,
  airlineIata,
  flightNumber,
  flightStatus
) {
  // Check if the mandatory params are empty and alert the user otherwise make the API call
  if (
    departureIata == null ||
    arrivalIata == null ||
    airlineIata == null ||
    flightNumber == null ||
    flightStatus == null
  ) {
    alert("Cannot retrieve flight details due to missing data");
  } else {
    searchContainer.classList.add("hidden");
    let url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=${departureIata}&arr_iata=${arrivalIata}&airline_iata=${airlineIata}&flight_number=${flightNumber}&flight_status=${flightStatus}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => populateFlightData(data))
      .catch((err) => {
        console.log(err);
      });
  }
}

// Function that populates the flight details
function populateFlightData(data) {
  console.log(data.data);
  if (data && data.data.length > 0) {
    detailsContainer.classList.remove("hidden");
    flightIata.textContent = data.data[0].flight.iata;
    airlineName.textContent = data.data[0].airline.name;
    departureIata.textContent = data.data[0].departure.iata;
    departureIataSecondary.textContent = `IATA: ${data.data[0].departure.iata}`;
    departureIcao.textContent = data.data[0].departure.icao;
    departureAirport.textContent = data.data[0].departure.airport;
    departureAirportSecondary.textContent = data.data[0].departure.airport;
    arrivalIata.textContent = data.data[0].arrival.iata;
    arrivalIataSecondary.textContent = `IATA: ${data.data[0].arrival.iata}`;
    arrivalIcao.textContent = `ICAO: ${data.data[0].arrival.icao}`;
    arrivalAirport.textContent = data.data[0].arrival.airport;
    arrivalAirportSecondary.textContent = data.data[0].arrival.airport;

    departureScheduled.textContent = formatDate(
      data.data[0].departure.scheduled
    );
    departureEstimated.textContent = formatDate(
      data.data[0].departure.estimated
    );
    departureActual.textContent = formatDate(data.data[0].departure.actual);
    departureRunway.textContent = formatDate(data.data[0].departure.actual);
    departureTerminal.textContent = data.data[0].departure.terminal;
    departureGate.textContent = data.data[0].departure.gate;
    arrivalScheduled.textContent = formatDate(data.data[0].arrival.scheduled);
    arrivalEstimated.textContent = formatDate(data.data[0].arrival.estimated);
    arrivalActual.textContent = formatDate(data.data[0].arrival.actual);
    arrivalRunway.textContent = formatDate(data.data[0].arrival.actual);
    arrivalTerminal.textContent = data.data[0].arrival.terminal;
    arrivalGate.textContent = data.data[0].arrival.gate;

    // Because the API only returns text data (no images etc), I decided to change color status based on the flight status response to meet rubric requirements
    if (data.data[0].flight_status === "active") {
      flightStatusContainer.classList.add("bg-emerald-500");
    } else if (data.data[0].flight_status === "scheduled") {
      flightStatusContainer.classList.add("bg-indigo-500");
    } else if (data.data[0].flight_status === "landed") {
      flightStatusContainer.classList.add("bg-green-500");
    } else if (data.data[0].flight_status === "cancelled") {
      flightStatusContainer.classList.add("bg-red-500");
    } else if (data.data[0].flight_status === "delayed") {
      flightStatusContainer.classList.add("bg-orange-500");
    }
	flightStatus.textContent = data.data[0].flight_status;
  }
}

// Function that formats the date
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

// Event listener for the search button
searchBtn.addEventListener("click", getFlights);

// Event listener for the back button
backBtn.addEventListener("click", () => {
  searchContainer.classList.remove("hidden");
  detailsContainer.classList.add("hidden");
  getFlights();
});
