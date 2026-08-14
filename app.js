document.addEventListener("DOMContentLoaded", () => {
    // 🔑 Replace this with your new active API Key from weatherapi.com
    const BACKEND_URL= "https://weather-backend-2aol.onrender.com"; 

    // DOM Elements
    const startBtn = document.getElementById("start-btn");
    const googleLoginBtn = document.getElementById("google-login-btn");
    const googleModal = document.getElementById("google-modal");
    const selectAccounts = document.querySelectorAll(".select-account");
    
    const cityInput = document.getElementById("city-input");
    const searchBtn = document.getElementById("search-btn");

    // Views
    const welcomeView = document.getElementById("welcome-view");
    const loginView = document.getElementById("login-view");
    const homeView = document.getElementById("home-view");
    const aboutView = document.getElementById("about-view");
    const navbar = document.getElementById("navbar");

    const navHome = document.getElementById("nav-home");
    const navAbout = document.getElementById("nav-about");

    const welcomeCard = document.getElementById("welcome-card");
    const weatherResults = document.getElementById("weather-results");

    // UI Result Elements
    const cityDisplay = document.getElementById("city-display");
    const tempDisplay = document.getElementById("temp-display");
    const conditionDisplay = document.getElementById("condition-display");
    const weatherIcon = document.getElementById("weather-icon");
    const humidityVal = document.getElementById("humidity-val");
    const windVal = document.getElementById("wind-val");
    const pressureVal = document.getElementById("pressure-val");
    const visVal = document.getElementById("vis-val");
    const forecastContainer = document.getElementById("forecast-container");

    // STEP 1: WELCOME SCREEN TO LOGIN SCREEN
    if (startBtn) {
        startBtn.addEventListener("click", () => {
            if (welcomeView) welcomeView.style.display = "none";
            if (loginView) loginView.style.display = "block";
        });
    }

    // STEP 2: OPEN GOOGLE MODAL POPUP
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", () => {
            if (googleModal) googleModal.style.display = "flex";
        });
    }

    // STEP 3: ACCOUNT SELECTION TO DASHBOARD
    selectAccounts.forEach(item => {
        item.addEventListener("click", () => {
            if (googleModal) googleModal.style.display = "none";
            if (loginView) loginView.style.display = "none";
            if (homeView) homeView.style.display = "block";
            if (navbar) navbar.style.display = "flex";
        });
    });

    // STEP 4: NAVIGATION SWITCHING (HOME / ABOUT)
    if (navHome && navAbout) {
        navHome.addEventListener("click", (e) => {
            e.preventDefault();
            navHome.classList.add("active");
            navAbout.classList.remove("active");
            if (homeView) homeView.style.display = "block";
            if (aboutView) aboutView.style.display = "none";
        });

        navAbout.addEventListener("click", (e) => {
            e.preventDefault();
            navAbout.classList.add("active");
            navHome.classList.remove("active");
            if (homeView) homeView.style.display = "none";
            if (aboutView) aboutView.style.display = "block";
        });
    }

    // STEP 5: FETCH WEATHER DATA & FORECAST
    async function fetchWeather(city) {
        if (!city || !city.trim()) {
            alert("Please enter a city name!");
            return;
        }

        try {
            const url = "https://api.weatherapi.com/v1/forecast.json?key=" + API_KEY + "&q=" + encodeURIComponent(city.trim()) + "&days=5&aqi=no&alerts=no";
            const response = await fetch(url);
            const data = await response.json();
            
            if (!response.ok) {
                if (data.error && data.error.code === 2006) {
                    alert("Invalid API Key! Please update your WeatherAPI Key in app.js.");
                } else if (data.error && data.error.message) {
                    alert(data.error.message);
                } else {
                    alert("City not found! Please check spelling.");
                }
                return;
            }

            // Update Current Weather Details
            if (cityDisplay) cityDisplay.textContent = data.location.name + ", " + data.location.country;
            if (tempDisplay) tempDisplay.textContent = data.current.temp_c + "°C";
            if (conditionDisplay) conditionDisplay.textContent = data.current.condition.text;
            if (humidityVal) humidityVal.textContent = data.current.humidity + "%";
            if (windVal) windVal.textContent = data.current.wind_kph + " km/h";
            if (pressureVal) pressureVal.textContent = data.current.pressure_mb + " mb";
            if (visVal) visVal.textContent = data.current.vis_km + " km";

            // Dynamic Weather Emoji
            const cond = data.current.condition.text.toLowerCase();
            if (weatherIcon) {
                if (cond.includes("rain") || cond.includes("drizzle")) weatherIcon.textContent = "🌧️";
                else if (cond.includes("cloud") || cond.includes("overcast")) weatherIcon.textContent = "☁️";
                else if (cond.includes("sunny") || cond.includes("clear")) weatherIcon.textContent = "☀️";
                else if (cond.includes("thunder")) weatherIcon.textContent = "🌩️";
                else if (cond.includes("snow")) weatherIcon.textContent = "❄️";
                else weatherIcon.textContent = "🌤️";
            }

            // Dynamically Build Forecast Grid
            if (forecastContainer) {
                forecastContainer.innerHTML = ""; 
                
                data.forecast.forecastday.forEach((dayData) => {
                    const dateObj = new Date(dayData.date);
                    const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

                    const forecastCond = dayData.day.condition.text.toLowerCase();
                    let fIcon = "🌤️";
                    if (forecastCond.includes("rain") || forecastCond.includes("drizzle")) fIcon = "🌧️";
                    else if (forecastCond.includes("cloud")) fIcon = "☁️";
                    else if (forecastCond.includes("sunny") || forecastCond.includes("clear")) fIcon = "☀️";
                    else if (forecastCond.includes("thunder")) fIcon = "🌩️";

                    const forecastCardHTML = 
                        '<div class="forecast-card">' +
                            '<div class="date">' + dayName + '</div>' +
                            '<div style="font-size: 2rem; margin: 8px 0;">' + fIcon + '</div>' +
                            '<div style="font-weight: bold; font-size: 1.1rem; color: #0f766e;">' + dayData.day.avgtemp_c + '°C</div>' +
                            '<div style="font-size: 0.8rem; color: #666; margin-top: 4px;">' + dayData.day.condition.text + '</div>' +
                            '<hr>' +
                            '<div style="font-size: 0.75rem; color: #555;">💧 ' + dayData.day.daily_chance_of_rain + '% Rain</div>' +
                        '</div>';

                    forecastContainer.insertAdjacentHTML("beforeend", forecastCardHTML);
                });
            }

            // Display Results Section
            if (welcomeCard) welcomeCard.style.display = "none";
            if (weatherResults) weatherResults.style.display = "block";

        } catch (error) {
            console.error("Error fetching weather:", error);
            alert("Unable to fetch weather data. Please check your internet or API key!");
        }
    }

    // Search Button Event Listener
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            const city = cityInput ? cityInput.value : "";
            fetchWeather(city);
        });
    }

    // Search on Enter Key Press
    if (cityInput) {
        cityInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                fetchWeather(cityInput.value);
            }
        });
    }
});