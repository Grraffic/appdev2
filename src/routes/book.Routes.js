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

// Import email middleware (alternative approach - currently not used)
// const { sendBookEmailMiddleware } = require("../middleware/send-email.middleware");

router.get("/", getWelcome);
router.get("/books", getAllBooks);
router.get("/books/:id", getBookById);

// Current approach: Email sending is handled inside the addBook controller
router.post("/books", addBook);

// Alternative approach using middleware (uncomment to use this instead):
// router.post("/books", addBook, sendBookEmailMiddleware);

router.patch("/books/:id", updateBook);
router.delete("/books/:id", deleteBook);

module.exports = router;
