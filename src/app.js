function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formateDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2 date">
        <div class="weather-forecast-date">${formateDay(forecastDay.time)}</div>
        <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
          forecastDay.condition.icon
        }.png" alt="" width="80">
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max">${Math.round(
            forecastDay.temperature.maximum
          )}°</span> | 
          <span class="weather-forecast-temperature-min">${Math.round(
            forecastDay.temperature.minimum
          )}°</span>
        </div>
      </div>
      `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayForecast);
}

function switchTheme(description) {
  console.log(description);
  if (description.includes("clear") && description.includes("day")) {
    document.querySelector(
      "body"
    ).style.backgroundImage = `url(images/day/clear-sky-day.jpg)`;
  } else if (description.includes("clear")) {
    document.querySelector(
      "body"
    ).style.backgroundImage = `url(images/night/clear-night-sky.gif)`;
  } else if (description.includes("clouds") && description.includes("day")) {
    document.querySelector(
      "body"
    ).style.backgroundImage = `url(images/day/cloudy-sky.gif)`;
  } else if (description.includes("clouds")) {
    document.querySelector(
      "body"
    ).style.backgroundImage = `url(images/night/clouds-night-sky.gif)`;
  } else if (description.includes("rain") && description.includes("day")) {
    document.querySelector(
      "body"
    ).style.backgroundImage = `url(images/day/rain-day.gif)`;
  } else if (description.includes("rain")) {
    document.querySelector(
      "body"
    ).style.backgroundImage = `url(images/night/rain-night.gif)`;
  } else if (description.includes("thunderstorm") && description.includes("day")) {
    document.querySelector(
      "body"
    ).style.backgroundImage = `url(images/day/thunderstorm-day.gif)`;
  } else if (description.includes("thunderstorm")) {
    document.querySelector(
      "body"
    ).style.backgroundImage = `url(images/night/thunderstorm-night.gif)`;
  } else if (description.includes("snow") && description.includes("day")) {
    document.querySelector(
      "body"
    ).style.backgroundImage = `url(images/day/snow-day.gif)`;
  } else if (description.includes("snow")) {
    document.querySelector(
      "body"
    ).style.backgroundImage = `url(images/night/snow-night.gif)`;
  } else if (description.includes("mist") && description.includes("day")) {
    document.querySelector(
      "body"
    ).style.backgroundImage = `url(images/day/mist-day.gif)`;
  } else if (description.includes("mist")) {
    document.querySelector(
      "body"
    ).style.backgroundImage = `url(images/night/mist.gif)`;
  }
}

function displayTemperature(response, fromChange = false) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  temperature = response.data.temperature.current;

  temperatureElement.innerHTML = Math.round(temperature);
  cityElement.innerHTML = response.data.city;
  if (!fromChange) {
    descriptionElement.innerHTML = response.data.condition.description;
    humidityElement.innerHTML = response.data.temperature.humidity;
    windElement.innerHTML = Math.round(response.data.wind.speed);
  }
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);

  getForecast(response.data.coordinates);
  switchTheme(response.data.condition.icon);
}

function search(city, fromChange = false) {
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`;
  axios
    .get(apiUrl)
    .then((response) => displayTemperature(response, fromChange));
}

function handleSubmit(event) {
  event.preventDefault();
  cityInputElement = document.querySelector("#city-input").value;
  search(cityInputElement);
}

function showPosition(position) {
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}&key=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayTemperature);
}

function getCurrentLocation(event) {
  event.preventDefault();

  navigator.geolocation.getCurrentPosition(showPosition);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  units = "imperial";
  search(cityInputElement, true);
}

function convertToCelsius(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  units = "metric";
  search(cityInputElement, true);
}

let temperature = null;
let units = "metric";
let apiKey = "440o6ff7eac5aa3b204ce4a0etd053a2";
let cityInputElement = "London";

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", getCurrentLocation);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

search("London");
