const http = require("http");
const fs = require("fs").promises; // Using promises API
const path = require("path");
const url = require("url");
const EventEmitter = require("events");

const fileEvents = new EventEmitter();

fileEvents.on("fileAction", (action, filename) => {
  console.log(`File ${action}: ${filename}`);
});

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname; // /create
  const filename = parsedUrl.query.filename; // ?filename=example.txt
  const content = parsedUrl.query.content; // ?content=example content
  const filepath = path.join(__dirname, filename || "default.txt");

  try {
    if (!filename) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Filename is required");
      return;
    }
    if (pathname === "/create") {
      await fs.writeFile(filepath, content || "Hello, this is a new file!");
      fileEvents.emit("fileAction", "created", filename);
      res.writeHead(200);
      res.end(`File ${filename} created successfully`); //
    } else if (pathname === "/read") {
      const data = await fs.readFile(filepath, "utf8");
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(data);
    } else if (pathname === "/update") {
      if (!content) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Content is required for update");
        return;
      }
      await fs.appendFile(filepath, `\n${content}`);
      fileEvents.emit("fileAction", "updated", filename);
      res.writeHead(200);
      res.end(`File ${filename} updated successfully`);
    } else if (pathname === "/delete") {
      await fs.unlink(filepath);
      fileEvents.emit("fileAction", "deleted", filename);
      res.writeHead(200);
      res.end(`File ${filename} deleted successfully`);
    } else {
      res.writeHead(404);
      res.end("Invalid route");
    }
  } catch (err) {
    res.writeHead(500);
    res.end(`Error: ${err.message}`);
  }
});

const port = 3000;
const host = "localhost";

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
