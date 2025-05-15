const express = require("express");
const connectDB = require("./src/config/db");
require("dotenv").config();
const app = express();
const bookRoutes = require("./src/routes/book.Routes");

//middleware to allow JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //middleware to allow form encoded data
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Routes
app.use("/", bookRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
