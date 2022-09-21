function formatDate(timestamp) {
  let now = new Date(timestamp);
  let date = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let year = now.getFullYear();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];
  return `${date} ${month} ${year}, ${hours}:${minutes}`;
}
const apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios(apiUrl).then(displayForecast);
}

let getWeather = function (response) {
  console.log(response.data);
  let temp = document.querySelector("#temp");
  celsiusTemp = response.data.main.temp;
  temp.innerHTML = Math.round(celsiusTemp);
  let city = document.querySelector("#city");
  city.innerHTML = response.data.name;
  let weather = document.querySelector("#weather-sky");
  weather.innerHTML = response.data.weather[0].main;
  let tempMax = document.querySelector("#temp-max");
  tempMax.innerHTML = Math.round(response.data.main.temp_max);
  let tempMin = document.querySelector("#temp-min");
  tempMin.innerHTML = Math.round(response.data.main.temp_min);
  let windSpeed = document.querySelector("#wind-speed");
  windSpeed.innerHTML = Math.round(response.data.wind.speed);
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.humidity;
  let date = document.querySelector("#current-date");
  date.innerHTML = formatDate(response.data.dt * 1000);
  let icon = document.querySelector("#icon");
  icon.setAttribute("src", `images/${response.data.weather[0].icon}.svg`);
  icon.setAttribute("alt", response.data.weather[0].description);
  toCelsius(event);
  getForecast(response.data.coord);
};

function showLocation(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrlCur = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios(apiUrlCur).then(getWeather);
}
function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showLocation);
}

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", getCurrentPosition);

function getApi(city) {
  const apiKey = "5f472b7acba333cd8a035ea85a0d4d4c";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios(apiUrl).then(getWeather);
}
let changeCity = function (event) {
  event.preventDefault();
  let h3 = document.querySelector("h3");
  let city = document.querySelector("#input-city");
  h3.innerHTML = city.value;
  getApi(city.value);
};

getApi("Kyiv");
let searchCity = document.querySelector("#change-city-form");
searchCity.addEventListener("submit", changeCity);
let searchCityBut = document.querySelector("#search-city-button");
searchCityBut.addEventListener("click", changeCity);

let temp = document.querySelector("#temp").innerHTML;
let celsiusTemp = null;

let toCelsius = function (event) {
  event.preventDefault();
  currentTempInFahrenheit.classList.remove("active");
  currentTempInCel.classList.add("active");
  let currentTemp = document.querySelector("#temp");
  currentTemp.innerHTML = Math.round(celsiusTemp);
};

let toFahrenheit = function (event) {
  event.preventDefault();
  currentTempInCel.classList.remove("active");
  currentTempInFahrenheit.classList.add("active");
  let currentTemp = document.querySelector("#temp");
  currentTemp.innerHTML = Math.round(celsiusTemp * 1.8 + 32);
};

let currentTempInCel = document.querySelector("#celsius");
currentTempInCel.addEventListener("click", toCelsius);

let currentTempInFahrenheit = document.querySelector("#fahrenheit");
currentTempInFahrenheit.addEventListener("click", toFahrenheit);

function displayForecast(response) {
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row row-cols-5">`;

  for (let i = 1; i <= 5; i = i + 1) {
    forecastHTML =
      forecastHTML +
      `
      <div class="col"">
        <div class="week-days">${
          days[new Date(response.data.daily[i].dt * 1000).getDay()]
        }</div><div class="days-forecast-icon"><img src="images/${
        response.data.daily[i].weather[0].icon
      }.svg" class="days-forecast-icon" width="25px"/></div>
          <div class="temperature">${Math.round(
            response.data.daily[i].temp.day
          )}°C</div>
        </div>
          `;
  }

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
