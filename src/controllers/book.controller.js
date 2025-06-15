const Book = require("../models/bookModels");
const {
  sendBookCreationEmail,
} = require("../middleware/send-email.middleware");

const getWelcome = (req, res) => {
  res.send("Simple Book API using Node.js, Express, and MongoDB with Mongoose");
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID", error: err.message });
  }
};

const addBook = async (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }

  try {
    const newBook = new Book({ title, author });
    const savedBook = await newBook.save();

    // Send email notification asynchronously (don't wait for it to complete)
    sendBookCreationEmail(savedBook)
      .then((result) => {
        if (result.success) {
          console.log(
            `✅ Email notification sent successfully for book: "${savedBook.title}"`
          );
        } else {
          console.log(
            `⚠️ Email notification failed for book: "${savedBook.title}" - ${result.error}`
          );
        }
      })
      .catch((error) => {
        console.error(
          `❌ Unexpected error sending email for book: "${savedBook.title}"`,
          error
        );
      });

    // Return the response immediately (don't wait for email)
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ message: "Failed to add book", error: err.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const { title, author } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author },
      { new: true, runValidators: true }
    );

    if (!updatedBook)
      return res.status(404).json({ message: "Book not found" });

    res.json(updatedBook);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook)
      return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book deleted successfully", book: deletedBook });
  } catch (err) {
    res.status(400).json({ message: "Delete failed", error: err.message });
  }
};

module.exports = {
  getWelcome,
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
};
