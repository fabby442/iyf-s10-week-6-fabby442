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