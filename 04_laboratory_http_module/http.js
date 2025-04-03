const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/greet") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello, NodeJs");
  } else {
    res.statusCode = 404;
    res.end("Page not found");
  }
});

const port = 3000;
const hostname = "localhost";

// server.listen(port, hostname) => {
//   console.log(`Server running at ${hostname} ${port}`);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
// server.listen(3000, "localhost", () => {
//   console.log("Server running at http://localhost:3000/greet");
// });
