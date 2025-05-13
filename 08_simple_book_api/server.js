const express = require("express");
const app = express();
const port = 3000;

// const monogoose = require("mongoose");

const bookRoutes = require("./src/routes/book.Routes");

app.use(express.json());
app.use("/", bookRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
