const express = require("express");
const connectDB = require("./src/config/db");
require("dotenv").config();
const app = express();
const bookRoutes = require("./src/routes/book.Routes");
const authRoutes = require("./src/routes/auth.routes");
const authMiddleware = require("./src/middleware/auth.middleware");

//middleware to allow JSON format
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //middleware to allow form encoded data
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/", authMiddleware, bookRoutes); // Protect all book routes

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
