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

// Predict output example
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
setTimeout(() => console.log("D"), 100);
console.log("E");
// Callback example
function loadUser(userId, callback) {
    console.log(`Loading user ${userId}...`);
    setTimeout(() => {
        const user = { id: userId, name: `User${userId}` };
        callback(user);
    }, 1500); // simulate database delay
}

// Use it
loadUser(1, (user) => {
    console.log("User loaded:", user);
});
// Callback Hell / Pyramid of Doom
function getUserData(userId, callback) {
    setTimeout(() => {
        callback({ id: userId, name: "John" });
    }, 1000);
}

function getUserPosts(userId, callback) {
    setTimeout(() => {
        callback([
            { id: 1, title: "Post 1" },
            { id: 2, title: "Post 2" }
        ]);
    }, 1000);
}

function getPostComments(postId, callback) {
    setTimeout(() => {
        callback([
            { id: 1, text: "Great post!" },
            { id: 2, text: "Thanks for sharing" }
        ]);
    }, 1000);
}

// Nightmare of nested callbacks
getUserData(1, function(user) {
    console.log("User:", user);
    getUserPosts(user.id, function(posts) {
        console.log("Posts:", posts);
        getPostComments(posts[0].id, function(comments) {
            console.log("Comments:", comments);
        });
    });
});
function getUserData(userId) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve({ id: userId, name: "John" });
            } else {
                reject("Invalid user ID");
            }
        }, 1000);
    });
}

function getUserPosts(userId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, title: "Post 1" },
                { id: 2, title: "Post 2" }
            ]);
        }, 1000);
    });
}

function getPostComments(postId) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, text: "Great post!" },
                { id: 2, text: "Thanks for sharing" }
            ]);
        }, 1000);
    });
}
getUserData(1)
    .then(user => {
        console.log("User:", user);
        return getUserPosts(user.id);
    })
    .then(posts => {
        console.log("Posts:", posts);
        return getPostComments(posts[0].id);
    })
    .then(comments => {
        console.log("Comments:", comments);
    })
    .catch(error => {
        console.error("Error:", error);
    });
    async function getUserDataAsync(userId) {
    try {
        const user = await getUserData(userId);
        const posts = await getUserPosts(user.id);
        const comments = await getPostComments(posts[0].id);
        return { user, posts, comments };
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Using it:
(async () => {
    const data = await getUserDataAsync(1);
    console.log("Async/Await result:", data);
})();
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const container = document.getElementById("users-container");

async function loadUsers() {
    try {
        showLoading();
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const users = await response.json();
        displayUsers(users);
    } catch (err) {
        showError(err.message);
    } finally {
        hideLoading();
    }
}

function showLoading() {
    loading.classList.remove("hidden");
    container.innerHTML = "";
}

function hideLoading() {
    loading.classList.add("hidden");
}

function showError(message) {
    errorDiv.textContent = `Error: ${message}`;
    errorDiv.classList.remove("hidden");
}

function hideError() {
    errorDiv.classList.add("hidden");
}

function displayUsers(users) {
    container.innerHTML = users.map(user => `
        <div class="user-card">
            <h2>${user.name}</h2>
            <p>📧 ${user.email}</p>
            <p>🏢 ${user.company.name}</p>
            <p>📍 ${user.address.city}</p>
        </div>
    `).join("");
}

// Initialize
loadUsers();
const postForm = document.getElementById("post-form");
const postResult = document.getElementById("post-result");

async function createPost(title, body, userId) {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, body, userId })
        });

        if (!response.ok) throw new Error("Failed to create post");

        const data = await response.json();
        displayPostResult(data);
    } catch (err) {
        postResult.textContent = `Error: ${err.message}`;
        postResult.classList.remove("hidden");
    }
}

function displayPostResult(post) {
    postResult.innerHTML = `
        <h3>Post Created!</h3>
        <p>🆔 ID: ${post.id}</p>
        <p>Title: ${post.title}</p>
        <p>Content: ${post.body}</p>
        <p>User ID: ${post.userId}</p>
    `;
    postResult.classList.remove("hidden");
}

// Handle form submission
postForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("post-title").value.trim();
    const body = document.getElementById("post-body").value.trim();
    const userId = parseInt(document.getElementById("post-userId").value.trim());
    if (title && body && userId) {
        createPost(title, body, userId);
        postForm.reset();
    }
});