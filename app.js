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

    const forecastContainer =
        document.getElementById("forecast-container");


    // =========================
    // BACKEND URL
    // =========================

    const BACKEND_URL =
        "httpd"//weather-backend-2aol.onrender.com/";


    // =========================
    // GET STARTED
    // =========================

    if (startBtn) {

        startBtn.addEventListener("click", function () {

            welcomeView.style.display = "none";
            loginView.style.display = "flex";

        });

    }


    // =========================
    // GOOGLE LOGIN POPUP
    // =========================

    if (googleLoginBtn) {

        googleLoginBtn.addEventListener("click", function () {

            googleModal.style.display = "flex";

        });

    }


    // =========================
    // ACCOUNT SELECT
    // =========================

    accounts.forEach(function (account) {

        account.addEventListener("click", function () {

            googleModal.style.display = "none";
            loginView.style.display = "none";

            homeView.style.display = "block";
            navbar.style.display = "flex";

        });

    });


    // =========================
    // HOME NAVIGATION
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


    // =========================
    // ABOUT NAVIGATION
    // =========================

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
    // SEARCH BUTTON
    // =========================

    if (searchBtn) {

        searchBtn.addEventListener("click", function () {

            searchWeather();

        });

    }


    // =========================
    // ENTER KEY SEARCH
    // =========================

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

            const url =
                BACKEND_URL +
                "/api/weather?city=" +
                encodeURIComponent(city);


            console.log("Request:", url);


            const response = await fetch(url);


            console.log("Status:", response.status);


            if (!response.ok) {

                throw new Error(
                    "Backend error: " + response.status
                );

            }


            const data = await response.json();


            console.log("Weather data:", data);


            // =========================
            // CHECK DATA
            // =========================

            if (!data) {

                throw new Error(
                    "No weather data received."
                );

            }


            /*
             * WeatherAPI response normally has:
             *
             * location
             * current
             * forecast
             */


            if (!data.location || !data.current) {

                throw new Error(
                    "Invalid weather response from backend."
                );

            }


            // =========================
            // SHOW WEATHER SECTION
            // =========================

            welcomeCard.style.display = "none";
            weatherResults.style.display = "block";


            // =========================
            // LOCATION
            // =========================

            cityDisplay.textContent =
                data.location.name +
                ", " +
                data.location.country;


            // =========================
            // TEMPERATURE
            // =========================

            tempDisplay.textContent =
                data.current.temp_c + "°C";


            // =========================
            // CONDITION
            // =========================

            conditionDisplay.textContent =
                data.current.condition.text;


            // =========================
            // WEATHER ICON
            // =========================

            weatherIcon.innerHTML =
                '<img src="https:' +
                data.current.condition.icon +
                '" alt="Weather" width="90" height="90">';


            // =========================
            // HUMIDITY
            // =========================

            humidityVal.textContent =
                data.current.humidity + "%";


            // =========================
            // WIND
            // =========================

            windVal.textContent =
                data.current.wind_kph + " km/h";


            // =========================
            // PRESSURE
            // =========================

            pressureVal.textContent =
                data.current.pressure_mb + " mb";


            // =========================
            // VISIBILITY
            // =========================

            visVal.textContent =
                data.current.vis_km + " km";


            // =========================
            // 5 DAY FORECAST
            // =========================

            forecastContainer.innerHTML = "";


            if (
                data.forecast &&
                data.forecast.forecastday
            ) {

                data.forecast.forecastday.forEach(
                    function (day) {

                        const forecastCard =
                            document.createElement("div");

                        forecastCard.className =
                            "card forecast-card";


                        const date =
                            new Date(day.date);


                        const dayName =
                            date.toLocaleDateString(
                                "en-US",
                                {
                                    weekday: "long"
                                }
                            );


                        forecastCard.innerHTML =

                            "<h3>" +
                            dayName +
                            "</h3>" +

                            "<p>" +
                            day.date +
                            "</p>" +

                            '<img src="https:' +
                            day.day.condition.icon +
                            '" alt="Weather" width="65" height="65">' +

                            "<h2>" +
                            day.day.avgtemp_c +
                            "°C</h2>" +

                            "<p>" +
                            day.day.condition.text +
                            "</p>" +

                            "<p>🌡️ Max: " +
                            day.day.maxtemp_c +
                            "°C</p>" +

                            "<p>🌡️ Min: " +
                            day.day.mintemp_c +
                            "°C</p>" +

                            "<p>💧 Rain: " +
                            day.day.daily_chance_of_rain +
                            "%</p>";


                        forecastContainer.appendChild(
                            forecastCard
                        );

                    }
                );

            }


        } catch (error) {

            console.error(
                "Weather Error:",
                error
            );


            alert(
                "Weather data load nahi thayu.\n\n" +
                "Please check your backend URL and Render server."
            );


        } finally {

            searchBtn.disabled = false;
            searchBtn.textContent = "Search";

        }

    }

});