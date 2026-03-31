// ========================
// ASYNC BASICS PAGE
// ========================
if (document.getElementById("async-output")) {
    const output = document.getElementById("async-output");

    // Synchronous
    output.textContent += "1 - Start\n";
    output.textContent += "2 - Middle\n";
    output.textContent += "3 - End\n";

    // Asynchronous
    output.textContent += "1 - Start (Async)\n";
    setTimeout(() => {
        output.textContent += "2 - This is delayed\n";
    }, 2000);
    output.textContent += "3 - End\n";

    // Callback example
    function loadUser(userId, callback) {
        output.textContent += `Loading user ${userId}...\n`;
        setTimeout(() => {
            const user = { id: userId, name: `User${userId}` };
            callback(user);
        }, 1500);
    }

    loadUser(1, (user) => {
        output.textContent += `User loaded: ${JSON.stringify(user)}\n`;
    });

    // Promise example
    function getUserData(userId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (userId > 0) resolve({ id: userId, name: "John" });
                else reject("Invalid user ID");
            }, 1000);
        });
    }

    function getUserPosts(userId) {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
                { id: 1, title: "Post 1" },
                { id: 2, title: "Post 2" }
            ]), 1000);
        });
    }

    function getPostComments(postId) {
        return new Promise((resolve) => {
            setTimeout(() => resolve([
                { id: 1, text: "Great post!" },
                { id: 2, text: "Thanks for sharing" }
            ]), 1000);
        });
    }

    // Promise chaining
    getUserData(1)
        .then(user => {
            output.textContent += `User: ${JSON.stringify(user)}\n`;
            return getUserPosts(user.id);
        })
        .then(posts => {
            output.textContent += `Posts: ${JSON.stringify(posts)}\n`;
            return getPostComments(posts[0].id);
        })
        .then(comments => {
            output.textContent += `Comments: ${JSON.stringify(comments)}\n`;
        })
        .catch(error => {
            output.textContent += `Error: ${error}\n`;
        });

    // Async/Await
    (async () => {
        try {
            const user = await getUserData(1);
            const posts = await getUserPosts(user.id);
            const comments = await getPostComments(posts[0].id);
            output.textContent += `Async/Await Result: ${JSON.stringify({ user, posts, comments })}\n`;
        } catch (err) {
            output.textContent += `Error: ${err}\n`;
        }
    })();
}

