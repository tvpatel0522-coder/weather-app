document.addEventListener("DOMContentLoaded", () => {
    // Buttons & Elements
    const startBtn = document.getElementById("start-btn");
    const googleLoginBtn = document.getElementById("google-login-btn");
    const googleModal = document.getElementById("google-modal");
    const selectAccounts = document.querySelectorAll(".select-account");
    const searchBtn = document.getElementById("search-btn");

    // Views
    const welcomeView = document.getElementById("welcome-view");
    const loginView = document.getElementById("login-view");
    const homeView = document.getElementById("home-view");
    const aboutView = document.getElementById("about-view");
    const navbar = document.getElementById("navbar");

    // Nav Links
    const navHome = document.getElementById("nav-home");
    const navAbout = document.getElementById("nav-about");

    // Cards in Home
    const welcomeCard = document.getElementById("welcome-card");
    const weatherResults = document.getElementById("weather-results");

    // 1. Get Started -> Open Login Screen
    if (startBtn) {
        startBtn.addEventListener("click", () => {
            welcomeView.style.display = "none";
            loginView.style.display = "block";
        });
    }

    // 2. Google Login Button -> Open Google Account Popup Modal
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener("click", () => {
            googleModal.style.display = "flex";
        });
    }

    // 3. Account Select -> Go to Weather Dashboard
    selectAccounts.forEach(item => {
        item.addEventListener("click", () => {
            googleModal.style.display = "none";
            loginView.style.display = "none";
            homeView.style.display = "block";
            navbar.style.display = "flex";
        });
    });

    // 4. Navigation Switch (Home <-> About)
    if (navHome && navAbout) {
        navHome.addEventListener("click", (e) => {
            e.preventDefault();
            navHome.classList.add("active");
            navAbout.classList.remove("active");
            homeView.style.display = "block";
            aboutView.style.display = "none";
        });

        navAbout.addEventListener("click", (e) => {
            e.preventDefault();
            navAbout.classList.add("active");
            navHome.classList.remove("active");
            homeView.style.display = "none";
            aboutView.style.display = "block";
        });
    }

    // 5. Search Weather Click
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            welcomeCard.style.display = "none";
            weatherResults.style.display = "block";
        });
    }
});