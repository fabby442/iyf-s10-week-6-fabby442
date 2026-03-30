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