// ========================
// USER DIRECTORY PAGE
// ========================
if (document.getElementById("users-container")) {
    const loadingUsers = document.getElementById("loading-users");
    const errorUsers = document.getElementById("error-users");
    const container = document.getElementById("users-container");
    const postForm = document.getElementById("post-form");
    const postResult = document.getElementById("post-result");
    let allUsers = [];

    async function fetchUsers() {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        return res.json();
    }

    function showLoading() {
        loadingUsers.classList.remove("hidden");
        container.innerHTML = "";
    }

    function hideLoading() {
        loadingUsers.classList.add("hidden");
    }

    function showError(msg) {
        errorUsers.textContent = `Error: ${msg}`;
        errorUsers.classList.remove("hidden");
    }

    function hideError() {
        errorUsers.classList.add("hidden");
    }

    function displayUsers(users) {
        container.innerHTML = users.map(u => `
            <div class="user-card">
                <h2>${u.name}</h2>
                <p>📧 ${u.email}</p>
                <p>🏢 ${u.company.name}</p>
                <p>📍 ${u.address.city}</p>
            </div>
        `).join("");
    }

    function populateCityFilter(users) {
        const citySelect = document.getElementById("filter-city");
        const cities = Array.from(new Set(users.map(u => u.address.city)));
        cities.forEach(city => {
            const option = document.createElement("option");
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }

    function updateDisplay() {
        const query = document.getElementById("search").value.toLowerCase();
        const sortOrder = document.getElementById("sort").value;
        const cityFilter = document.getElementById("filter-city").value;

        let filtered = allUsers.filter(u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
        if (cityFilter !== "all") filtered = filtered.filter(u => u.address.city === cityFilter);
        filtered.sort((a, b) => sortOrder === "az" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        displayUsers(filtered);
    }

    async function createPost(title, body, userId) {
        try {
            const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, body, userId })
            });
            if (!res.ok) throw new Error("Failed to create post");
            const data = await res.json();
            postResult.innerHTML = `
                <h3>Post Created!</h3>
                <p>🆔 ID: ${data.id}</p>
                <p>Title: ${data.title}</p>
                <p>Content: ${data.body}</p>
                <p>User ID: ${data.userId}</p>
            `;
            postResult.classList.remove("hidden");
        } catch (err) {
            postResult.textContent = `Error: ${err.message}`;
            postResult.classList.remove("hidden");
        }
    }

    async function initUsers() {
        try {
            showLoading();
            allUsers = await fetchUsers();
            displayUsers(allUsers);
            populateCityFilter(allUsers);
        } catch (err) {
            showError(err.message);
        } finally {
            hideLoading();
        }

        document.getElementById("search").addEventListener("input", updateDisplay);
        document.getElementById("sort").addEventListener("change", updateDisplay);
        document.getElementById("filter-city").addEventListener("change", updateDisplay);

        postForm.addEventListener("submit", e => {
            e.preventDefault();
            const title = document.getElementById("post-title").value.trim();
            const body = document.getElementById("post-body").value.trim();
            const userId = parseInt(document.getElementById("post-userId").value.trim());
            if (title && body && userId) createPost(title, body, userId);
            postForm.reset();
        });
    }

    initUsers();
}

// ========================
// WEATHER PAGE
// ========================
if (document.getElementById("weather-display")) {
    const API_KEY = "YOUR_API_KEY_HERE"; // replace with your OpenWeatherMap key
    const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
    const form = document.getElementById("search-form");
    const cityInput = document.getElementById("city-input");
    const loadingWeather = document.getElementById("loading-weather");
    const errorWeather = document.getElementById("error-weather");
    const weatherDisplay = document.getElementById("weather-display");

    const cityName = document.getElementById("city-name");
    const weatherIcon = document.getElementById("weather-icon");
    const description = document.getElementById("description");
    const temperature = document.getElementById("temperature");
    const feelsLike = document.getElementById("feels-like");
    const humidity = document.getElementById("humidity");
    const wind = document.getElementById("wind");
    const pressure = document.getElementById("pressure");

    function showLoading() {
        loadingWeather.classList.remove("hidden");
        weatherDisplay.classList.add("hidden");
    }

    function hideLoading() {
        loadingWeather.classList.add("hidden");
    }

    function showError(msg) {
        errorWeather.textContent = msg;
        errorWeather.classList.remove("hidden");
    }

    function hideError() {
        errorWeather.classList.add("hidden");
    }

    function displayWeather(data) {
        cityName.textContent = `${data.name}, ${data.sys.country}`;
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        description.textContent = data.weather[0].description;
        temperature.textContent = `Temp: ${data.main.temp}°C`;
        feelsLike.textContent = `Feels Like: ${data.main.feels_like}°C`;
        humidity.textContent = `Humidity: ${data.main.humidity}%`;
        wind.textContent = `Wind: ${data.wind.speed} m/s`;
        pressure.textContent = `Pressure: ${data.main.pressure} hPa`;
        weatherDisplay.classList.remove("hidden");
    }

    async function getWeather(city) {
        try {
            showLoading();
            hideError();
            const res = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
            if (!res.ok) {
                if (res.status === 404) throw new Error("City not found");
                else throw new Error("Failed to fetch weather data");
            }
            const data = await res.json();
            displayWeather(data);
        } catch (err) {
            showError(err.message);
        } finally {
            hideLoading();
        }
    }

    form.addEventListener("submit", e => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) getWeather(city);
    });
}