// --- Configuration ---
const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your OpenWeatherMap key
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

// --- DOM Elements ---
const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
const forecastDisplay = document.getElementById("forecast-display");
const cityName = document.getElementById("city-name");
const forecastCards = document.getElementById("forecast-cards");

// --- Helper Functions ---
function showLoading() {
    loading.classList.remove("hidden");
    forecastDisplay.classList.add("hidden");
}

function hideLoading() { loading.classList.add("hidden"); }

function showError(msg) { 
    error.textContent = msg; 
    error.classList.remove("hidden"); 
}

function hideError() { error.classList.add("hidden"); }

// Display forecast
function displayForecast(city, list) {
    cityName.textContent = city;
    forecastCards.innerHTML = "";

    // Pick one forecast per day (12:00 PM)
    const daily = list.filter(f => f.dt_txt.includes("12:00:00"));

    daily.forEach(f => {
        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
            <p>${new Date(f.dt_txt).toLocaleDateString()}</p>
            <img src="https://openweathermap.org/img/wn/${f.weather[0].icon}@2x.png" alt="icon">
            <p>${f.main.temp}°C</p>
            <p>${f.weather[0].description}</p>
        `;
        forecastCards.appendChild(card);
    });

    forecastDisplay.classList.remove("hidden");
}

// Fetch weather
async function getForecast(city) {
    try {
        showLoading();
        hideError();
        const res = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        if (!res.ok) throw new Error(res.status === 404 ? "City not found" : "Failed to fetch");
        const data = await res.json();
        displayForecast(`${data.city.name}, ${data.city.country}`, data.list);
    } catch (err) { showError(err.message); }
    finally { hideLoading(); }
}

// --- Event Listener ---
form.addEventListener("submit", e => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) getForecast(city);
});