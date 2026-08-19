// DOM Elements
const welcomeView = document.getElementById("welcome-view");
const loginView = document.getElementById("login-view");
const googleModal = document.getElementById("google-modal");
const homeView = document.getElementById("home-view");
const aboutView = document.getElementById("about-view");
const navbar = document.getElementById("navbar");

const startBtn = document.getElementById("start-btn");
const googleLoginBtn = document.getElementById("google-login-btn");
const accountItems = document.querySelectorAll(".select-account");

const navHome = document.getElementById("nav-home");
const navAbout = document.getElementById("nav-about");

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

const welcomeCard = document.getElementById("welcome-card");
const weatherResults = document.getElementById("weather-results");

// --- NAVIGATION & MODAL LOGIC ---

if (startBtn) {
  startBtn.addEventListener("click", function() {
    if (welcomeView) welcomeView.style.display = "none";
    if (loginView) loginView.style.display = "flex";
  });
}

if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", function() {
    if (googleModal) googleModal.style.display = "flex";
  });
}

accountItems.forEach(function(item) {
  item.addEventListener("click", function() {
    if (googleModal) googleModal.style.display = "none";
    if (loginView) loginView.style.display = "none";
    if (homeView) homeView.style.display = "block";
    if (navbar) navbar.style.display = "flex";
    
    getWeather();
  });
});

if (navHome) {
  navHome.addEventListener("click", function(e) {
    e.preventDefault();
    if (homeView) homeView.style.display = "block";
    if (aboutView) aboutView.style.display = "none";
    navHome.classList.add("active");
    if (navAbout) navAbout.classList.remove("active");
  });
}

if (navAbout) {
  navAbout.addEventListener("click", function(e) {
    e.preventDefault();
    if (homeView) homeView.style.display = "none";
    if (aboutView) aboutView.style.display = "block";
    navAbout.classList.add("active");
    if (navHome) navHome.classList.remove("active");
  });
}

// --- WEATHER LOGIC (NO API KEY REQUIRED) ---

if (searchBtn) {
  searchBtn.addEventListener("click", getWeather);
}

if (cityInput) {
  cityInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      getWeather();
    }
  });
}

function getWeatherCondition(code) {
  const weatherMap = {
    0: { text: "Clear Sky", icon: "☀️" },
    1: { text: "Mainly Clear", icon: "🌤️" },
    2: { text: "Partly Cloudy", icon: "⛅" },
    3: { text: "Overcast", icon: "☁️" },
    45: { text: "Foggy", icon: "🌫️" },
    48: { text: "Depositing Rime Fog", icon: "🌫️" },
    51: { text: "Light Drizzle", icon: "🌧️" },
    53: { text: "Moderate Drizzle", icon: "🌧️" },
    55: { text: "Dense Drizzle", icon: "🌧️" },
    61: { text: "Slight Rain", icon: "🌧️" },
    63: { text: "Moderate Rain", icon: "🌧️" },
    65: { text: "Heavy Rain", icon: "🌧️" },
    71: { text: "Slight Snow", icon: "❄️" },
    73: { text: "Moderate Snow", icon: "❄️" },
    75: { text: "Heavy Snow", icon: "❄️" },
    80: { text: "Rain Showers", icon: "🌧️" },
    81: { text: "Moderate Rain Showers", icon: "🌧️" },
    82: { text: "Violent Rain Showers", icon: "🌩️" },
    95: { text: "Thunderstorm", icon: "🌩️" },
    96: { text: "Thunderstorm with Hail", icon: "🌩️" }
  };
  return weatherMap[code] || { text: "Weather Clear", icon: "☀️" };
}

async function getWeather() {
  const city = cityInput ? cityInput.value.trim() : "";

  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  try {
    const geoUrl = "https://geocoding-api.open-meteo.com/v1/search?name=" + encodeURIComponent(city) + "&count=1&language=en&format=json";
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert("City not found! Please check spelling.");
      return;
    }

    const geoItem = geoData.results[0];
    const latitudeVal = geoItem.latitude;
    const longitudeVal = geoItem.longitude;
    const cityName = geoItem.name + (geoItem.country ? ", " + geoItem.country : "");

    const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + latitudeVal + "&longitude=" + longitudeVal + "&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto";
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    if (welcomeCard) welcomeCard.style.display = "none";
    if (weatherResults) weatherResults.style.display = "block";

    const current = weatherData.current;
    const condition = getWeatherCondition(current.weather_code);

    const cityElem = document.getElementById("city-display");
    const tempElem = document.getElementById("temp-display");
    const condElem = document.getElementById("condition-display");
    const iconElem = document.getElementById("weather-icon");

    if (cityElem) cityElem.innerText = cityName;
    if (tempElem) tempElem.innerText = Math.round(current.temperature_2m) + "°C";
    if (condElem) condElem.innerText = condition.text;
    if (iconElem) iconElem.innerText = condition.icon;

    const humElem = document.getElementById("humidity-val");
    const windElem = document.getElementById("wind-val");
    const pressElem = document.getElementById("pressure-val");
    const visElem = document.getElementById("vis-val");

    if (humElem) humElem.innerText = current.relative_humidity_2m + "%";
    if (windElem) windElem.innerText = current.wind_speed_10m + " km/h";
    if (pressElem) pressElem.innerText = Math.round(current.surface_pressure) + " mb";
    if (visElem) visElem.innerText = "10 km";

    const forecastContainer = document.getElementById("forecast-container");
    if (forecastContainer) {
      forecastContainer.innerHTML = "";

      const daily = weatherData.daily;

      for (let i = 0; i < 5; i++) {
        const dateObj = new Date(daily.time[i]);
        const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
        const dayCondition = getWeatherCondition(daily.weather_code[i]);
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);

        const card = document.createElement("div");
        card.className = "card forecast-card";
        card.innerHTML =
          '<div class="forecast-day">' + dayName + '</div>' +
          '<div class="forecast-icon">' + dayCondition.icon + '</div>' +
          '<div class="forecast-temp">' + maxTemp + '° / ' + minTemp + '°C</div>' +
          '<div class="forecast-desc">' + dayCondition.text + '</div>';

        forecastContainer.appendChild(card);
      }
    }

  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("Unable to fetch weather data. Please try again.");
  }
}