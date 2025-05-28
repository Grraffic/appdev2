const express = require("express");
const router = express.Router();
const {
  getWelcome,
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
} = require("../controllers/book.controller");

router.get("/", getWelcome);
router.get("/books", getAllBooks);
router.get("/books/:id", getBookById);
router.post("/books", addBook);
router.patch("/books/:id", updateBook);
router.delete("/books/:id", deleteBook);

module.exports = router;
