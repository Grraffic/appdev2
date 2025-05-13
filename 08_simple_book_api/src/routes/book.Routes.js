const express = require("express");
const router = express.Router();
const {
  getWelcome,
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
} = require("../Controllers/book.controller");

router.get("/", getWelcome);
router.get("/api/books", getAllBooks);
router.get("/api/books/:id", getBookById);
router.post("/api/books", addBook);
router.patch("/api/books/:id", updateBook);
router.delete("/api/books/:id", deleteBook);

module.exports = router;
