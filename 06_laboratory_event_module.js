const EventEmitter = require("events");
const emitter = new EventEmitter();

data = {
  name: "John Doe",
  age: 25,
};

error = {
  message: "An error occurred",
};

// Register a listener for the "greet" event
emitter.on("start", () => {
  console.log("Application Started!");
});

// emitter.on("data", (data) => {
//   console.log("Data Received:", `name: ${data.name} age: ${data.age}`);
// });

emitter.on("data", (data) => {
  console.log("Data Received:", data);
});

// emitter.on("error", (err) => {
//   console.error("Error occurred:", `${err.message}`);
// });

emitter.on("error", (error) => {
  console.error("Error occurred:", error);
});

emitter.emit("start");
// emitter.emit("data", { name: "Rafael", age: 25 }); // Emit the event
// emitter.emit("error", { message: "Something went wrong!" });
// emitter.emit("error", error.message);
emitter.emit("data", `name: ${data.name} age: ${data.age}`);
emitter.emit("error", `${error.message}`);
