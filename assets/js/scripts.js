/** Variables */
const apiKey = "38c7d77d40ecff4ba100b9a4fd0a182d";
const baseUrl = "http://api.aviationstack.com/v1/flights";

function getFlights() {
  // let departure = departureInput.value;
  // let arrival = arrivalInput.value;
  // let airline = airlineInput.value;

  let departure = "YYZ";
  let arrival = "LAX";
  let airline = "Air Canada";

if (departure === "") {
    alert("Please enter a movie title");
  } else {
    let url = `${baseUrl}?access_key=${apiKey}&dep_iata=${departure}&arr_iata=${arrival}&airline_name=${airline}`;
    console.log(url);

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
}

// getFlights();
