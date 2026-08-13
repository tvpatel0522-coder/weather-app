document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // GET HTML ELEMENTS
    // =========================
    const startBtn = document.getElementById("start-btn");
    const googleLoginBtn = document.getElementById("google-login-btn");
    const googleModal = document.getElementById("google-modal");
    const accounts = document.querySelectorAll(".select-account");

    const welcomeView = document.getElementById("welcome-view");
    const loginView = document.getElementById("login-view");
    const homeView = document.getElementById("home-view");
    const aboutView = document.getElementById("about-view");

    const navbar = document.getElementById("navbar");
    const navHome = document.getElementById("nav-home");
    const navAbout = document.getElementById("nav-about");

    const cityInput = document.getElementById("city-input");
    const searchBtn = document.getElementById("search-btn");

    const welcomeCard = document.getElementById("welcome-card");
    const weatherResults = document.getElementById("weather-results");

    const weatherIcon = document.getElementById("weather-icon");
    const tempDisplay = document.getElementById("temp-display");
    const cityDisplay = document.getElementById("city-display");
    const conditionDisplay = document.getElementById("condition-display");

    const humidityVal = document.getElementById("humidity-val");
    const windVal = document.getElementById("wind-val");
    const pressureVal = document.getElementById("pressure-val");
    const visVal = document.getElementById("vis-val");

    const forecastContainer = document.getElementById("forecast-container");

    // =========================
    // BACKEND URL (દૂર કરેલ છેડે રહેલો Extra /)
    // =========================
    const BACKEND_URL = "https://weather-backend-2aol.onrender.com";

    // =========================
    // GET STARTED & LOGIN
    // =========================
    if (startBtn) {
        startBtn.addEventListener("click", function () {
            welcomeView.style.display = "none";
            loginView.style.display = "flex";
        });
    }

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", function () {
            googleModal.style.display = "flex";
        });
    }

    accounts.forEach(function (account) {
        account.addEventListener("click", function () {
            googleModal.style.display = "none";
            loginView.style.display = "none";
            homeView.style.display = "block";
            navbar.style.display = "flex";
        });
    });

    // =========================
    // NAVIGATION
    // =========================
    if (navHome) {
        navHome.addEventListener("click", function (event) {
            event.preventDefault();
            navHome.classList.add("active");
            navAbout.classList.remove("active");
            homeView.style.display = "block";
            aboutView.style.display = "none";
        });
    }

    if (navAbout) {
        navAbout.addEventListener("click", function (event) {
            event.preventDefault();
            navAbout.classList.add("active");
            navHome.classList.remove("active");
            homeView.style.display = "none";
            aboutView.style.display = "block";
        });
    }

    // =========================
    // SEARCH LISTENERS
    // =========================
    if (searchBtn) {
        searchBtn.addEventListener("click", searchWeather);
    }

    if (cityInput) {
        cityInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                searchWeather();
            }
        });
    }

    // =========================
    // WEATHER FUNCTION
    // =========================
    async function searchWeather() {
        const city = cityInput.value.trim();

        if (city === "") {
            alert("Please enter a city name.");
            return;
        }

        searchBtn.disabled = true;
        searchBtn.textContent = "Loading...";

        try {
            const url = `${BACKEND_URL}/api/weather?city=${encodeURIComponent(city)}`;
            console.log("Fetching URL:", url);

            const response = await fetch(url);
            console.log("Response Status:", response.status);

            if (!response.ok) {
                throw new Error(`Backend Error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Received Weather Data:", data);

            // WeatherAPI.com Response Format
            if (!data.location || !data.current) {
                throw new Error("Invalid structure from Backend. Check if backend uses WeatherAPI.");
            }

            // SHOW WEATHER
            if(welcomeCard) welcomeCard.style.display = "none";
            if(weatherResults) weatherResults.style.display = "block";

            // DATA POPULATION
            cityDisplay.textContent = `${data.location.name}, ${data.location.country}`;
            tempDisplay.textContent = `${data.current.temp_c}°C`;
            conditionDisplay.textContent = data.current.condition.text;

            let iconUrl = data.current.condition.icon;
            if (iconUrl.startsWith("//")) {
                iconUrl = "https:" + iconUrl;
            }
            weatherIcon.innerHTML = `<img src="${iconUrl}" alt="Weather" width="90" height="90">`;

            humidityVal.textContent = `${data.current.humidity}%`;
            windVal.textContent = `${data.current.wind_kph} km/h`;
            pressureVal.textContent = `${data.current.pressure_mb} mb`;
            visVal.textContent = `${data.current.vis_km} km`;

            // FORECAST
            forecastContainer.innerHTML = "";
            if (data.forecast && data.forecast.forecastday) {
                data.forecast.forecastday.forEach(function (day) {
                    const forecastCard = document.createElement("div");
                    forecastCard.className = "card forecast-card";

                    const date = new Date(day.date);
                    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

                    let dayIcon = day.day.condition.icon;
                    if (dayIcon.startsWith("//")) {
                        dayIcon = "https:" + dayIcon;
                    }

                    forecastCard.innerHTML = `
                        <h3>${dayName}</h3>
                        <p>${day.date}</p>
                        <img src="${dayIcon}" alt="Weather" width="65" height="65">
                        <h2>${day.day.avgtemp_c}°C</h2>
                        <p>${day.day.condition.text}</p>
                        <p>🌡️ Max: ${day.day.maxtemp_c}°C</p>
                        <p>🌡️ Min: ${day.day.mintemp_c}°C</p>
                        <p>💧 Rain: ${day.day.daily_chance_of_rain}%</p>
                    `;
                    forecastContainer.appendChild(forecastCard);
                });
            }

        } catch (error) {
            console.error("Weather Error Details:", error);
            alert(`Error: ${error.message}\n\nPlease check Console (F12) for more details.`);
        } finally {
            searchBtn.disabled = false;
            searchBtn.textContent = "Search";
        }
    }
});